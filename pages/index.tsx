import Link from "next/link";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <>
      <section>
        <h1>yur Appへようこそ</h1>
        <p>とにかく大きいランダムネームアプリ</p>
        <Link href={`/random_name_app/home`} className={""}>
          スタート
        </Link>
      </section>
    </>
  );
}
