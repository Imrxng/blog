import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="nl-BE">
      <Head />
      <Head>
        <script
          src="https://kit.fontawesome.com/d59bc2ea1d.js"
          crossOrigin="anonymous"
        ></script>
        <link
          rel="shortcut icon"
          href="/icons/portfolio.webp"
          type="image/x-icon"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
