import { motion } from "framer-motion";
import { memo } from "react";
import { Megaphone, BarChart3, MessageCircle, Search, ArrowLeft, CheckCircle2, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import prefetchForm from "@/lib/prefetchForm";
import { pushGTMEvent } from "@/utils/gtm";

const services = [
  {
    icon: Megaphone,
    number: "01",
    title: "باقة المحتوى والإعلان",
    tagline: "كل ما تحتاجه من A إلى Z",
    color: "#9b50e8",
    items: [
      "تخطيط حملات تسويقية مدروسة",
      "خطة محتوى توصّل رسالتك باحترافية",
      "سكربتات ومونتاج فيديوهات",
      "تصميم صفحات هبوط تزيد التحويلات",
      "تحسين مستمر للأداء (CRO)",
      "مدير حساب مخصص معك دائمًا",
    ],
  },
  {
    icon: BarChart3,
    number: "02",
    title: "باقة الإعلانات",
    tagline: "نُطلق ونتابع ونُحسّن",
    color: "#60a5fa",
    items: [
      "إعداد الحملات بالطريقة الصحيحة",
      "توجيه بنوع المحتوى المطلوب للإعلان",
      "متابعة يومية وتعديل مستمر",
      "تقارير شفافة توريك العائد الفعلي",
    ],
  },
  {
    icon: MessageCircle,
    number: "03",
    title: "الاستشارات",
    tagline: "خبرة تختصر عليك السنين",
    color: "#34d399",
    items: [
      "استشارة تختصر الوقت والمال",
      "خبرات عملية في السوق السعودي",
      "استراتيجيات مجربة لمتاجر كبرى",
    ],
  },
  {
    icon: Search,
    number: "04",
    title: "البحث والتحليل",
    tagline: "بيانات تقود، لا تخمينات",
    color: "#fbbf24",
    items: [
      "بحث تحليلي بأعلى المعايير",
      "دراسة المنافسين بدقة متناهية",
      "صورة كاملة لفرص مضاعفة الأرقام",
    ],
  },
];

const highlights = [
  "خدمات متكاملة تحت سقف واحد",
  "تنفيذ سريع وقياس دقيق للنتائج",
  "خطط مبنية على بيانات السوق السعودي",
  "تحسين مستمر مبني على الأرقام",
];

function ServiceCard({ service, index }: { service: typeof services[0]; index: number }) {
  const Icon = service.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.55, delay: index * 0.08 }}
      whileHover={{ y: -5 }}
      className="relative rounded-3xl p-6 sm:p-7 overflow-hidden group"
      style={{
        background: "linear-gradient(180deg, rgba(24,13,49,0.95) 0%, rgba(13,5,32,0.98) 100%)",
        border: "1px solid rgba(155,80,232,0.2)",
        boxShadow: "0 14px 32px rgba(0,0,0,0.32)",
      }}
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at top right, ${service.color}20, transparent 55%)` }}
      />
      <div className="absolute top-0 right-0 left-0 h-[2px]" style={{ background: `linear-gradient(90deg, transparent, ${service.color}, transparent)` }} />

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-start justify-between gap-3 mb-5">
          <div className="inline-flex items-center gap-3 min-w-0">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: `${service.color}1e`, border: `1px solid ${service.color}55` }}
            >
              <Icon className="w-5 h-5" style={{ color: service.color }} strokeWidth={2.2} />
            </div>
            <div className="min-w-0">
              <h3 className="text-lg sm:text-xl font-black text-white leading-[1.45]">{service.title}</h3>
              <p className="text-xs sm:text-sm font-bold mt-1" style={{ color: service.color }}>{service.tagline}</p>
            </div>
          </div>
          <div
            className="shrink-0 text-[11px] font-black rounded-full px-2.5 py-1"
            style={{ background: `${service.color}24`, border: `1px solid ${service.color}60`, color: service.color }}
          >
            {service.number}
          </div>
        </div>

        <ul className="space-y-3 mt-1">
          {service.items.map((item, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: 12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 + i * 0.04 }}
              className="flex items-start gap-3 text-white/75 group-hover:text-white/90 transition-colors text-sm sm:text-[0.95rem] font-medium leading-relaxed"
            >
              <div
                className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5"
                style={{ background: `linear-gradient(135deg, ${service.color}40, ${service.color}10)`, border: `1px solid ${service.color}50` }}
              >
                <CheckCircle2 className="w-3.5 h-3.5" style={{ color: service.color }} strokeWidth={2.4} />
              </div>
              <span>{item}</span>
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

const ServicesSection = () => (
  <section className="relative section-py px-4 overflow-hidden section-bg-elevated" id="services">
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.24) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.24) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      <motion.div
        className="absolute top-[-18%] right-[-8%] w-[420px] h-[420px] sm:w-[560px] sm:h-[560px] rounded-full blur-[120px] opacity-25"
        style={{ background: "radial-gradient(circle, rgba(155,80,232,0.35), transparent 70%)" }}
        animate={{ scale: [1, 1.1, 1], x: [0, -18, 0], y: [0, 10, 0] }}
        transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[-12%] left-[-7%] w-[320px] h-[320px] sm:w-[460px] sm:h-[460px] rounded-full blur-[100px] opacity-20"
        style={{ background: "radial-gradient(circle, rgba(96,165,250,0.25), transparent 70%)" }}
        animate={{ scale: [1.05, 1, 1.05], x: [0, 14, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>

    <div className="container mx-auto relative z-10 max-w-7xl">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-10 md:mb-14 text-center"
      >
        <div
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full mb-5"
          style={{ background: "rgba(155,80,232,0.14)", border: "1px solid rgba(155,80,232,0.28)" }}
        >
          <Sparkles className="w-4 h-4 text-[#c084fc]" strokeWidth={2.3} />
          <span className="text-sm font-bold text-white/90">الحلول التي نقدمها</span>
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-4 text-white leading-[1.45]">
          وش نقدر نضيف
          <span className="block text-gradient">لمشروعك؟</span>
        </h2>

        <p className="text-base sm:text-lg text-white/60 max-w-3xl mx-auto leading-relaxed">
          نماذج خدمة مصممة لتناسب مرحلتك الحالية وتدفعك للنمو بخطة واضحة، تنفيذ احترافي، وتحسين مستمر مبني على النتائج.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-8 md:mb-10"
      >
        <div className="flex flex-wrap justify-center gap-3">
          {highlights.map((item, i) => (
            <div
              key={i}
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold text-white/85"
              style={{ background: "rgba(21,11,46,0.74)", border: "1px solid rgba(155,80,232,0.2)" }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#9b50e8]" />
              {item}
            </div>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 lg:gap-7 max-w-6xl mx-auto">
        {services.map((s, i) => <ServiceCard key={s.number} service={s} index={i} />)}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55, delay: 0.2 }}
        className="mt-10 md:mt-14"
      >
        <div
          className="relative overflow-hidden rounded-3xl p-6 sm:p-8 md:p-10"
          style={{ background: "rgba(21,11,46,0.78)", border: "1px solid rgba(155,80,232,0.22)" }}
        >
          <div className="absolute inset-0 opacity-20" style={{ background: "linear-gradient(120deg, rgba(124,58,237,0.45), transparent 45%, rgba(96,165,250,0.3))" }} />

          <div className="relative z-10 grid md:grid-cols-[1.35fr_auto] gap-6 items-center">
            <div className="text-center md:text-right">
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-2 leading-[1.45]">
                مو متأكد أي باقة تناسب هدفك الحالي؟
              </h3>
              <p className="text-white/65 text-base sm:text-lg leading-relaxed">
                احجز استشارة مجانية، ونطلع لك بخطة تنفيذ واضحة تناسب ميزانيتك ومرحلة مشروعك.
              </p>
            </div>

            <div className="text-center md:text-left">
              <Link to="/form" onMouseEnter={prefetchForm} className="inline-block">
                <motion.button
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => pushGTMEvent("cta_click", { button_name: "استشارة مجانية", location: "services_section" })}
                  className="group relative inline-flex items-center justify-center gap-3 px-8 sm:px-10 py-3.5 sm:py-4 rounded-full text-base sm:text-lg font-black text-white overflow-hidden"
                  style={{ background: "linear-gradient(135deg, #7c3aed, #9b50e8)", boxShadow: "0 12px 34px rgba(124,58,237,0.35)" }}
                >
                  <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-150%] group-hover:translate-x-[150%]" />
                  <span className="relative inline-flex items-center gap-2.5">
                    احجز استشارة مجانية
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                  </span>
                </motion.button>
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

export default memo(ServicesSection);
