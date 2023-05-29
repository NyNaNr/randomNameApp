import Link from "next/link";
import { Inter } from "next/font/google";
import { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const router = useRouter();
  const currentUrl = `https://yur.vercel.app${router.asPath}`;
  const [width, setWidth] = useState(0);

  useEffect(() => {
    // Only run on the client side
    setWidth(window.innerWidth);
  }, []);
  return (
    <>
      <Head>
        <title>Features - とにかく大きい ランダムネーム アプリ</title>
        <meta
          name="description"
          content="このWebアプリはビンゴのようにランダムに名前を大きく表示するアプリです。入力した名前は外部サーバーに送信されず、ローカルに保存されます。"
        />
        <meta property="og:url" content={currentUrl} />
      </Head>

      <div className="min-h-screen">
        <div className="m-10">
          <h1 className="text-4xl text-center font-bold mb-10">
            とにかく大きい{width > 639 ? "" : <br></br>}
            ランダムネームアップ
          </h1>
          <h2 className="text-2xl font-semibold ">アプリ紹介</h2>
          <div className="paragraph mb-10">
            <div className="flex border-b border-black/20 dark:border-white/20 mt-2 mb-2"></div>
            <p>
              　当Webアプリは、名前をビンゴのようにランダムに大きく表示するアプリです。
            </p>
            <p>
              　授業や講義の指名、結婚式の余興など、さまざまなシーンでご利用いただけます。教室等の大型モニターに映しながら使用することを想定して作成しました。スマホやタブレットにも対応しています。
            </p>
            <p>
              　特徴は、とにかく大きく名前を表示できることで、見やすさを追求しています。
            </p>
          </div>
          <h2 className="text-2xl font-semibold mb-2">
            入力された個人情報について
          </h2>
          <div className="paragraph mb-10">
            <div className="flex border-b border-black/20 dark:border-white/20 mt-2 mb-2"></div>
            <p>
              　利用の際に入力される情報は、当Webアプリが外部サーバーに送信することはありません。すべての情報はローカルに保存され、第三者と共有されることはありません。
            </p>
            <p>
              　すべての入力された情報はユーザーのパソコン（ブラウザ）にファーストパーティーcookieの技術を用いて保存されます。これはブラウザを閉じても情報が保持され、再度開いた時に同じ情報が表示されることを可能にします。
            </p>
            <p>
              　cookieの性質上、ユーザーがリストを編集・保存してから1年後、入力した名前が自動的に削除されます。ただし、Safariブラウザではcookieの保存期限が1週間となる等、ブラウザの仕様変更などで保存できる期限が変わる可能性があります。ユーザーがリストを削除することで、個人情報もブラウザから削除されます。
            </p>
            <p>
              　プライベートモードやシークレットモードで使用する際は、cookieに情報が保存できません。通常モードでアクセスしなおしてください。
            </p>
          </div>
          <div className="flex justify-end">
            <Link
              href={`/random_name_app/home`}
              className={
                "border border-solid p-3 pl-4 rounded-lg border-gray-400  bg-blue-400 text-white dark:text-black hover:bg-blue-500 font-semibold"
              }
            >
              アプリへ
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
