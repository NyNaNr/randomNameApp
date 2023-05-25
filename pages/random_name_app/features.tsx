import Link from "next/link";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <>
      <div className="min-h-screen">
        <div className="m-10">
          <h1>とにかく大きいランダムネームアップ</h1>
          <br />
          <p>
            当Webアプリは、名前をビンゴのようにランダムに大きく表示するアプリです。
          </p>
          <p>
            授業や講義の指名、結婚式の余興など、さまざまなシーンでご利用いただけます。
          </p>
          <p>
            特徴は、とにかく大きく名前を表示できることで、見やすさを追求しています。
          </p>
          <br />
          <h2>入力された個人情報について</h2>
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
          <br />
          <Link
            href={`/random_name_app/home`}
            className={
              "text-blue-500 hover:text-blue-700 underline font-semibold"
            }
          >
            アプリへ
          </Link>
        </div>
      </div>
    </>
  );
}
