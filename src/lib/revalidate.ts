/**
 * Triggers on-demand ISR revalidation for the given paths.
 * Calls the internal Next.js API route `/api/revalidate` with the
 * admin's JWT so changes appear immediately on the public site
 * without waiting for the background revalidate interval.
 *
 * Failures are silently ignored — the page will still refresh
 * eventually via the timed revalidate fallback.
 */
export async function triggerRevalidation(paths: string[]): Promise<void> {
  if (!paths.length) return;

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  if (!token) return;

  try {
    await fetch("/api/revalidate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ paths }),
    });
  } catch {
    // Non-critical — ISR will refresh on its own schedule
  }
}
