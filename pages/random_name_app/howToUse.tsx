import Link from "next/link";
import { Inter } from "next/font/google";
import { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Image from "next/image";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const router = useRouter();
  const currentUrl = `https://yur.vercel.app${router.asPath}`;
  const [width, setWidth] = useState(0);

  return (
    <>
      <Head>
        <title>How to use - とにかく大きい ランダムネーム アプリ</title>
        <meta property="og:url" content={currentUrl} />
      </Head>

      <div className="min-h-screen">
        <div className="m-10">
          <h1 className="text-3xl sm:text-4xl text-center font-bold mb-10">
            アプリの使い方で困ったら
          </h1>
          <h2 className="text-2xl font-semibold pl-3">リストの順番を変える</h2>
          <div className="flex border-b border-black/20 dark:border-white/20 mt-2 mb-2"></div>
          <div className="image_description flex flex-col items-center sm:flex-row mt-5 sm:mb-10 sm:items-start">
            <Image
              src="/howToUse/dnd_example2.gif"
              alt="How to reorder the list using drag and drop."
              width={250}
              height={375}
              className="flex "
            />
            <div className="paragraph mb-10 mx-3 mt-5 sm:mt-0">
              <p>
                リスト名の左横にあるマークをクリックまたはタッチでドラッグアンドドロップし、入れ替えてください。
              </p>
            </div>
          </div>
          <h2 className="text-2xl font-semibold mb-2 pl-3">
            リストの名前を変更する
          </h2>
          <div className="flex border-b border-black/20 dark:border-white/20 mt-2 mb-2"></div>
          <div className="image_description flex flex-col items-center sm:flex-row mt-5 sm:mb-10 sm:items-start">
            <Image
              src="/howToUse/rename_example.gif"
              alt="How to reorder the list using drag and drop."
              width={250}
              height={375}
              className="flex "
            />
            <div className="paragraph mb-10 mx-3 mt-5 sm:mt-0">
              <p>
                ペンシルアイコンをクリックまたはタッチしてください。リストの名前が変更できます。変更後、内容を保存するにはエンターキーを押すか、チェックマークをクリックまたはタッチしてください。変更を取り消す場合は、×アイコンをクリックまたはタッチしてください。
              </p>
            </div>
          </div>
          <h2 className="text-2xl font-semibold mb-2 pl-3">リストを削除する</h2>
          <div className="flex border-b border-black/20 dark:border-white/20 mt-2 mb-2"></div>
          <div className="image_description flex flex-col items-center sm:flex-row mt-5 sm:mb-10 sm:items-start">
            <Image
              src="/howToUse/delete_example.gif"
              alt="How to reorder the list using drag and drop."
              width={250}
              height={375}
              className="flex "
            />
            <div className="paragraph mb-10 mx-3 mt-5 sm:mt-0">
              <p>
                ゴミ箱アイコンをクリックまたはタッチしてください。リスト削除ができます。本当に削除するならチェックマークをクリックまたはタッチしてください。もし削除を取り消す場合は、×アイコンをクリックまたはタッチしてください。
              </p>
              <p>
                リストを削除した時点で、あなたのパソコンのブラウザに保存されていた生徒の名前は削除されます。
              </p>
            </div>
          </div>
          <h2 className="text-2xl font-semibold mb-2 pl-3">
            ランダムに表示される文字が小さい
          </h2>{" "}
          <div className="flex border-b border-black/20 dark:border-white/20 mt-2 mb-2"></div>
          <div className="paragraph mb-10">
            <p>
              表示される文字の大きさは、名前リストで一番長い名前が収まるように計算されています。例えば
            </p>
            <br />
            <ul className="list-disc list-inside">
              <li>紀伊國屋文左衛門</li>
              <li>三井高利</li>
              <li>大村彦太郎</li>
              <li>淀屋辰五郎</li>
            </ul>
            <br />
            <p>
              のような名前のリストを作成すると、一番長い名前である「紀伊國屋文左衛門」が画面に収まるフォントサイズを計算し、決定します。よって、4文字の「三井高利」は相対的に小さくなります。
            </p>
          </div>
          <h2 className="text-2xl font-semibold mb-2 pl-3">
            入力した名前と整形後の名前の表示形式が違うのはなぜ？
          </h2>
          <div className="flex border-b border-black/20 dark:border-white/20 mt-2 mb-2"></div>
          <div className="paragraph mb-10">
            <h2 className="text-[20px] font-medium mt-5 mb-2 pl-3"></h2>
            <p>理由は2つあります。</p>
            <ul className="list-decimal list-inside">
              <li>ランダムに表示される名前が少しでも大きくするため</li>
              <div className="paragraph ml-4">
                <p>
                  先ほど述べた通り、ランダムに名前を表示する際、フォントサイズは文字数が最も多い名前が収まるサイズになるように計算されます。よって少しでも文字数を減らすために、姓と名の間の全角・半角スペースは自動的に削除されます。
                </p>
                <br />
              </div>
              <li>重複して名前を入力できないようにするため</li>
              <div className="paragraph ml-4">
                <p>
                  システムの都合上、リストを移動するときに選ばれた名前と一致する名前を移動させます。なので、複数同じ名前を入力しても意味がないのです。
                </p>
                <p>もし、同じ名前を複数入力したいときは、</p>
                <ul className="list-disc list-inside">
                  <li>1坂本龍馬</li>
                  <li>2坂本龍馬</li>
                  <li>3坂本龍馬</li>
                  <li>4坂本龍馬</li>
                </ul>
                <p>と少し変化をつけるといいです。</p>
              </div>
            </ul>
          </div>
          <div className="flex justify-end">
            <Link
              href={`/random_name_app/home`}
              className={
                "border border-solid p-3 pl-4 rounded-lg border-gray-400  bg-blue-400 text-white dark:text-black hover:bg-blue-500 font-semibold"
              }
            >
              アプリへ戻る
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
