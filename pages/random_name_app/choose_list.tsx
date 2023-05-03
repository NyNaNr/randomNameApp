import Image from "next/image";
import { Inter } from "next/font/google";
import Cookie from "js-cookie";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <>
      <section>
        <h1>
          Learn{" "}
          <a href="https://nextjs.org/learn/foundations/about-nextjs?utm_source=next-site&utm_medium=nav-cta&utm_campaign=next-website">
            Next.js!
          </a>
        </h1>
        <p>
          Get started by editing <code>pages/index.js</code>
        </p>
      </section>
    </>
  );
}
