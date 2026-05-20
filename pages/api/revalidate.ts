import type { NextApiRequest, NextApiResponse } from "next";

/**
 * On-demand ISR revalidation endpoint.
 * Called by the admin panel after saving a page or post so the
 * cached static page is rebuilt immediately without waiting for
 * the background revalidate interval.
 *
 * POST /api/revalidate
 * Body: { paths: string[] }
 * Header: Authorization: Bearer <adminJwt>
 *
 * The JWT is verified by forwarding it to the backend /auth/me endpoint.
 * This reuses the existing auth system with no extra secrets required.
 */

const BACKEND_URL = (
  process.env.API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000"
).replace(/\/api\/?$/, "");

type RevalidateBody = {
  paths?: string[];
};

async function isAdminToken(token: string): Promise<boolean> {
  try {
    const response = await fetch(`${BACKEND_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
      signal: AbortSignal.timeout(3000),
    });
    if (!response.ok) return false;
    const body = await response.json();
    const role: string = body?.data?.role ?? body?.role ?? "";
    return ["admin", "owner", "superadmin"].includes(role);
  } catch {
    return false;
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const authHeader = req.headers.authorization ?? "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";

  if (!token) {
    return res.status(401).json({ message: "Unauthorised" });
  }

  const allowed = await isAdminToken(token);
  if (!allowed) {
    return res.status(403).json({ message: "Forbidden" });
  }

  const { paths } = req.body as RevalidateBody;
  if (!paths || !Array.isArray(paths) || paths.length === 0) {
    return res.status(400).json({ message: "paths array is required" });
  }

  // Only allow safe relative paths (prevent open-redirect / path traversal)
  const safePaths = paths.filter(
    (p) => typeof p === "string" && p.startsWith("/") && !p.includes(".."),
  );

  if (safePaths.length === 0) {
    return res.status(400).json({ message: "No valid paths provided" });
  }

  const results: Record<string, "ok" | "error"> = {};
  await Promise.all(
    safePaths.map(async (path) => {
      try {
        await res.revalidate(path);
        results[path] = "ok";
      } catch {
        results[path] = "error";
      }
    }),
  );

  return res.status(200).json({ revalidated: true, results });
}
