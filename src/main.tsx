import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initializeDynamicSEO } from "./utils/dynamicSeo";

createRoot(document.getElementById("root")!).render(<App />);

// Run non-critical SEO/pixel initialization after the first paint.
const initializeSEOAfterPaint = () => {
	void initializeDynamicSEO();
};

if ("requestIdleCallback" in window) {
	(window as any).requestIdleCallback(initializeSEOAfterPaint, { timeout: 3000 });
} else {
	window.setTimeout(initializeSEOAfterPaint, 1200);
}
