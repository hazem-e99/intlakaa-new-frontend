import { memo, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { FaArrowLeft, FaCheckCircle, FaWhatsapp, FaChartLine, FaUsers, FaBolt, FaShieldAlt } from "react-icons/fa";
import { pushGTMEvent } from "@/utils/gtm";
import prefetchForm from "@/lib/prefetchForm";

function StatNumber({ target, suffix = "" }: { target: number; suffix?: string }) {
  return <span>{target.toLocaleString("ar-SA")}{suffix}</span>;
}

// ── Data ──────────────────────────────────────────────────────────────────────
const benefits = [
  "استشارة تسويقية مجانية بدون أي التزام",
  "تحليل شامل لوضعك الحالي ومنافسيك",
  "خطة نمو مخصصة لعلامتك التجارية",
  "رد من فريقنا خلال 24 ساعة أو أقل",
  "فريق من أكثر من 25 خبير تسويق",
];

const stats = [
  { icon: FaChartLine, value: 340, suffix: "%", label: "متوسط نمو المبيعات", color: "#34d399" },
  { icon: FaUsers, value: 220, suffix: "+", label: "عميل ناجح", color: "#fbbf24" },
  { icon: FaBolt, value: 500, suffix: "+", label: "حملة ناجحة", color: "#60a5fa" },
];

const urgencyMessage = "⚡ تنبيه: نقبل عددًا محدودًا جدًا من العملاء شهريًا. الأماكن المتاحة تنفد بسرعة.";

// ── Sticky CTA Bar ────────────────────────────────────────────────────────────
function StickyCTA() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const handler = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 backdrop-blur-xl"
          style={{ background: "rgba(15,5,36,0.95)", borderTop: "1px solid rgba(168,85,247,0.3)" }}
        >
          <div className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-3 items-center justify-between">
            <p className="text-white/80 text-sm font-medium text-center sm:text-right">
              🎯 استشارة مجانية — احجز مكانك الآن قبل نفاد الأماكن
            </p>
            <Link to="/form" onMouseEnter={prefetchForm} className="flex-shrink-0">
              <button
                onClick={() => pushGTMEvent("cta_click", { button_name: "sticky_cta_ads", location: "ads_page_sticky" })}
                className="px-6 py-3 rounded-full font-black text-white text-sm whitespace-nowrap shadow-lg hover:-translate-y-0.5 transition-all"
                style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}
              >
                احجز الآن مجانًا ←
              </button>
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
const AdsLanding = () => {
  return (
    <>
      <StickyCTA />
      <div
        className="min-h-screen"
        style={{ background: "linear-gradient(180deg, #0f0524 0%, #1a083d 40%, #0f0524 100%)" }}
        dir="rtl"
      >
        {/* ── Minimal Nav ── */}
        <header className="fixed top-0 left-0 right-0 z-40 py-4 px-6 flex items-center justify-between"
          style={{ background: "rgba(15,5,36,0.9)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(168,85,247,0.15)" }}
        >
          <Image src="/logo.webp" alt="انطلاقة" width={795} height={254} sizes="160px" className="h-10 w-auto" />
          <a href="https://wa.me/966511414537" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold text-white transition-all hover:-translate-y-0.5"
            style={{ background: "linear-gradient(135deg, #25d366, #128c7e)" }}
          >
            <FaWhatsapp className="w-4 h-4" />
            واتساب مباشر
          </a>
        </header>

        {/* ── Urgency Bar ── */}
        <div className="pt-20 text-center py-3 px-4 text-amber-300 text-sm font-bold"
          style={{ background: "rgba(251,191,36,0.08)", borderBottom: "1px solid rgba(251,191,36,0.2)" }}
        >
          {urgencyMessage}
        </div>

        {/* ── HERO ── */}
        <section className="relative py-20 px-6 overflow-hidden">
          {/* Background glows */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-0 right-1/4 w-[500px] h-[500px] rounded-full blur-[100px] opacity-20"
              style={{ background: "radial-gradient(circle, #a855f7, transparent 70%)" }} />
          </div>

          <div className="max-w-3xl mx-auto text-center relative z-10">
            {/* Trust badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-5 py-2 mb-8"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              <span className="text-sm font-bold text-white/90">وكالة انطلاقة — شريك نموك الرقمي</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="text-4xl sm:text-5xl md:text-6xl font-black leading-[1.35] text-white mb-6"
            >
              ضاعف مبيعاتك{" "}
              <span className="text-gradient">
                في 90 يومًا
              </span>
              <br />أو لا تدفع شيئًا
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-lg md:text-xl text-white/65 mb-10 leading-[2] max-w-2xl mx-auto"
            >
              حملات إعلانية قائمة على البيانات، محتوى يُحوّل المتابعين لعملاء، وفريق خبراء يرافقك خطوة بخطوة — مع ضمان النتائج.
            </motion.p>

            {/* Primary CTA */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7, duration: 0.5, type: "spring" }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            >
              <Link to="/form" onMouseEnter={prefetchForm}>
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => pushGTMEvent("cta_click", { button_name: "احجز استشارة مجانية", location: "ads_hero" })}
                  className="relative group px-10 py-5 rounded-full text-lg font-black text-white shadow-2xl overflow-hidden w-full sm:w-auto"
                  style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7, #c084fc)" }}
                >
                  <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12" />
                  <span className="relative flex items-center justify-center gap-3">
                    احجز استشارتك المجانية الآن
                    <FaArrowLeft className="w-4 h-4" />
                  </span>
                </motion.button>
              </Link>
              <a href="https://wa.me/966511414537" target="_blank" rel="noopener noreferrer">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-8 py-5 rounded-full text-base font-bold text-white border border-white/30 hover:bg-white/10 transition-all flex items-center justify-center gap-2 w-full sm:w-auto"
                >
                  <FaWhatsapp className="w-5 h-5 text-green-400" />
                  تواصل عبر واتساب
                </motion.button>
              </a>
            </motion.div>

            {/* Benefits list */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.6 }}
              className="flex flex-col items-center gap-3"
            >
              {benefits.map((b, i) => (
                <div key={i} className="flex items-center gap-3 text-white/70 text-sm">
                  <FaCheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  {b}
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── STATS ── */}
        <section className="py-16 px-6" style={{ borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <div className="max-w-3xl mx-auto grid grid-cols-3 gap-6">
            {stats.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-black mb-1" style={{ color: s.color }}>
                  <StatNumber target={s.value} suffix={s.suffix} />
                </div>
                <div className="text-xs md:text-sm text-white/50">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── GUARANTEE ── */}
        <section className="py-16 px-6">
          <div className="max-w-2xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="rounded-3xl p-10 text-center"
              style={{
                background: "linear-gradient(135deg, rgba(124,58,237,0.15), rgba(168,85,247,0.1))",
                border: "1px solid rgba(168,85,247,0.3)",
              }}
            >
              <FaShieldAlt className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <h2 className="text-2xl md:text-3xl font-black text-white mb-4">ضمان النتائج كاملًا</h2>
              <p className="text-white/60 leading-[2] text-base">
                نحن واثقون من نتائجنا لدرجة أننا نعمل بمبدأ: إذا ما حققنا الأهداف المتفق عليها خلال 90 يومًا — ستحصل على استرداد كامل أو تمديد الخدمة. ثقتك في انطلاقة هي أغلى شيء عندنا.
              </p>
            </motion.div>
          </div>
        </section>

        {/* ── FINAL CTA ── */}
        <section className="py-20 px-6 pb-32 sm:pb-20">
          <div className="max-w-xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-black text-white mb-4 leading-[1.4]">
                وقتك ثمين — ابدأ الآن
              </h2>
              <p className="text-white/55 mb-8 text-base">
                الاستشارة مجانية، سريعة، وبدون أي التزام. خلنا نشوف كيف نقدر نساعدك.
              </p>
              <Link to="/form" onMouseEnter={prefetchForm}>
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => pushGTMEvent("cta_click", { button_name: "final_cta_ads", location: "ads_page_bottom" })}
                  className="px-12 py-5 rounded-full text-lg font-black text-white shadow-2xl w-full sm:w-auto"
                  style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}
                >
                  احجز مكانك المجاني الآن ←
                </motion.button>
              </Link>
              <p className="text-white/30 text-xs mt-4">لا بطاقة ائتمان مطلوبة · الاستشارة مجانية 100%</p>
            </motion.div>
          </div>
        </section>

        {/* ── Minimal Footer ── */}
        <footer className="py-6 px-6 text-center text-white/30 text-sm border-t border-white/5">
          © {new Date().getFullYear()} انطلاقة. جميع الحقوق محفوظة. |{" "}
          <a href="https://intlakaa.com" className="hover:text-white/60 transition-colors">intlakaa.com</a>
        </footer>
      </div>
    </>
  );
};

export default memo(AdsLanding);
