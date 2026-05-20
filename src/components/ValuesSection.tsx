import { Rocket, Users, Target, BookOpen, Sparkles, ArrowLeft } from "lucide-react";
import { memo } from "react";
import { Link } from "react-router-dom";
import prefetchForm from "@/lib/prefetchForm";
import { pushGTMEvent } from "@/utils/gtm";
import FadeIn from "@/components/FadeIn";

/* ── Data ──────────────────────────────────────────────── */
const values = [
  {
    icon: Rocket,
    num: "01",
    title: "البداية الصحيحة",
    text: "ودّع الحملات العشوائية. مع انطلاقة، تختصر وقت نموك من خلال أفضل الاستراتيجيات، مصممة خصيصًا وفق احتياجاتك وهدفك.",
    accent: "#9b50e8",
  },
  {
    icon: Users,
    num: "02",
    title: "خبراء نمو فعليون",
    text: "بخبرة متراكمة تجاوزت مئات الملايين من المبيعات، نعمل على كل مراحل النمو: من التأسيس المتين إلى التوسع.",
    accent: "#60a5fa",
  },
  {
    icon: Target,
    num: "03",
    title: "عملاء محدودون، وتركيز عالٍ",
    text: "سياستنا هي خدمة عدد محدود جدًا من العملاء شهريًا، لنمنح كل عميل أعلى مستوى من التركيز ونتائج فعلية.",
    accent: "#34d399",
  },
  {
    icon: Sparkles,
    num: "04",
    title: "فريق عالمي المستوى",
    text: "أكثر من 25 استراتيجي تسويق، ومديري حملات إعلانية، ومخرجين إبداعيين، وكُتّاب بيع مباشر.",
    accent: "#fbbf24",
  },
  {
    icon: BookOpen,
    num: "05",
    title: "نستثمر في العقول قبل الأدوات",
    text: "أكبر استثمار لنا هو الفريق والتعلم من رؤاء التسويق حول العالم. ندرس الأفضل… لتكون الأفضل.",
    accent: "#f472b6",
  },
];

/* ── Card ──────────────────────────────────────────────── */
function ValueCard({ item, index }: { item: typeof values[0]; index: number }) {
  const Icon = item.icon;
  const isFeatured = index === 0;

  return (
    <FadeIn
      direction="up"
      delay={index * 0.1}
      duration={0.6}
      margin="-60px"
      className={`hover-lift relative group rounded-3xl overflow-hidden cursor-default ${
        isFeatured ? "md:col-span-2 md:row-span-1" : ""
      }`}
      style={{
        background: "rgba(21,11,46,0.55)",
        border: "1px solid rgba(155,80,232,0.1)",
      }}
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-600 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at 20% 20%, ${item.accent}12, transparent 70%)` }}
      />

      <div
        className="absolute top-4 left-6 font-black select-none pointer-events-none leading-none"
        style={{
          fontSize: isFeatured ? "120px" : "96px",
          background: `linear-gradient(180deg, ${item.accent}40, ${item.accent}10)`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        {item.num}
      </div>

      <div className={`relative z-10 p-8 ${isFeatured ? "md:p-10" : ""} flex flex-col h-full`}>
        <div className="flex items-center gap-4 mb-6">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6"
            style={{
              background: `${item.accent}12`,
              border: `1px solid ${item.accent}25`,
              boxShadow: `0 0 24px ${item.accent}10`,
            }}
          >
            <Icon className="w-5 h-5" style={{ color: item.accent }} strokeWidth={2} />
          </div>
          <div
            className="h-[1px] flex-1"
            style={{ background: `linear-gradient(to left, transparent, ${item.accent}20)` }}
          />
        </div>

        <h3 className={`font-black text-white mb-3 leading-[1.4] ${isFeatured ? "text-2xl md:text-3xl" : "text-xl md:text-2xl"}`}>
          {item.title}
        </h3>

        <p className={`text-white/55 leading-[2] ${isFeatured ? "text-base md:text-lg max-w-xl" : "text-sm md:text-base"}`}>
          {item.text}
        </p>

        <div className="mt-auto pt-6">
          <div
            className="h-[2px] w-0 group-hover:w-16 transition-all duration-500 rounded-full"
            style={{ background: `linear-gradient(to left, ${item.accent}, transparent)` }}
          />
        </div>
      </div>
    </FadeIn>
  );
}

/* ── Section ───────────────────────────────────────────── */
const ValuesSection = () => (
  <section className="relative section-py px-4 overflow-hidden section-bg-elevated">
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        className="blob-pulse-1 absolute top-1/3 -right-32 w-[500px] h-[500px] rounded-full blur-[140px]"
        style={{ background: "rgba(155,80,232,0.07)" }}
      />
      <div
        className="blob-pulse-2 absolute bottom-1/4 -left-32 w-[400px] h-[400px] rounded-full blur-[120px]"
        style={{ background: "rgba(155,80,232,0.05)" }}
      />
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(155,80,232,0.4) 1px, transparent 1px),
            linear-gradient(90deg, rgba(155,80,232,0.4) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />
    </div>

    <div className="container mx-auto relative z-10">
      <FadeIn direction="up" duration={0.6} className="text-center mb-16">
        <FadeIn
          direction="scale"
          duration={0.5}
          className="inline-flex items-center gap-2 rounded-full px-6 py-2 mb-8"
          style={{ background: "rgba(155,80,232,0.1)", border: "1px solid rgba(155,80,232,0.2)" }}
        >
          <div className="spin-slow">
            <Sparkles className="w-4 h-4" style={{ color: "#9b50e8" }} />
          </div>
          <span className="text-sm font-bold text-white/90">لماذا انطلاقة؟</span>
        </FadeIn>

        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 text-white leading-[1.4]">
          لأن النمو{" "}
          <span className="text-gradient">لا يحدث صدفة</span>
        </h2>
        <p className="text-lg text-white/50 max-w-2xl mx-auto leading-relaxed">
          رحلة نموك تبدأ من هنا، مع فريق متكامل ومتخصص يرافقك في كل خطوة نحو النجاح
        </p>
      </FadeIn>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
        {values.map((item, i) => (
          <ValueCard key={item.num} item={item} index={i} />
        ))}
      </div>

      <FadeIn direction="up" duration={0.6} delay={0.3} className="mt-16 text-center">
        <Link to="/form" onMouseEnter={prefetchForm} onFocus={prefetchForm} onTouchStart={prefetchForm}>
          <button
            onClick={() => pushGTMEvent("cta_click", { button_name: "ابدأ رحلتك", location: "values_section" })}
            className="cta-hover relative group inline-flex items-center gap-3 px-10 py-4 rounded-full font-black text-white text-base shadow-xl overflow-hidden"
            style={{ background: "linear-gradient(135deg, #7c3aed, #9b50e8)" }}
          >
            <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-r from-transparent via-white/15 to-transparent -skew-x-12" />
            <span
              className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-50 transition-opacity duration-500 blur-xl"
              style={{ background: "linear-gradient(135deg, #9b50e8, #c084fc)" }}
            />
            <span className="relative flex items-center gap-3">
              ابدأ رحلتك معنا اليوم
              <ArrowLeft className="w-5 h-5" />
            </span>
          </button>
        </Link>
      </FadeIn>
    </div>
  </section>
);

export default memo(ValuesSection);
