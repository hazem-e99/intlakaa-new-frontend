import { memo, useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { TrendingUp, Users, Target, Rocket, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import prefetchForm from "@/lib/prefetchForm";

/* ── Animated Counter ──────────────────────────────────── */
function AnimatedStat({ target, suffix = "", prefix = "", duration = 2200 }: { target: number; suffix?: string; prefix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target, duration]);

  return <span ref={ref}>{prefix}{count.toLocaleString("ar-SA")}{suffix}</span>;
}

/* ── Data ──────────────────────────────────────────────── */
const results = [
  { icon: TrendingUp,  value: 100, suffix: "M+", prefix: "+", label: "ريال مبيعات مُدارة", description: "حجم المبيعات الإجمالية التي أدرناها لعملائنا منذ انطلاقتنا بنجاح تام", color: "#34d399", delay: 0 },
  { icon: Users,       value: 220, suffix: "+", prefix: "", label: "شريك نجاح",          description: "عملاء حققوا نتائج قياسية وتوسعوا في السوق السعودي والخليجي", color: "#fbbf24", delay: 0.1 },
  { icon: Target,      value: 500, suffix: "+", prefix: "", label: "حملة إعلانية ناجحة", description: "حملات فائقة الدقة على Meta و TikTok و Google أنتجت عائدًا مضاعفًا", color: "#60a5fa", delay: 0.2 },
  { icon: Rocket,      value: 340, suffix: "%", prefix: "+", label: "متوسط نمو المبيعات", description: "المعدل الوسيط لنمو مبيعات عملائنا خلال أول 90 يومًا فقط من العمل", color: "#f472b6", delay: 0.3 },
];

/* ── Result Card ───────────────────────────────────────── */
function ResultCard({ icon: Icon, value, suffix, prefix, label, description, color, delay }: typeof results[0] & { prefix?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 40 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay, type: "spring", stiffness: 70 }}
      whileHover={{ y: -12, scale: 1.02 }}
      className="relative rounded-[2.5rem] p-8 overflow-hidden group cursor-pointer"
      style={{
        background: "linear-gradient(145deg, rgba(21,11,46,0.9) 0%, rgba(13,5,32,0.95) 100%)",
        border: "1px solid rgba(155,80,232,0.15)",
        boxShadow: "0 20px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)",
      }}
    >
      {/* Animated Gradient Border Glow */}
      <motion.div
        className="absolute -inset-[150%] opacity-0 group-hover:opacity-40 transition-opacity duration-700 pointer-events-none"
        style={{
          background: `conic-gradient(from 0deg at 50% 50%, transparent 0deg, ${color} 180deg, transparent 360deg)`,
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
      />
      
      {/* Inner glass mask to hide the center of the conic gradient */}
      <div className="absolute inset-[1px] rounded-[calc(2.5rem-1px)] z-0" style={{ background: "rgba(13,5,32,0.96)" }} />

      {/* Decorative SVG Graph Line */}
      <div className="absolute bottom-0 left-0 w-full h-[60%] opacity-10 group-hover:opacity-25 transition-all duration-700 z-0 translate-y-4 group-hover:translate-y-0">
        <svg viewBox="0 0 100 50" preserveAspectRatio="none" className="w-full h-full">
           <path d="M0,50 L0,35 C20,45 35,10 50,25 C70,40 85,5 100,15 L100,50 Z" fill={`url(#grad-${color.replace('#', '')})`} />
           <defs>
             <linearGradient id={`grad-${color.replace('#', '')}`} x1="0" x2="0" y1="0" y2="1">
               <stop offset="0%" stopColor={color} />
               <stop offset="100%" stopColor={color} stopOpacity="0" />
             </linearGradient>
           </defs>
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Top row: Icon and decorative arrow */}
        <div className="flex justify-between items-start mb-8">
          <div
            className="w-16 h-16 rounded-[1.25rem] flex items-center justify-center relative shadow-lg"
            style={{ background: `${color}15`, border: `1px solid ${color}30` }}
          >
            <div className="absolute inset-0 blur-xl opacity-40 group-hover:opacity-70 transition-opacity duration-500" style={{ background: color }} />
            <Icon className="w-8 h-8 relative z-10" style={{ color }} strokeWidth={2} />
          </div>
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-x-4 group-hover:translate-x-0" 
            style={{ background: `${color}20`, color: color }}
          >
             <ArrowLeft className="w-5 h-5 rotate-[135deg]" />
          </div>
        </div>

        {/* Value with gradient text */}
        <div 
          className="text-5xl md:text-6xl lg:text-7xl font-black mb-3 transition-all duration-500"
          style={{
            background: `linear-gradient(135deg, #ffffff 20%, ${color} 100%)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            filter: `drop-shadow(0 4px 15px ${color}30)`,
          }}
        >
          <AnimatedStat target={value} suffix={suffix} prefix={prefix} />
        </div>
        
        {/* Label */}
        <div className="text-xl font-bold mb-3 text-white/95">{label}</div>
        
        {/* Description */}
        <p className="text-sm font-medium leading-[1.8] mt-auto text-white/50 group-hover:text-white/70 transition-colors duration-300">
          {description}
        </p>
      </div>
    </motion.div>
  );
}

/* ── Section ───────────────────────────────────────────── */
const ResultsSection = () => (
  <section className="relative py-20 md:py-28 px-4 overflow-hidden" style={{ background: "#080312" }} id="results">
    {/* Grid Background */}
    <div
      className="absolute inset-0 opacity-[0.03] pointer-events-none"
      style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)`,
        backgroundSize: "80px 80px",
      }}
    />

    {/* Creative glowing orbs */}
    <motion.div
      className="absolute top-0 right-[-10%] w-[600px] h-[600px] rounded-full blur-[140px] opacity-20 pointer-events-none"
      style={{ background: "radial-gradient(circle, #f472b6, transparent 70%)" }}
      animate={{ scale: [1, 1.25, 1], x: [0, -80, 0], y: [0, 40, 0] }}
      transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.div
      className="absolute bottom-[-10%] left-[-10%] w-[800px] h-[800px] rounded-full blur-[160px] opacity-15 pointer-events-none"
      style={{ background: "radial-gradient(circle, #9b50e8, transparent 70%)" }}
      animate={{ scale: [1.2, 1, 1.2], x: [0, 80, 0], y: [0, -40, 0] }}
      transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
    />

    <div className="container mx-auto relative z-10">
      {/* Header layout: Split Left/Right on Desktop for a magazine/modern feel */}
      <div className="flex flex-col lg:flex-row items-start justify-between gap-10 lg:gap-20 mb-20 md:mb-28">
        {/* Right Side: Titles */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, type: "spring", stiffness: 60 }}
          className="flex-1"
        >
          <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full mb-8" style={{ background: "rgba(155,80,232,0.12)", border: "1px solid rgba(155,80,232,0.3)", boxShadow: "0 0 20px rgba(155,80,232,0.2)" }}>
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400" />
            </span>
            <span className="text-sm font-bold text-white tracking-wide">نتائج قابلة للقياس والإثبات</span>
          </div>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-[1.7] md:leading-[1.6]">
            <span className="block mb-4 lg:inline lg:mb-0">أرقام تتحدث عن{" "}</span>
            <span className="text-gradient inline-block py-3 px-1">نفسها</span>
          </h2>
        </motion.div>

        {/* Left Side: Statement */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.2, type: "spring", stiffness: 60 }}
          className="flex-1 lg:pt-16"
        >
          <div className="relative">
            <div className="absolute -right-6 top-0 bottom-0 w-1.5 rounded-full" style={{ background: "linear-gradient(to bottom, #7c3aed, transparent)" }} />
            <p className="text-2xl md:text-3xl lg:text-[2rem] text-white/80 leading-[1.7] font-bold">
              لسنا وكالة تعد بالوعود — نحن وكالة تُثبت بالأرقام.
            </p>
            <p className="text-lg md:text-xl text-white/50 leading-[1.8] font-medium mt-6">
              هذه هي نتائجنا الفعلية التي تدفع نمو أعمال ومبيعات شركائنا إلى مستويات غير مسبوقة. أرقام حقيقية تصنع الفارق.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        {results.map((r, i) => <ResultCard key={i} {...r} />)}
      </div>

      {/* Bottom CTA */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.5, type: "spring" }}
        className="mt-24 text-center"
      >
        <p className="text-white/50 text-base md:text-lg font-medium mb-6">هل أنت مستعد لمضاعفة أرقامك وبدء قصة نجاحك معنا؟</p>
        <Link to="/form" onMouseEnter={prefetchForm}>
          <motion.button
            whileHover={{ scale: 1.05, y: -3 }}
            whileTap={{ scale: 0.97 }}
            className="group relative inline-flex items-center justify-center gap-3 px-10 py-5 rounded-full text-lg font-black text-white shadow-[0_10px_40px_rgba(124,58,237,0.4)] overflow-hidden"
            style={{ background: "linear-gradient(135deg, #7c3aed, #9b50e8)" }}
          >
            {/* CTA Shimmer Effect */}
            <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-r from-transparent via-white/25 to-transparent -skew-x-12 translate-x-[-150%] group-hover:translate-x-[150%] ease-in-out" />
            <span className="relative flex items-center gap-3">
              احجز استشارتك المجانية
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            </span>
          </motion.button>
        </Link>
      </motion.div>
    </div>
  </section>
);

export default memo(ResultsSection);
