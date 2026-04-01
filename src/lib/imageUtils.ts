const OPTIMIZED_REMOTE_HOSTS = new Set(["res.cloudinary.com", "i.ytimg.com"]);

export const shouldUseUnoptimizedImage = (src?: string | null) => {
  if (!src) return false;
  if (!/^https?:\/\//i.test(src)) return false;

  try {
    const { hostname } = new URL(src);
    return !OPTIMIZED_REMOTE_HOSTS.has(hostname);
  } catch {
    // If URL parsing fails, keep Next.js optimization enabled for relative/local paths.
    return false;
  }
};
