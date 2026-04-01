import { motion } from "framer-motion";
import { useState, memo } from "react";

const platforms = [
  { name: "سلة",        logoWebp: "/Logos/sallaLogo.webp",   logoFallback: "/Logos/sallaLogo.png",   color: "#10b981", glow: "rgba(16,185,129,0.4)" },
  { name: "زد",         logoWebp: "/Logos/ZidLogo.webp",      logoFallback: "/Logos/ZidLogo.png",      color: "#a855f7", glow: "rgba(168,85,247,0.4)" },
  { name: "TikTok",     logoWebp: "/Logos/TikTokLogo.webp",   logoFallback: "/Logos/TikTokLogo.png",   color: "#ec4899", glow: "rgba(236,72,153,0.4)" },
  { name: "Snapchat",   logoWebp: "/Logos/SnapchatLogo.webp", logoFallback: "/Logos/SnapchatLogo.jpg", color: "#eab308", glow: "rgba(234,179,8,0.4)" },
  { name: "Meta",       logoWebp: "/Logos/MetaLogo.webp",     logoFallback: "/Logos/MetaLogo.png",     color: "#3b82f6", glow: "rgba(59,130,246,0.4)", lightBadge: true },
  { name: "Google Ads", logoWebp: "/Logos/GoogleAds.webp",    logoFallback: "/Logos/GoogleAds.png",    color: "#3b82f6", glow: "rgba(59,130,246,0.4)" },
  { name: "WordPress",  logoWebp: "/Logos/wordpress.webp",    logoFallback: "/Logos/wordpress.png",    color: "#60a5fa", glow: "rgba(96,165,250,0.4)" },
  { name: "Shopify",    logoWebp: "/Logos/Shopify-Log.png",   logoFallback: "/Logos/Shopify-Log.png",  color: "#84cc16", glow: "rgba(132,204,22,0.4)", lightBadge: true },
];

const PlatformsSection = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="relative section-py px-4 overflow-hidden section-bg-elevated">
      {/* Background orb */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 -right-1/4 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{ background: "radial-gradient(circle, rgba(155,80,232,0.3), transparent)" }}
          animate={{ scale: [1, 1.25, 1], x: [0, 80, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="container mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, type: "spring" }}
            className="inline-block mb-6"
          >
            <div className="rounded-full px-6 py-2" style={{ background: "rgba(155,80,232,0.1)", border: "1px solid rgba(155,80,232,0.25)" }}>
              <span className="text-sm font-bold text-gradient">شركاء النجاح</span>
            </div>
          </motion.div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 text-white leading-[1.4]">
            المنصات التي{" "}
            <span className="text-gradient">نُبدع فيها</span>
          </h2>
          <p className="text-lg text-white/55 max-w-2xl mx-auto leading-relaxed">
            نحول حضورك الرقمي لتجربة استثنائية عبر أقوى المنصات العالمية
          </p>
        </motion.div>

        {/* Mobile horizontal scroll */}
        <div className="grid grid-flow-col auto-cols-max gap-4 overflow-x-auto no-scrollbar pb-6 md:hidden px-4" style={{ WebkitOverflowScrolling: "touch" }}>
          {platforms.map((p) => (
            <div key={p.name} className="w-[84px] h-[84px] rounded-2xl flex items-center justify-center relative shadow-lg" style={{ background: "rgba(21,11,46,0.8)", border: `1px solid ${p.color}50`, boxShadow: `0 0 20px ${p.glow}` }}>
              <div
                className="absolute inset-0 rounded-2xl blur-xl opacity-60"
                style={{ background: `radial-gradient(circle, ${p.glow}, transparent 70%)` }}
              />
              <div
                className={`relative z-10 flex items-center justify-center ${p.lightBadge ? "bg-white/95 rounded-xl p-1.5" : ""}`}
              >
                <img
                  src={p.logoWebp}
                  alt={p.name}
                  width={48}
                  height={48}
                  loading="lazy"
                  decoding="async"
                  onError={(event) => {
                    const image = event.currentTarget;
                    if (image.dataset.fallbackApplied === "true") return;
                    image.dataset.fallbackApplied = "true";
                    image.src = p.logoFallback;
                  }}
                  className={`${p.lightBadge ? "w-12 h-12" : "w-12 h-12"} object-contain`}
                  style={{ filter: `drop-shadow(0 0 10px ${p.color}80) brightness(${p.lightBadge ? "1" : "1.2"})` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Desktop grid */}
        <div className="hidden md:grid grid-flow-col auto-cols-fr gap-6 lg:gap-8">
          {platforms.map((platform, index) => (
            <motion.div
              key={platform.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="relative group"
              style={{ perspective: "800px" }}
            >
              {/* Permanent glow */}
              <motion.div
                className="absolute -inset-3 rounded-3xl blur-2xl"
                style={{ background: `radial-gradient(circle, ${platform.glow}, transparent 70%)` }}
                initial={{ opacity: 0.6 }}
                animate={{ opacity: hoveredIndex === index ? 1 : 0.6 }}
                transition={{ duration: 0.3 }}
              />
              <div
                className="relative aspect-square rounded-3xl p-8 flex flex-col items-center justify-center transition-all duration-500 overflow-hidden cursor-pointer"
                style={{
                  background: "rgba(21,11,46,0.7)",
                  border: `1px solid ${hoveredIndex === index ? `${platform.color}80` : `${platform.color}40`}`,
                  boxShadow: `0 0 ${hoveredIndex === index ? '35px' : '20px'} ${platform.glow}`,
                  backdropFilter: "blur(12px)",
                  transform: hoveredIndex === index ? "translateY(-6px) scale(1.03)" : "translateY(0)",
                }}
              >
                <div
                  className={`relative z-10 w-full h-full flex items-center justify-center transition-all duration-500 ${platform.lightBadge ? "bg-white/95 rounded-2xl p-3" : ""}`}
                  style={{ transform: hoveredIndex === index ? "scale(1.1)" : "scale(1)" }}
                >
                  <img
                    src={platform.logoWebp}
                    alt={platform.name}
                    width={160}
                    height={160}
                    loading="lazy"
                    decoding="async"
                    onError={(event) => {
                      const image = event.currentTarget;
                      if (image.dataset.fallbackApplied === "true") return;
                      image.dataset.fallbackApplied = "true";
                      image.src = platform.logoFallback;
                    }}
                    className={`w-full h-full object-contain transition-all duration-500 ${platform.name === "WordPress" ? "rounded-full" : ""}`}
                    style={{
                      filter: `drop-shadow(0 0 12px ${platform.color}90) brightness(${platform.lightBadge ? "1" : "1.2"})`,
                    }}
                  />
                </div>
                {/* Name on hover */}
                <motion.div
                  initial={false}
                  animate={{ opacity: hoveredIndex === index ? 1 : 0, y: hoveredIndex === index ? 0 : 8 }}
                  transition={{ duration: 0.25 }}
                  className="absolute bottom-3 text-xs font-bold"
                  style={{ color: platform.color }}
                >
                  {platform.name}
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default memo(PlatformsSection);
