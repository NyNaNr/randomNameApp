import React, { useState, useEffect, useRef, useCallback } from "react";
import Head from "next/head";
import Link from "next/link";
import styles from "@/styles/random_name_app.module.css";

// TODO　リストが空になったときの挙動修正  解決！
// TODO　名前が一定数以上になったとき、表示を省略する  解決！リストを縦書きにして、並列に配置すれば名前が何行あってもOK
// TODO エンターキー待ちの時間に「Enterキーでスタート」と表示する。　解決！
// TODO CSSをあたっていない修正
// TODO 配置を変えた場合のfontサイズの計算を見直す
// TODO 内容理解＆整理
function Layout({ children }) {
  return <div className={styles.container}>{children}</div>;
}

// namesを定数として定義
const NAMES = [
  "坂本 龍馬",
  "西郷隆盛",
  "明智光秀",
  "織田信長",
  "豊臣秀吉",
  "徳川 家康",
  "源義経",
  "源頼朝",
  "足利尊氏",
  "足利義政",
  "上杉謙信",
  "武田信玄",
  "北条氏康",
  "北条時宗",
  "真田　　幸村",
  "伊達政宗",
  "宮本武蔵",
  "直江兼続",
  "井伊直政",
  "前田利家",
].map((name) => name.replace(/[\s　]/g, ""));

const RandomNameApp: React.FC = () => {
  const isShowingName = useRef<boolean>(false);
  const intervalId = useRef<number | null>(null);
  const [remainingNames, setRemainingNames] = useState<string[]>(NAMES);
  const [selectedNameList, setSelectedNameList] = useState<string[]>([]);

  const nameDisplay = useRef<HTMLElement | null>(null);
  const startNotifier = useRef<HTMLElement | null>(null);

  const showRandomName = useCallback(() => {
    if (!nameDisplay.current) return;

    const randomName =
      remainingNames[Math.floor(Math.random() * remainingNames.length)];
    nameDisplay.current.textContent = randomName;
    nameDisplay.current.classList.add("show");
    const longestName = remainingNames.reduce((longest, name) =>
      name.length > longest.length ? name : longest
    );
    const fontSize = Math.floor((window.innerWidth * 0.8) / longestName.length);
    nameDisplay.current.style.fontSize = `${fontSize}px`;
  }, [remainingNames]);

  const startNameDisplay = useCallback(() => {
    if (!isShowingName.current) {
      isShowingName.current = true;
      intervalId.current = window.setInterval(showRandomName, 16);
    }
    if (startNotifier.current) {
      startNotifier.current.textContent = ""; // メッセージを非表示にする
    }
  }, [showRandomName]);

  const stopNameDisplay = useCallback(() => {
    if (isShowingName.current) {
      if (intervalId.current !== null) {
        clearInterval(intervalId.current);
      }
      isShowingName.current = false;
    }
    if (!nameDisplay.current) return;
    if (remainingNames.length === 1) {
      const message = "最後の一人になりました。はじめからにしますか？";
      const shouldReload = confirm(message);
      if (shouldReload) {
        window.location.reload();
      }
    } else {
      const lastName = nameDisplay.current.textContent;
      const shouldRemove = confirm(`${lastName}をリストから削除しますか？`);

      if (shouldRemove) {
        setSelectedNameList([...selectedNameList, lastName]);
        setRemainingNames(remainingNames.filter((name) => name !== lastName));
      }
      //ここにユーザーにエンターキーでスタートを知らせる関数を作成

      startNotifier.current.textContent = "Enterキーでスタート！";
    }
  }, [remainingNames, selectedNameList]);

  //useEffectでコンポーネントマウント時に設定する
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        if (isShowingName.current) {
          stopNameDisplay();
        } else {
          startNameDisplay();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [startNameDisplay, stopNameDisplay]);

  useEffect(() => {
    if (startNotifier.current) {
      startNotifier.current.textContent = "Enterキーでスタート！"; // ページロード時にメッセージを表示する
    }
  }, []);

  return (
    <Layout>
      <Head>
        <title>RandomNameApp</title>
      </Head>
      <div className={styles.upper}>
        <div className={styles.lists}>
          <div className={styles.cleanedNames}>
            {/* 未選択の名前を表示 */}
            <p>未選択リスト</p>
            <br />
            {remainingNames.map((name, index) => (
              <div key={index}>{name}</div>
            ))}
          </div>
        </div>
        <div className={styles.display}>
          <div className={styles.nameDisplay} ref={nameDisplay}></div>
          <div className={styles.startNotifier} ref={startNotifier}></div>
        </div>

        <div className={styles.lists}>
          <div className={styles.removedNames}>
            {/* 選択済みの名前を表示 */}
            <p>選択済リスト</p>
            <br />
            {selectedNameList.map((name, index) => (
              <div key={index}>{name}</div>
            ))}
          </div>
        </div>
      </div>
      <h2>
        <Link href="/">← Back to home</Link>
        <p></p>
        <Link href="/practice2">← Practice2</Link>
      </h2>
    </Layout>
  );
};

export default RandomNameApp;
