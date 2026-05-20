import { memo } from "react";
import FadeIn from "@/components/FadeIn";

const customerLogos = [
  "/Customerslogos/moaSasA.webp",
  "/Customerslogos/benRadyjpg.webp",
  "/Customerslogos/WishFormula.svg",
  "/Customerslogos/Tammor.svg",
  "/Customerslogos/Saad.svg",
  "/Customerslogos/samTickets.webp",
  "/Customerslogos/l6.webp",
  "/Customerslogos/LaForme.svg",
  "/Customerslogos/Lord.svg",
  "/Customerslogos/l10.webp",
  "/Customerslogos/l11.webp",
  "/Customerslogos/l8.webp",
  "/Customerslogos/l9.webp",
  "/Customerslogos/l5.webp",
  "/Customerslogos/l7.webp",
  "/Customerslogos/Arslaaan.svg",
  "/Customerslogos/l3.webp",
  "/Customerslogos/l4.webp",
  "/Customerslogos/l1.webp",
  "/Customerslogos/ElMataeeb.svg",
  "/Customerslogos/Eklil.webp",
  "/Customerslogos/l2.webp",
].map((src, i) => ({ id: i + 1, src, alt: `عميل ${i + 1}` }));

const duplicatedLogos = [...customerLogos, ...customerLogos.slice(0, Math.ceil(customerLogos.length * 0.6))];

const CustomersLogosSection = () => (
  <section className="section-py-sm px-4 overflow-hidden section-bg-base">
    <div className="container mx-auto">
      <FadeIn direction="up" duration={0.6} className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-black text-white mb-2 leading-[1.5]">
          نفتخر بثقة <span className="text-gradient">العديد من العلامات التجارية</span>
        </h2>
        <p className="text-white/40 text-sm">عملاء يثقون بنا لتحقيق نموهم الرقمي</p>
      </FadeIn>

      <div className="relative">
        <div className="absolute right-0 top-0 bottom-0 w-20 md:w-40 z-10 pointer-events-none" style={{ background: "linear-gradient(to left, #0d0520, transparent)" }} />
        <div className="absolute left-0 top-0 bottom-0 w-20 md:w-40 z-10 pointer-events-none" style={{ background: "linear-gradient(to right, #0d0520, transparent)" }} />

        <div className="overflow-x-auto md:overflow-hidden no-scrollbar" dir="ltr" style={{ WebkitOverflowScrolling: "touch", touchAction: "pan-x" }}>
          <div className="marquee-track flex gap-4 md:gap-6 items-center py-4 px-4 md:px-0 w-max">
            {duplicatedLogos.map((logo, index) => (
              <div key={`${logo.id}-${index}`} className="flex-shrink-0 group">
                <div
                  className="relative w-36 h-24 md:w-44 md:h-28 rounded-2xl p-4 flex items-center justify-center transition-all duration-500 hover:scale-105 hover:shadow-lg"
                  style={{
                    background: "rgba(255,255,255,0.92)",
                    border: "1px solid rgba(155,80,232,0.12)",
                  }}
                >
                  <img
                    src={logo.src}
                    alt={logo.alt}
                    width={176}
                    height={112}
                    loading="lazy"
                    decoding="async"
                    className="max-w-full max-h-full object-contain transition-all duration-500"
                  />
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ background: "radial-gradient(circle, rgba(155,80,232,0.08), transparent 70%)" }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default memo(CustomersLogosSection);
