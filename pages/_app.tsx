import "@/styles/globals.css";

import type { AppProps } from "next/app";
import { Analytics } from "@vercel/analytics/react";
import Head from "next/head";
import GoogleAnalytics from "../components/GoogleAnalytics";
import usePageView from "../hooks/usePageView";

export default function App({ Component, pageProps }: AppProps) {
  usePageView();
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
          content="https://yur.vercel.app/ogImage.png"
        />

        {/* Twitter Card settings */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="" />
        <meta
          name="twitter:title"
          content="とにかく大きい ランダムネーム アプリ"
        />
        <meta
          name="twitter:description"
          content="ビンゴのようにランダムに名前を大きく表示するWeアプリです。入力した名前は外部サーバーに送信されず、ローカルに保存されます。"
        />
        <meta
          name="twitter:image"
          content="https://yur.vercel.app/ogImage.png"
        />
        <meta
          name="google-site-verification"
          content="9egKRDBY78wzxWE3GjSqBkjZ-xw480zb4PVogFGOhn0"
        />
      </Head>
      <GoogleAnalytics />
      <Component {...pageProps} />
      <Analytics />
    </>
  );
}
