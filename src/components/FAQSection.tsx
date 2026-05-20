import { memo, useState } from "react";
import { Plus, Minus, HelpCircle } from "lucide-react";
import FadeIn from "@/components/FadeIn";

const faqs = [
  { q: "كيف تختلف انطلاقة عن الوكالات الأخرى؟", a: "انطلاقة ليست مجرد وكالة، بل شريك نمو حقيقي. نعمل مع عدد محدود جدًا من العملاء لنتمكن من التركيز على كل عميل بشكل كامل. يضم فريقنا أكثر من 25 خبير تسويق عالمي المستوى، وقد أدرنا مئات الملايين من المبيعات لعملائنا." },
  { q: "ما هو الوقت المتوقع لرؤية النتائج؟", a: "في الغالب تبدأ النتائج الأولية بالظهور خلال أول ١٤–٣٠ يومًا من إطلاق الحملات. أما النتائج القوية والمستدامة، فتظهر بوضوح خلال ٦٠–٩٠ يومًا. نتابع كل شيء بشكل يومي وتُعدَّل الاستراتيجية للوصول إلى أفضل نتيجة." },
  { q: "ما الخدمات التي تقدمونها؟", a: "نقدم خدمات متكاملة: إدارة الإعلانات المدفوعة على Meta وTikTok وGoogle وSnapchat، واستراتيجية المحتوى، وتصميم صفحات الهبوط، وتحسين معدل التحويل CRO، وإدارة الصفحات، والاستشارات التسويقية المتخصصة." },
  { q: "هل تعملون مع المتاجر الإلكترونية فقط؟", a: "نحن متخصصون بشكل رئيسي في المتاجر الإلكترونية على منصتي سلة وزد، لكننا نعمل أيضًا مع العلامات التجارية التي تسعى إلى زيادة مبيعاتها عبر القنوات الرقمية، مهما كان نموذج عملها." },
  { q: "ما تكلفة خدماتكم؟", a: "تختلف الأسعار حسب نوع الخدمة، وحجم الميزانية الإعلانية، وأهداف العميل. نقدم استشارة مجانية لتقييم وضعك وتحديد الباقة الأنسب لك — دون أي التزام مسبق." },
  { q: "هل أستطيع متابعة أداء حملاتي بشكل مستمر؟", a: "نعم بالتأكيد. كل عميل لدينا يحصل على مدير حساب مخصص يرسل تقارير دورية واضحة وشاملة، بالإضافة إلى وصول كامل للوحات التحليل الحية، لتتمكن من متابعة نتائجك في أي وقت." },
];

function FAQItem({ q, a, index, isOpen, onToggle }: { q: string; a: string; index: number; isOpen: boolean; onToggle: () => void }) {
  return (
    <FadeIn
      direction="up"
      delay={index * 0.06}
      duration={0.5}
      margin="-40px"
      className="rounded-2xl overflow-hidden transition-all duration-300"
      style={{
        background: isOpen ? "rgba(155,80,232,0.08)" : "rgba(21,11,46,0.5)",
        border: `1px solid ${isOpen ? "rgba(155,80,232,0.3)" : "rgba(155,80,232,0.08)"}`,
      }}
    >
      <button onClick={onToggle} className="w-full flex items-center justify-between gap-4 px-6 py-5 text-right" id={`faq-${index}`} aria-expanded={isOpen} aria-controls={`faq-answer-${index}`}>
        <span className="text-base md:text-lg font-bold text-white leading-relaxed">{q}</span>
        <span className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300"
          style={{ background: isOpen ? "#9b50e8" : "rgba(155,80,232,0.12)", color: isOpen ? "#fff" : "rgba(255,255,255,0.5)" }}>
          {isOpen ? <Minus className="w-4 h-4" strokeWidth={2.5} /> : <Plus className="w-4 h-4" strokeWidth={2.5} />}
        </span>
      </button>
      <div
        id={`faq-answer-${index}`}
        role="region"
        aria-labelledby={`faq-${index}`}
        aria-hidden={!isOpen}
        className={`grid ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
        style={{ transition: "grid-template-rows 350ms cubic-bezier(0.25, 0.46, 0.45, 0.94)" }}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="px-6 pb-6">
            <p className="text-white/60 leading-[2] text-base">{a}</p>
          </div>
        </div>
      </div>
    </FadeIn>
  );
}

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  return (
    <section className="relative section-py px-4 overflow-hidden section-bg-accent">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -bottom-40 right-1/2 translate-x-1/2 w-[600px] h-[600px] rounded-full blur-[120px] opacity-[0.06]" style={{ background: "radial-gradient(circle, #9b50e8, transparent 70%)" }} />
      </div>
      <div className="container mx-auto relative z-10 max-w-4xl">
        <FadeIn direction="up" duration={0.6} className="text-center mb-16">
          <FadeIn
            direction="scale"
            duration={0.5}
            className="inline-flex items-center gap-2 rounded-full px-6 py-2 mb-6"
            style={{ background: "rgba(155,80,232,0.1)", border: "1px solid rgba(155,80,232,0.2)" }}
          >
            <HelpCircle className="w-4 h-4" style={{ color: "#9b50e8" }} strokeWidth={2.5} />
            <span className="text-sm font-bold text-white/90">أسئلة شائعة</span>
          </FadeIn>
          <h2 className="text-4xl md:text-5xl font-black mb-4 text-white leading-[1.4]">لديك أسئلة؟ <span className="text-gradient">لدينا الإجابات</span></h2>
          <p className="text-white/45 text-lg max-w-xl mx-auto">نجيب عن أكثر الأسئلة التي يطرحها العملاء قبل أن يبدأوا معنا</p>
        </FadeIn>
        <div className="space-y-4">
          {faqs.map((faq, i) => <FAQItem key={i} q={faq.q} a={faq.a} index={i} isOpen={openIndex === i} onToggle={() => setOpenIndex(openIndex === i ? null : i)} />)}
        </div>
        <FadeIn
          direction="up"
          duration={0.6}
          delay={0.3}
          className="mt-14 text-center p-8 rounded-3xl"
          style={{ background: "rgba(21,11,46,0.5)", border: "1px solid rgba(155,80,232,0.1)" }}
        >
          <p className="text-white/65 text-lg mb-2 font-medium">لم تجد إجابة سؤالك؟</p>
          <p className="text-white/40 text-sm mb-6">تواصل معنا مباشرةً، وسيجيبك فريقنا في أقرب وقت.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a href="/form" className="px-7 py-3.5 rounded-full font-bold text-white text-sm transition-all hover:bg-white/8" style={{ border: "1px solid rgba(155,80,232,0.25)", background: "rgba(155,80,232,0.08)" }}>
              احجز استشارة مجانية</a>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

export default memo(FAQSection);
