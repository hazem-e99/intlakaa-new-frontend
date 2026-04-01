import { memo } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Crosshair, ShoppingCart, BarChart3, Sparkles } from "lucide-react";

const problems = [
  {
    icon: AlertTriangle,
    title: "صرف إعلاني بدون عائد",
    description: "ميزانيات كبيرة تُنفق بدون بيانات واضحة. النتيجة: هدر مال بدون مبيعات.",
    color: "#f97316",
    glow: "rgba(249,115,22,0.28)",
  },
  {
    icon: Crosshair,
    title: "استهداف غير دقيق",
    description: "إعلاناتك تصل لأشخاص غير مهتمين. التكلفة ترتفع والطلبات تنخفض.",
    color: "#60a5fa",
    glow: "rgba(96,165,250,0.28)",
  },
  {
    icon: ShoppingCart,
    title: "صفحات لا تحفّز الشراء",
    description: "الزائر يصل لكنه لا يشتري. ضعف العرض يقتل فرص التحويل.",
    color: "#f43f5e",
    glow: "rgba(244,63,94,0.28)",
  },
  {
    icon: BarChart3,
    title: "لا تحليل ولا تحسين",
    description: "حملات تعمل بدون مراجعة. نفس الأخطاء تتكرر والنمو يتوقف.",
    color: "#34d399",
    glow: "rgba(52,211,153,0.24)",
  },
];

function ProblemCard({
  title,
  description,
  color,
  glow,
  icon: Icon,
  index,
}: {
  title: string;
  description: string;
  color: string;
  glow: string;
  icon: typeof AlertTriangle;
  index: number;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay: index * 0.08 }}
      whileHover={{ y: -4 }}
      className="group relative overflow-hidden rounded-3xl p-5 sm:p-6"
      style={{
        background: "linear-gradient(180deg, rgba(24,13,49,0.9) 0%, rgba(13,5,32,0.96) 100%)",
        border: `1px solid ${color}45`,
        boxShadow: "0 18px 36px rgba(0,0,0,0.32)",
      }}
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `radial-gradient(circle at top right, ${glow}, transparent 60%)` }}
      />
      <div className="absolute top-0 right-0 left-0 h-[2px]" style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} />

      <div className="relative z-10">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: `${color}24`, border: `1px solid ${color}66` }}
          >
            <Icon className="w-5 h-5" style={{ color }} strokeWidth={2.2} />
          </div>

          <div
            className="text-[11px] font-black px-2.5 py-1 rounded-full"
            style={{ background: `${color}22`, border: `1px solid ${color}66`, color }}
          >
            مشكلة {String(index + 1).padStart(2, "0")}
          </div>
        </div>

        <h3 className="text-xl sm:text-2xl font-black text-white leading-[1.6] mb-3">{title}</h3>
        <p className="text-sm sm:text-base text-white/75 leading-[1.95]">{description}</p>
      </div>
    </motion.article>
  );
}

const StoreProblemsSection = () => {
  return (
    <section id="store-problems" className="relative section-py px-4 overflow-hidden section-bg-elevated">
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.22) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.22) 1px, transparent 1px)",
            backgroundSize: "70px 70px",
          }}
        />
        <motion.div
          className="absolute top-[-14%] right-[-8%] w-[380px] h-[380px] sm:w-[520px] sm:h-[520px] rounded-full blur-[110px] opacity-30"
          style={{ background: "radial-gradient(circle, rgba(249,115,22,0.32), transparent 70%)" }}
          animate={{ scale: [1, 1.08, 1], y: [0, -12, 0] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-[-16%] left-[-6%] w-[340px] h-[340px] sm:w-[460px] sm:h-[460px] rounded-full blur-[100px] opacity-25"
          style={{ background: "radial-gradient(circle, rgba(96,165,250,0.35), transparent 70%)" }}
          animate={{ scale: [1.05, 1, 1.05], x: [0, 14, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 md:mb-14"
        >
          <div
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full mb-5"
            style={{ background: "rgba(249,115,22,0.12)", border: "1px solid rgba(249,115,22,0.3)" }}
          >
            <Sparkles className="w-4 h-4 text-orange-300" strokeWidth={2.3} />
            <span className="text-sm font-bold text-white/90">تشخيص سريع للوضع الحالي</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.45] mb-4">
            هل متجرك يعاني
            <span className="block text-gradient">من هذه المشاكل؟</span>
          </h2>

          <p className="text-base sm:text-lg text-white/65 leading-relaxed max-w-3xl mx-auto">
            لو أي نقطة من القائمة هذه موجودة عندك، فالمشكلة غالبًا في الاستراتيجية والتنفيذ وليس في المنتج نفسه.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {problems.map((problem, index) => (
            <ProblemCard
              key={problem.title}
              icon={problem.icon}
              title={problem.title}
              description={problem.description}
              color={problem.color}
              glow={problem.glow}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default memo(StoreProblemsSection);