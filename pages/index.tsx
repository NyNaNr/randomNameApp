import Link from "next/link";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <>
      <div className="min-h-screen">
        <section>
          <h1>yur Appへようこそ</h1>
          <p>とにかく大きいランダムネームアプリ</p>
          <Link
            href={`/random_name_app/features`}
            className={
              "text-blue-500 hover:text-blue-700 underline font-semibold"
            }
          >
            とにかく大きいランダムネームアプリ
          </Link>
        </section>
      </div>
    </>
  );
}
