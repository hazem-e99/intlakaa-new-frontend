import api from "@/lib/api";

export type InfoLink = {
  id: string;
  title: string;
  url: string;
  image: string;
  order: number;
};

export type InfoSocial = {
  id: string;
  label: string;
  icon: string;
  url: string;
  order: number;
};

export type InfoProfile = {
  name: string;
  description: string;
  avatar: string;
};

export type InfoTheme = {
  profileBg: string;
  desktopFrame: string;
  buttonBg: string;
  buttonText: string;
  titleText: string;
  descriptionText: string;
};

export type InfoPageData = {
  _id?: string;
  key?: string;
  profile: InfoProfile;
  theme: InfoTheme;
  links: InfoLink[];
  socials: InfoSocial[];
  seoTitle?: string;
  seoDescription?: string;
  isActive?: boolean;
};

export const fetchInfoPage = async (): Promise<InfoPageData> => {
  const { data } = await api.get("/info-page");
  return data.data;
};

export const updateInfoPage = async (
  payload: Partial<InfoPageData>
): Promise<InfoPageData> => {
  const { data } = await api.put("/info-page", payload);
  return data.data;
};

export const resetInfoPage = async (): Promise<InfoPageData> => {
  const { data } = await api.post("/info-page/reset");
  return data.data;
};

export const SOCIAL_ICON_OPTIONS = [
  "tiktok",
  "whatsapp",
  "instagram",
  "x",
  "youtube",
  "facebook",
  "snapchat",
] as const;

export type SocialIconKey = (typeof SOCIAL_ICON_OPTIONS)[number];
