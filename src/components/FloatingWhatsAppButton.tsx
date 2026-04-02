import { MessageCircle } from "lucide-react";

const WHATSAPP_URL = "https://wa.me/966511414537";

export default function FloatingWhatsAppButton() {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="تواصل معنا عبر واتساب"
      className="fixed bottom-4 left-4 md:bottom-6 md:left-6 z-[70] opacity-0 translate-y-6 animate-whatsapp-enter"
    >
      <div
        className="group flex items-center gap-3 rounded-2xl px-3 py-2.5 md:px-4 md:py-3 transition-all hover:-translate-y-1 hover:scale-[1.01] active:scale-[0.98]"
        style={{
          background: "rgba(12, 32, 22, 0.95)",
          border: "1px solid rgba(37, 211, 102, 0.55)",
          boxShadow: "0 0 24px rgba(37, 211, 102, 0.35), inset 0 0 16px rgba(37, 211, 102, 0.08)",
        }}
      >
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{
            background: "rgba(37, 211, 102, 0.12)",
            border: "1px solid rgba(37, 211, 102, 0.45)",
            boxShadow: "0 0 14px rgba(37, 211, 102, 0.35)",
          }}
        >
          <MessageCircle className="w-5 h-5" style={{ color: "#25d366" }} />
        </div>

        <div className="text-right leading-tight">
          <p className="text-[11px] md:text-xs text-emerald-200/80 font-semibold">راسلنا</p>
          <p className="text-sm md:text-base text-white font-black">واتساب</p>
        </div>
      </div>
    </a>
  );
}
