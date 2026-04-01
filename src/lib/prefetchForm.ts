// Simple prefetch helper to warm the Form chunk when user hovers/touches a CTA
export const prefetchForm = () => {
  // dynamic import: returns a promise; browsers/packers may prefetch/cache the chunk
  return import("@/pages/Form");
};

export default prefetchForm;
