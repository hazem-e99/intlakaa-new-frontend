import { motion } from "framer-motion";
import { memo } from "react";

const optimizeCloudinaryImage = (url: string) => {
  if (!url.includes("res.cloudinary.com")) return url;
  return url.replace("/upload/", "/upload/f_auto,q_auto,dpr_auto/");
};

const customerLogos = [
  "https://res.cloudinary.com/dvgi2kkpy/image/upload/v1773183986/moaSasA_jx3l7q.png",
  "https://res.cloudinary.com/dvgi2kkpy/image/upload/v1773183985/benRadyjpg_k4spbp.png",
  "https://res.cloudinary.com/dvgi2kkpy/image/upload/v1773183790/WishFormula_a2uhp5.svg",
  "https://res.cloudinary.com/dvgi2kkpy/image/upload/v1773183790/Tammor_ekozvf.svg",
  "https://res.cloudinary.com/dvgi2kkpy/image/upload/v1773183787/Saad_fn5euv.svg",
  "https://res.cloudinary.com/dvgi2kkpy/image/upload/v1773183787/samTickets_eg0jln.webp",
  "https://res.cloudinary.com/dvgi2kkpy/image/upload/v1773183786/l6_bif8bd.png",
  "https://res.cloudinary.com/dvgi2kkpy/image/upload/v1773183785/LaForme_egaz9x.svg",
  "https://res.cloudinary.com/dvgi2kkpy/image/upload/v1773183786/Lord_ub3kyr.svg",
  "https://res.cloudinary.com/dvgi2kkpy/image/upload/v1773183784/l10_kirxkh.png",
  "https://res.cloudinary.com/dvgi2kkpy/image/upload/v1773183784/l11_z0f0yr.png",
  "https://res.cloudinary.com/dvgi2kkpy/image/upload/v1773183783/l8_wxggyq.png",
  "https://res.cloudinary.com/dvgi2kkpy/image/upload/v1773183783/l9_tunpxm.png",
  "https://res.cloudinary.com/dvgi2kkpy/image/upload/v1773183781/l5_dkzgvx.png",
  "https://res.cloudinary.com/dvgi2kkpy/image/upload/v1773183782/l7_f8ru6p.png",
  "https://res.cloudinary.com/dvgi2kkpy/image/upload/v1773183780/Arslaaan_wz0yt5.svg",
  "https://res.cloudinary.com/dvgi2kkpy/image/upload/v1773183780/l3_cmf2f7.png",
  "https://res.cloudinary.com/dvgi2kkpy/image/upload/v1773183780/l4_ybiyri.png",
  "https://res.cloudinary.com/dvgi2kkpy/image/upload/v1773183779/l1_nq3gmp.png",
  "https://res.cloudinary.com/dvgi2kkpy/image/upload/v1773183779/ElMataeeb_jmnz5v.svg",
  "https://res.cloudinary.com/dvgi2kkpy/image/upload/v1773183779/Eklil_l2el20.png",
  "https://res.cloudinary.com/dvgi2kkpy/image/upload/v1773183779/l2_rpxeyy.png",
].map((src, i) => ({ id: i + 1, src: optimizeCloudinaryImage(src), alt: `عميل ${i + 1}` }));

const duplicatedLogos = [...customerLogos, ...customerLogos];

const CustomersLogosSection = () => (
  <section className="section-py-sm px-4 overflow-hidden section-bg-base">
    <div className="container mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl md:text-4xl font-black text-white mb-2 leading-[1.5]">
          نفتخر بثقة أكثر من <span className="text-gradient">علامة تجارية</span>
        </h2>
        <p className="text-white/40 text-sm">عملاء يثقون بنا لتحقيق نموهم الرقمي</p>
      </motion.div>

      {/* Marquee */}
      <div className="relative">
        {/* Fade edges — dark to match #0d0520 */}
        <div className="absolute right-0 top-0 bottom-0 w-20 md:w-40 z-10 pointer-events-none" style={{ background: "linear-gradient(to left, #0d0520, transparent)" }} />
        <div className="absolute left-0 top-0 bottom-0 w-20 md:w-40 z-10 pointer-events-none" style={{ background: "linear-gradient(to right, #0d0520, transparent)" }} />

        <div className="overflow-hidden" dir="ltr">
          <motion.div
            className="flex gap-6 items-center py-4 w-max"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ x: { repeat: Infinity, repeatType: "loop", duration: 45, ease: "linear" } }}
          >
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
                  {/* Hover glow */}
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ background: "radial-gradient(circle, rgba(155,80,232,0.08), transparent 70%)" }} />
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  </section>
);

export default memo(CustomersLogosSection);
