import React, { useState, useEffect, useRef, useCallback } from "react";
import styles from "@/styles/random_name_app.module.css";

// TODO 内容理解＆整理
// TODO　リストが空になったときの挙動修正
// TODO　名前が一定数以上になったとき、表示を省略する
// TODO CSSをあたっていない修正

// cssのための関数
function Layout({ children }) {
  return <div className={styles.container}>{children}</div>;
}

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
  /*
  コンポーネント内変数
  */
  const [selectedName, setSelectedName] = useState<string | null>(null); //確定した名前
  const isShowingName = useRef<boolean>(false);
  const intervalId = useRef<number | null>(null);
  let [remainingNames, setRemainingNames] = useState<string[]>(NAMES); //まだ選択されていない名前のリスト
  const [selectedNameList, setSelectedNameList] = useState<string[]>([]); //選択済みのリスト
  const nameDisplay = document.querySelector(".name")! as HTMLElement; //querySelectorの結果をHTMLElement型に明示的に型変換することで、styleプロパティにアクセスできるようになる

  /*
  イベントハンドラ
  */

  //関数に書き換える

  function showRandomNameFunction() {
    const randomName =
      remainingNames[Math.floor(Math.random() * remainingNames.length)];
    nameDisplay.textContent = randomName;
    nameDisplay.classList.add("show");
    const longestName = remainingNames.reduce((longest, name) =>
      name.length > longest.length ? name : longest
    );
    const fontSize = Math.floor((window.innerWidth * 0.8) / longestName.length);
    nameDisplay.style.fontSize = `${fontSize}px`;
  }

  //スタート
  const startNameDisplay = useCallback(() => {
    if (!isShowingName.current) {
      isShowingName.current = true;
      intervalId.current = window.setInterval(() => {
        showRandomNameFunction();
      }, 16); //16ミリ秒ごとに更新
    }
  }, []);

  // 止まる

  const stopNameDisplay = useCallback(() => {
    if (isShowingName.current) {
      if (intervalId.current !== null) {
        clearInterval(intervalId.current);
      }
      isShowingName.current = false;
    }
    const nameElements = document.getElementsByClassName("name show");
    const lastNameElement = nameElements[nameElements.length - 1];
    const lastName = lastNameElement.textContent;
    console.log(lastName);
    const shouldRemove = confirm(`${lastName}をリストから削除しますか？`);
    if (shouldRemove) {
      selectedNameList.push(lastName);
      // 削除された名前のリストからランダムに名前を選択する前に、削除された名前をリストから削除する
      remainingNames = remainingNames.filter(
        (name) => !remainingNames.includes(name)
      );
      console.log(remainingNames);
      console.log(selectedNameList);
    }
  }, []);

  /*
  イベントリスナー
  */
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

  /*
  ユーザー定義関数
  */

  return (
    <Layout>
      <div className="lists">
        {/* <div className="cleaned-names"></div> */}
        <div className="cleaned-names">
          {/* 未選択の名前を表示 */}
          {remainingNames.map((name, index) => (
            <div key={index}>{name}</div>
          ))}
        </div>
      </div>

      <div className="name"></div>

      <div className="lists">
        {/* <div className="removed-names"></div> */}
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
