import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="ar" dir="rtl">
      <Head>
        <meta name="theme-color" content="#2B0862" />

        {/* Preconnect to critical origins for faster resource loading */}
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
