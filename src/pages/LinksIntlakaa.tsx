import { useEffect, useMemo, useState } from "react";
import styles from "./LinksIntlakaa.module.css";
import { fetchInfoPage, type InfoPageData, type InfoLink, type InfoSocial } from "@/services/infoPageService";
import { getSocialIcon } from "@/lib/socialIcons";

type Props = {
  initialData?: InfoPageData;
};

function SocialIcon({ social }: { social: InfoSocial }) {
  return (
    <a
      href={social.url || "#"}
      target="_blank"
      rel="noopener noreferrer"
      title={social.label}
      aria-label={social.label}
      className={styles.socialIcon}
    >
      <svg fill="currentColor" width="32" height="32" viewBox="0 0 24 24">
        <title>{social.label}</title>
        {getSocialIcon(social.icon || social.label)}
      </svg>
      <span className={styles.srOnly}>{social.label}</span>
    </a>
  );
}

function LinkButton({ link }: { link: InfoLink }) {
  const handleShare = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const shareData = { title: link.title, url: link.url };
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share(shareData);
      } else if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(link.url);
        alert("تم نسخ الرابط");
      }
    } catch {
      /* ignore share dismissal */
    }
  };

  return (
    <div className={styles.linkRow}>
      <a
        href={link.url || "#"}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.linkButton}
      >
        <div className={styles.linkInner}>
          {link.image && (
            <div className={styles.linkThumb}>
              <img loading="eager" src={link.image} alt={link.title} />
            </div>
          )}
          <div className={styles.linkTitle}>{link.title}</div>
        </div>
      </a>
      <button
        type="button"
        className={styles.linkShare}
        aria-label={`Share ${link.title}`}
        onClick={handleShare}
      >
        <svg
          width="3"
          height="11"
          viewBox="0 0 3 11"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="currentColor"
            d="M1.33333 10.6667C0.966667 10.6667 0.652778 10.5361 0.391667 10.275C0.130556 10.0139 0 9.7 0 9.33333C0 8.96667 0.130556 8.65278 0.391667 8.39167C0.652778 8.13056 0.966667 8 1.33333 8C1.7 8 2.01389 8.13056 2.275 8.39167C2.53611 8.65278 2.66667 8.96667 2.66667 9.33333C2.66667 9.7 2.53611 10.0139 2.275 10.275C2.01389 10.5361 1.7 10.6667 1.33333 10.6667ZM1.33333 6.66667C0.966667 6.66667 0.652778 6.53611 0.391667 6.275C0.130556 6.01389 0 5.7 0 5.33333C0 4.96667 0.130556 4.65278 0.391667 4.39167C0.652778 4.13056 0.966667 4 1.33333 4C1.7 4 2.01389 4.13056 2.275 4.39167C2.53611 4.65278 2.66667 4.96667 2.66667 5.33333C2.66667 5.7 2.53611 6.01389 2.275 6.275C2.01389 6.53611 1.7 6.66667 1.33333 6.66667ZM1.33333 2.66667C0.966667 2.66667 0.652778 2.53611 0.391667 2.275C0.130556 2.01389 0 1.7 0 1.33333C0 0.966667 0.130556 0.652778 0.391667 0.391667C0.652778 0.130556 0.966667 0 1.33333 0C1.7 0 2.01389 0.130556 2.275 0.391667C2.53611 0.652778 2.66667 0.966667 2.66667 1.33333C2.66667 1.7 2.53611 2.01389 2.275 2.275C2.01389 2.53611 1.7 2.66667 1.33333 2.66667Z"
          />
        </svg>
      </button>
    </div>
  );
}

export default function LinksIntlakaa({ initialData }: Props) {
  const [data, setData] = useState<InfoPageData | null>(initialData ?? null);
  const [loading, setLoading] = useState(!initialData);

  useEffect(() => {
    if (initialData) return;
    let cancelled = false;
    fetchInfoPage()
      .then((d) => {
        if (!cancelled) setData(d);
      })
      .catch(() => {
        if (!cancelled) setData(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [initialData]);

  const themeStyle = useMemo(() => {
    if (!data) return undefined;
    return {
      "--li-profile-bg": data.theme.profileBg,
      "--li-desktop-frame": data.theme.desktopFrame,
      "--li-button-bg": data.theme.buttonBg,
      "--li-button-text": data.theme.buttonText,
      "--li-title-text": data.theme.titleText,
      "--li-description-text": data.theme.descriptionText,
      "--li-button-hover": data.theme.buttonBg,
    } as React.CSSProperties;
  }, [data]);

  if (loading) {
    return (
      <div className={styles.pageBg}>
        <main className={styles.profile}>
          <div className={styles.loading}>...جاري التحميل</div>
        </main>
      </div>
    );
  }

  if (!data || data.isActive === false) {
    return (
      <div className={styles.pageBg}>
        <main className={styles.profile}>
          <div className={styles.loading}>الصفحة غير متاحة حالياً</div>
        </main>
      </div>
    );
  }

  const sortedLinks = [...data.links].sort((a, b) => a.order - b.order);
  const sortedSocials = [...data.socials].sort((a, b) => a.order - b.order);

  return (
    <div className={styles.pageBg}>
      {/* Decorative glow orbs */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
        <div style={{ position: "absolute", top: "10%", right: "-10%", width: 400, height: 400, background: "rgba(155,80,232,0.18)", borderRadius: "50%", filter: "blur(80px)" }} />
        <div style={{ position: "absolute", bottom: "15%", left: "-10%", width: 320, height: 320, background: "rgba(26,10,52,0.6)", borderRadius: "50%", filter: "blur(60px)" }} />
      </div>
      <main className={styles.profile} style={themeStyle}>
        <header className={styles.profileHeader}>
          {data.profile.avatar && (
            <div className={styles.profilePicture}>
              <img src={data.profile.avatar} alt={data.profile.name} />
            </div>
          )}
          <h1 className={styles.profileTitle}>{data.profile.name}</h1>
          {data.profile.description && (
            <h2 className={styles.profileDescription}>
              {data.profile.description}
            </h2>
          )}

          {sortedSocials.length > 0 && (
            <div className={styles.socialRow}>
              {sortedSocials.map((s) => (
                <SocialIcon key={s.id} social={s} />
              ))}
            </div>
          )}
        </header>

        <section className={styles.linksContainer}>
          {sortedLinks.map((l) => (
            <LinkButton key={l.id} link={l} />
          ))}
        </section>

        <footer className={styles.profileFooter}>
          <p>© {new Date().getFullYear()} {data.profile.name}</p>
        </footer>
      </main>
    </div>
  );
}
