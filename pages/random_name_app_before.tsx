import Link from "next/link";
import Head from "next/head";
import Script from "next/script";
import styles from "@/styles/random_name_app.module.css";
import { useRef, useState, useEffect } from "react";

// cssのための関数
function Layout({ children }) {
  return <div className={styles.container}>{children}</div>;
}

// 今からuseState useEffectの実装を開始する。

function Header({ title }: { title: string }) {
  return <h1>{title ? title : "Default title"}</h1>;
}

export default function HomePage() {
  const nameList = [
    "山田　太郎",
    "田中 次郎",
    "佐藤 三郎",
    "伊藤 四郎",
    "渡辺 五郎",
    "鈴木 六郎",
    "高橋　七郎",
    "田村 八郎",
    "加藤九郎",
    "吉田 十郎",
    "松本 十一郎",
    "山口 十二郎",
    "中村 十三郎",
    "小林 十四郎",
    "斎藤　十五郎",
    "岡田 十六郎",
    "森田 十七郎",
    "河野 十八郎",
    "野村　 十九郎",
    "村田　　二十郎\n",
  ];
  let cleanedNamesList = nameList.map((name) => name.replace(/[\s　]/g, ""));
  let removedNamesList = []; // 削除された名前を追跡するための空のリスト
  let isNameShowing = false;
  let intervalId = null;
  let intervalTime = 60;
  const nameDisplay = document.querySelector(".name") as HTMLElement;
  const [cleanedNamesDisplay, setCleanedNamesDisplay] = useState(null);
  const [removedNamesDisplay, setRemovedNamesDisplay] = useState(null);
  useEffect(() => {
    setCleanedNamesDisplay(document.querySelector(".cleaned-names"));
    setRemovedNamesDisplay(document.querySelector(".removed-names"));
  }, []);

  function showRandomName() {
    const randomName =
      cleanedNamesList[Math.floor(Math.random() * cleanedNamesList.length)];
    if (nameDisplay) {
      nameDisplay.textContent = randomName;
      nameDisplay.classList.add("show");
      const longestName = cleanedNamesList.reduce((longest, name) =>
        name.length > longest.length ? name : longest
      );
      const fontSize = Math.floor(
        (window.innerWidth * 0.8) / longestName.length
      );
      nameDisplay.style.fontSize = `${fontSize}px`;
    }
  }

  function startNameDisplay() {
    if (!isNameShowing) {
      isNameShowing = true;
      intervalId = setInterval(() => {
        showRandomName();
      }, intervalTime);
    }
  }

  function stopNameDisplay() {
    clearInterval(intervalId);
    isNameShowing = false;
    const nameElements = document.getElementsByClassName("name show");
    const lastNameElement = nameElements[nameElements.length - 1];
    const lastName = lastNameElement.textContent;
    console.log(lastName);
    const shouldRemove = confirm(`${lastName}をリストから削除しますか？`);
    if (shouldRemove) {
      removedNamesList.push(lastName);
      // 削除された名前のリストからランダムに名前を選択する前に、削除された名前をリストから削除する
      cleanedNamesList = cleanedNamesList.filter(
        (name) => !removedNamesList.includes(name)
      );
      console.log(cleanedNamesList);
      console.log(removedNamesList);
    }
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      if (isNameShowing) {
        stopNameDisplay();
      } else {
        startNameDisplay();
      }
    }
  });

  useEffect(() => {
    function updateNameLists() {
      cleanedNamesDisplay.textContent = `cleanedNameList: ${cleanedNamesList.join(
        ", "
      )}`;
      removedNamesDisplay.textContent = `removedNamesList: ${removedNamesList.join(
        ", "
      )}`;

      if (cleanedNamesList.length === 0) {
        const message = "リストが空になりました。はじめからにしますか？";
        const shouldReload = confirm(message);
        if (shouldReload) {
          window.location.reload();
        }
      }
    }

    if (cleanedNamesDisplay && removedNamesDisplay) {
      // リストが変更されるたびにupdateNameListsを呼び出す
      setInterval(updateNameLists, 1000);
    }
  }, [
    cleanedNamesList,
    removedNamesList,
    cleanedNamesDisplay,
    removedNamesDisplay,
  ]);

  return (
    <Layout>
      <Header title="Develop. Preview. Ship. 🚀" />

      <div className="lists">
        <div className="cleaned-names"></div>
      </div>

      <div className="name"></div>

      <div className="lists">
        <div className="removed-names"></div>
      </div>

      <h2>
        <Link href="/">← Back to home</Link>
        <br />
        <Link href="/random_name_app">← random_name_app</Link>
      </h2>
    </Layout>
  );
}
