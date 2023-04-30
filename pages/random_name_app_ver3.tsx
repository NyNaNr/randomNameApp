import React, { useState, useEffect, useRef, useCallback } from "react";
import styles from "@/styles/random_name_app.module.css";

// Layout関数は変更なし
function Layout({ children }) {
  return <div className={styles.container}>{children}</div>;
}

// namesを定数として定義
const NAMES = [
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
].map((name) => name.replace(/[\s　]/g, ""));

const RandomNameApp: React.FC = () => {
  const isShowingName = useRef<boolean>(false);
  const intervalId = useRef<number | null>(null);
  const [remainingNames, setRemainingNames] = useState<string[]>(NAMES);
  const [selectedNameList, setSelectedNameList] = useState<string[]>([]);

  const nameDisplay = useRef<HTMLElement | null>(null);

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
  }, [showRandomName]);

  const stopNameDisplay = useCallback(() => {
    if (isShowingName.current) {
      if (intervalId.current !== null) {
        clearInterval(intervalId.current);
      }
      isShowingName.current = false;
    }

    if (!nameDisplay.current) return;

    const lastName = nameDisplay.current.textContent;
    const shouldRemove = confirm(`${lastName}をリストから削除しますか？`);

    if (shouldRemove) {
      setSelectedNameList([...selectedNameList, lastName]);
      setRemainingNames(remainingNames.filter((name) => name !== lastName));
    }
  }, [remainingNames, selectedNameList]);

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

  return (
    <Layout>
      <div className="lists">
        <div className="cleaned-names">
          {/* 未選択の名前を表示 */}
          {remainingNames.map((name, index) => (
            <div key={index}>{name}</div>
          ))}
        </div>
      </div>

      <div className="name" ref={nameDisplay}></div>

      <div className="lists">
        <div className="removed-names">
          {/* 選択済みの名前を表示 */}
          {selectedNameList.map((name, index) => (
            <div key={index}>{name}</div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default RandomNameApp;
