import "@/styles/globals.css";

import type { AppProps } from "next/app";
import { Analytics } from "@vercel/analytics/react";
import Head from "next/head";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        {/* OGP settings */}
        <meta
          property="og:title"
          content="とにかく大きい ランダムネーム アプリ"
        />
        <meta
          property="og:description"
          content="ビンゴのようにランダムに名前を大きく表示するWebアプリです。入力した名前は外部サーバーに送信されず、ローカルに保存されます。"
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:image"
          content="http://www.yourwebsite.com/your-image.jpg"
        />

        {/* Twitter Card settings */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@your_twitter_username" />
        <meta
          name="twitter:title"
          content="Features - とにかく大きい ランダムネーム アプリ"
        />
        <meta
          name="twitter:description"
          content="ビンゴのようにランダムに名前を大きく表示するWeアプリです。入力した名前は外部サーバーに送信されず、ローカルに保存されます。"
        />
        <meta
          name="twitter:image"
          content="http://www.yourwebsite.com/your-image.jpg"
        />
      </Head>
      <Component {...pageProps} />
      <Analytics />
    </>
  );
}
