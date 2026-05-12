import { memo, useEffect, useState } from "react";
import { fetchSeoSettings, type SocialLink, type ContactInfo } from "@/services/seoService";
import { ICON_MAP } from "@/lib/iconMap";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import Image from "next/image";
import prefetchForm from "@/lib/prefetchForm";
import { pushGTMEvent } from "@/utils/gtm";
import FadeIn from "@/components/FadeIn";

const DEFAULT_CONTACT: ContactInfo[] = [
  { icon: "phone",    label: "اتصل بنا",  text: "+966 511 414 537", href: "tel:+966511414537" },
  { icon: "whatsapp", label: "واتساب",    text: "راسلنا مباشرةً",  href: "https://wa.me/966511414537" },
  { icon: "email",    label: "البريد",    text: "info@antlaqa.com", href: "mailto:info@antlaqa.com" },
];
const DEFAULT_SOCIAL: SocialLink[] = [
  { icon: "tiktok",   url: "https://www.tiktok.com/@intlakaa.agency?is_from_webapp=1&sender_device=pc", label: "TikTok" },
  { icon: "facebook", url: "https://www.facebook.com/share/1Vv4xzKZyu",   label: "Facebook" },
  { icon: "linkedin", url: "https://www.linkedin.com/company/intlakaa/",   label: "LinkedIn" },
];

const Footer = () => {
  const [contactInfo, setContactInfo] = useState<ContactInfo[]>(DEFAULT_CONTACT);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(DEFAULT_SOCIAL);

  useEffect(() => {
    fetchSeoSettings().then(data => {
      if (data.contactInfo?.length) setContactInfo(data.contactInfo);
      if (data.socialLinks?.length) setSocialLinks(data.socialLinks);
    }).catch(() => {});
  }, []);

  const activeSocials  = socialLinks.filter(l => l.url?.trim());
  const activeContacts = contactInfo.filter(c => c.href?.trim() && c.icon !== "email");

  return (
    <footer className="relative text-white overflow-hidden" style={{ background: "linear-gradient(180deg, #0d0520 0%, #060218 100%)" }}>
      <div className="h-px" style={{ background: "linear-gradient(to right, transparent, rgba(155,80,232,0.3), transparent)" }} />

      <div className="relative section-py px-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute -top-20 right-1/4 w-[500px] h-[500px] rounded-full blur-[120px] opacity-10 blob-pulse-1"
            style={{ background: "radial-gradient(circle, #9b50e8, transparent 70%)" }}
          />
        </div>

        <div className="container mx-auto relative z-10 text-center">
          <FadeIn direction="up" duration={0.6}>
            <div className="inline-flex items-center gap-2 rounded-full px-5 py-2 mb-8" style={{ background: "rgba(155,80,232,0.1)", border: "1px solid rgba(155,80,232,0.18)" }}>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              <span className="text-sm font-bold text-white/80">استشارة مجانية الآن</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-4 leading-[1.4]">
              لنبدأ معًا <span className="text-gradient">رحلة النجاح</span>
            </h2>
            <p className="text-lg text-white/50 mb-10 max-w-xl mx-auto">تواصل معنا الآن واحصل على استشارة تسويقية مجانية وخطة نمو مخصصة لمشروعك</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/form" onMouseEnter={prefetchForm}>
                <button
                  onClick={() => pushGTMEvent("cta_click", { button_name: "footer_cta", location: "footer" })}
                  className="cta-hover relative group inline-flex items-center gap-3 px-9 py-4 rounded-full font-black text-white text-base shadow-xl overflow-hidden"
                  style={{ background: "linear-gradient(135deg, #7c3aed, #9b50e8)" }}
                >
                  <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-transparent via-white/15 to-transparent -skew-x-12" />
                  <span className="relative flex items-center gap-3">احجز استشارتك المجانية <ArrowLeft className="w-4 h-4" /></span>
                </button>
              </Link>

            </div>
          </FadeIn>
        </div>
      </div>

      <div className="h-px" style={{ background: "linear-gradient(to right, transparent, rgba(155,80,232,0.1), transparent)" }} />

<div className="h-px" style={{ background: "linear-gradient(to right, transparent, rgba(155,80,232,0.06), transparent)" }} />

      <div className="py-8 px-6">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <Image
            src="/logo.webp"
            alt="انطلاقة"
            width={795}
            height={254}
            sizes="(max-width: 768px) 160px, 220px"
            className="h-10 md:h-12 w-auto transition-all duration-300 hover:scale-105"
            style={{ filter: "brightness(0) invert(1) drop-shadow(0 0 8px rgba(255,255,255,0.3))" }}
          />
          {activeSocials.length > 0 && (
            <div className="flex items-center gap-3">
              {activeSocials.map((social, index) => {
                const meta = ICON_MAP[social.icon] ?? ICON_MAP["globe"];
                const IconComp = meta.Icon;
                return (
                  <a key={index} href={social.url} target="_blank" rel="noopener noreferrer" aria-label={social.label}
                    className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-115 hover:-translate-y-0.5 active:scale-95"
                    style={{ background: "rgba(155,80,232,0.08)", border: "1px solid rgba(155,80,232,0.12)" }}>
                    <IconComp className="w-4 h-4 text-white/60" />
                  </a>
                );
              })}
            </div>
          )}
          <p className="text-sm text-white/25 text-center">© {new Date().getFullYear()} انطلاقة. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
};

export default memo(Footer);
