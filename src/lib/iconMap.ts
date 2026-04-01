import type { ElementType } from "react";
import {
  FaFacebook,
  FaLinkedin,
  FaInstagram,
  FaWhatsapp,
  FaYoutube,
  FaSnapchat,
  FaTelegram,
  FaPinterest,
  FaPhone,
  FaEnvelope,
  FaXTwitter,
} from "react-icons/fa6";
import { SiTiktok, SiThreads } from "react-icons/si";
import { MdLanguage } from "react-icons/md";

export type IconMeta = { Icon: ElementType; color: string };

export const SOCIAL_ICON_OPTIONS: {
  id: string;
  label: string;
  Icon: ElementType;
  color: string;
}[] = [
  { id: "facebook", label: "فيسبوك", Icon: FaFacebook, color: "#1877F2" },
  { id: "tiktok", label: "تيك توك", Icon: SiTiktok, color: "#010101" },
  { id: "linkedin", label: "لينكدإن", Icon: FaLinkedin, color: "#0A66C2" },
  { id: "instagram", label: "إنستغرام", Icon: FaInstagram, color: "#E1306C" },
  { id: "whatsapp", label: "واتساب", Icon: FaWhatsapp, color: "#25D366" },
  { id: "x", label: "X (تويتر)", Icon: FaXTwitter, color: "#000000" },
  { id: "youtube", label: "يوتيوب", Icon: FaYoutube, color: "#FF0000" },
  { id: "snapchat", label: "سناب شات", Icon: FaSnapchat, color: "#FFCA28" },
  { id: "telegram", label: "تيليجرام", Icon: FaTelegram, color: "#26A5E4" },
  { id: "threads", label: "ثريدز", Icon: SiThreads, color: "#000000" },
  { id: "pinterest", label: "بينترست", Icon: FaPinterest, color: "#E60023" },
  { id: "phone", label: "هاتف", Icon: FaPhone, color: "#4CAF50" },
  { id: "email", label: "بريد إلكتروني", Icon: FaEnvelope, color: "#EA4335" },
  { id: "globe", label: "رابط عام", Icon: MdLanguage, color: "#607D8B" },
];

export const ICON_MAP: Record<string, IconMeta> = Object.fromEntries(
  SOCIAL_ICON_OPTIONS.map((o) => [o.id, { Icon: o.Icon, color: o.color }])
);
