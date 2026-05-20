import { Link } from "react-router-dom";
import prefetchForm from "@/lib/prefetchForm";
import { memo } from "react";
import Image from "next/image";
import { ArrowLeft, TrendingUp, Users, Zap, Star } from "lucide-react";
import { pushGTMEvent } from "@/utils/gtm";

function StatNumber({ target, suffix = "", prefix = "" }: { target: number; suffix?: string; prefix?: string }) {
  return <span>{prefix}{target.toLocaleString("ar-SA")}{suffix}</span>;
}

const ORBS = [
  { x: 22, y: 64, delay: "0.8s", size: 10, color: "rgba(192,132,252,0.45)" },
  { x: 74, y: 30, delay: "1.8s", size: 11, color: "rgba(155,80,232,0.45)" },
  { x: 66, y: 86, delay: "2.8s", size: 10, color: "rgba(192,132,252,0.32)" },
];

/* ── Stats Data ────────────────────────────────────────── */
const stats = [
  { icon: TrendingUp, label: "مبيعات مُدارة", target: 100, suffix: "M+", color: "#34d399" },
  { icon: Star,       label: "عميل ناجح",     target: 220, suffix: "+",  color: "#fbbf24" },
  { icon: Zap,        label: "حملة ناجحة",    target: 500, suffix: "+",  color: "#60a5fa" },
];

/* ── HeroSection ───────────────────────────────────────── */
const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-32 md:pt-40 pb-16 px-4 overflow-hidden">
      <div className="absolute inset-0 z-0" style={{ transform: "translateZ(0)" }}>
        <div className="absolute inset-0" style={{ background: "linear-gradient(170deg, #0d0520 0%, #1a0a34 40%, #130828 70%, #0d0520 100%)" }} />

        {/* Radial glow: primary */}
        <div
          className="absolute top-[-8%] right-[-8%] w-[650px] h-[650px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(155,80,232,0.22) 0%, transparent 70%)" }}
          aria-hidden="true"
        />
        {/* Radial glow: secondary */}
        <div
          className="absolute bottom-[-8%] left-[-8%] w-[500px] h-[500px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(155,80,232,0.12) 0%, transparent 70%)" }}
          aria-hidden="true"
        />
        {/* Floating orbs */}
        {ORBS.map((orb, index) => (
          <span
            key={`${orb.x}-${orb.y}-${index}`}
            className="absolute rounded-full pointer-events-none hero-orb"
            style={{
              left: `${orb.x}%`,
              top: `${orb.y}%`,
              width: orb.size,
              height: orb.size,
              background: orb.color,
              animationDelay: orb.delay,
            }}
            aria-hidden="true"
          />
        ))}
      </div>

      {/* ─ Content ─ */}
      <div className="container mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* ── Right: Text ── */}
          <div className="text-center lg:text-right space-y-8 order-1">
            {/* Trust badge */}
            <div
              className="inline-flex items-center justify-center gap-3 rounded-full px-5 py-2.5 mx-auto lg:mx-0 hero-visible"
              style={{
                background: "rgba(155,80,232,0.12)",
                border: "1px solid rgba(155,80,232,0.25)",
              }}
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
              </span>
              <span className="text-xs md:text-sm font-bold text-white/90 tracking-wide">وكالة تسويق رقمي رائدة في السعودية</span>
            </div>

            {/* Headline */}
            <div className="hero-visible">
              <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black leading-[1.32] sm:leading-[1.4] md:leading-[1.6] text-white">
                <span className="block mb-2 sm:mb-3 md:mb-5">نساعدك على تسريع</span>
                <span className="block">
                  نموك وجعل {" "}
                  <span className="text-gradient inline-block mt-1 sm:mt-2 md:mt-2 py-1 sm:py-1.5 md:py-3 px-1">
                    حملاتك أكثر ذكاءً
                  </span>
                </span>
              </h1>
            </div>

            {/* Subheading */}
            <p
              className="text-lg md:text-xl text-white/70 leading-[2] font-medium max-w-xl mx-auto lg:mr-auto lg:ml-0 hero-visible"
            >
نعتمد على خطط تسويقية قائمة على النتائج، واستراتيجيات مصممة خصيصًا لعلامتك التجارية، لتحقيق أفضل عائد بأقل مجهود.
            </p>

            {/* CTAs */}
            <div
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center hero-fade-up"
              style={{ animationDelay: "360ms" }}
            >
              <Link to="/form" onMouseEnter={prefetchForm} onFocus={prefetchForm} onTouchStart={prefetchForm} className="w-full sm:w-auto">
                <button
                  onClick={() => pushGTMEvent("cta_click", { button_name: "احجز استشارتك المجانية", location: "hero_section" })}
                  className="relative group w-full sm:w-auto px-10 py-4 rounded-full text-base md:text-lg font-black text-white shadow-2xl overflow-hidden transition-transform duration-200 hover:-translate-y-1 hover:scale-[1.02] active:scale-[0.98]"
                  style={{ background: "linear-gradient(135deg, #7c3aed, #9b50e8, #c084fc)" }}
                >
                  {/* Shimmer */}
                  <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12" />
                  {/* Glow */}
                  <span className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-60 transition-opacity duration-500 blur-xl" style={{ background: "linear-gradient(135deg, #9b50e8, #c084fc)" }} />
                  <span className="relative flex items-center justify-center gap-3 w-full">
                    احجز استشارتك المجانية
                    <ArrowLeft className="w-5 h-5" />
                  </span>
                </button>
              </Link>


            </div>

            {/* Stats */}
            <div
              className="grid grid-cols-3 gap-3 md:gap-6 pt-8 hero-fade-up"
              style={{ animationDelay: "460ms", borderTop: "1px solid rgba(155,80,232,0.15)" }}
            >
              {stats.map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <div key={i} className="text-center lg:text-right">
                    <div className="flex items-center gap-1.5 md:gap-2 justify-center lg:justify-start mb-1">
                      <Icon className="w-4 h-4 hidden sm:block" style={{ color: stat.color }} />
                      <span className="text-xl sm:text-2xl md:text-3xl font-black" style={{ color: stat.color }}>
                        <StatNumber target={stat.target} suffix={stat.suffix} />
                      </span>
                    </div>
                    <div className="text-[10px] sm:text-xs md:text-sm text-white/55 font-medium">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Left: Hero Visual with 3D perspective ── */}
          <div
            className="order-2 relative flex items-center justify-center mt-12 lg:mt-0"
            style={{ perspective: "1200px" }}
          >
            {/* Deep Glow backing the image */}
            <div
              className="absolute w-[300px] h-[300px] md:w-[500px] md:h-[500px] rounded-full blur-[80px] md:blur-[100px] opacity-40 hero-glow-breath"
              style={{ background: "radial-gradient(circle, #9b50e8, transparent 70%)" }}
            />

            {/* Hero graphics container */}
            <div className="relative z-10 w-[85%] sm:w-full max-w-xs md:max-w-xl lg:max-w-2xl xl:max-w-3xl mx-auto flex items-center justify-center transform lg:scale-110 lg:-translate-x-6 hero-image-reveal">
              <Image
                src="/hero-section.webp"
                alt="وكالة انطلاقة للخدمات التسويقية"
                priority
                fetchPriority="high"
                width={2000}
                height={1333}
                sizes="(max-width: 768px) 88vw, (max-width: 1200px) 56vw, 46vw"
                quality={68}
                className="w-full h-auto object-contain"
              />
            </div>

            {/* Floating stat badges */}
            <div
              className="absolute bottom-4 right-0 md:bottom-8 md:-right-8 rounded-xl md:rounded-2xl px-3 py-2 md:px-5 md:py-3 z-20 hero-fade-up"
              style={{
                animationDelay: "560ms",
                background: "rgba(13,5,32,0.9)",
                border: "1px solid rgba(155,80,232,0.3)",
              }}
            >
              <div className="text-[10px] md:text-xs text-white/50 font-medium">رضا العملاء</div>
              <div className="text-base md:text-lg font-black text-emerald-400">98.7%</div>
            </div>

            <div
              className="absolute top-4 left-0 md:top-8 md:-left-8 rounded-xl md:rounded-2xl px-3 py-2 md:px-5 md:py-3 z-20 hero-fade-up"
              style={{ background: "rgba(13,5,32,0.95)", border: "1px solid rgba(155,80,232,0.3)" }}
            >
              <div className="text-[10px] md:text-xs text-white/50 font-medium">نمو المبيعات</div>
              <div className="text-base md:text-lg font-black text-amber-400">+340%</div>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
};

export default memo(HeroSection);
