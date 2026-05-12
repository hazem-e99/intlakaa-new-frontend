import { Link } from "react-router-dom";
import prefetchForm from "@/lib/prefetchForm";
import { memo } from "react";
import { pushGTMEvent } from "@/utils/gtm";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import FadeIn from "@/components/FadeIn";

const perks = [
  "خطة تسويق مخصصة مجانًا",
  "تحليل منافسيك في 24 ساعة",
  "لا التزام، لا عقود مُجبرة",
];

const PromoSection = () => (
  <section className="section-py px-4 relative overflow-hidden section-bg-base">
    <div className="container mx-auto">
      <FadeIn
        direction="scale"
        duration={0.6}
        className="relative rounded-3xl overflow-hidden shadow-2xl"
        style={{ background: "linear-gradient(135deg, #1a0a34 0%, #2a1055 50%, #1a0a34 100%)", border: "1px solid rgba(155,80,232,0.2)" }}
      >
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="blob-pulse-1 absolute -top-20 -right-20 w-80 h-80 rounded-full blur-3xl"
            style={{ background: "radial-gradient(circle, rgba(155,80,232,0.25), transparent 70%)" }}
          />
          <div
            className="blob-pulse-2 absolute -bottom-20 -left-20 w-80 h-80 rounded-full blur-3xl"
            style={{ background: "radial-gradient(circle, rgba(155,80,232,0.15), transparent 70%)" }}
          />
        </div>

        <div className="relative z-10 p-10 md:p-16 text-center">
          <FadeIn
            direction="up"
            delay={0.1}
            className="inline-flex items-center gap-2 rounded-full px-5 py-2 mb-8"
            style={{ background: "rgba(155,80,232,0.12)", border: "1px solid rgba(155,80,232,0.2)" }}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            <span className="text-sm font-bold text-white/90">الاستشارة مجانية 100% — بدون أي رسوم</span>
          </FadeIn>

          <h2 className="text-3xl md:text-5xl font-black text-white mb-4 leading-[1.4]">
            جاهز تضاعف مبيعاتك؟{" "}
            <span className="text-gradient">ابدأ الآن</span>
          </h2>

          <p className="text-lg text-white/60 mb-8 max-w-2xl mx-auto leading-relaxed">
            خطوة واحدة تفصلك عن النمو الحقيقي. احجز استشارتك المجانية وخل فريقنا يدرس وضعك ويبني لك خطة مخصصة.
          </p>

          <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 mb-10">
            {perks.map((perk, i) => (
              <FadeIn
                key={i}
                direction="up"
                delay={0.15 + i * 0.08}
                className="flex items-center gap-2 text-white/75 text-sm font-medium"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" strokeWidth={2.5} />
                {perk}
              </FadeIn>
            ))}
          </div>

          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/form" onMouseEnter={prefetchForm} onFocus={prefetchForm} onTouchStart={prefetchForm}>
              <button
                onClick={() => pushGTMEvent("cta_click", { button_name: "احجز استشارتك المجانية", location: "promo_section" })}
                className="cta-hover relative group bg-white text-[#1a0a34] px-10 py-4 rounded-full text-base md:text-lg font-black shadow-xl transition-all flex items-center gap-3"
              >
                <span className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-purple-100 to-purple-50" />
                <span className="relative flex items-center gap-3">
                  احجز استشارتك المجانية
                  <ArrowLeft className="w-5 h-5" />
                </span>
              </button>
            </Link>

          </div>
        </div>
      </FadeIn>
    </div>
  </section>
);

export default memo(PromoSection);
