import React, { useState, useEffect, useRef, useCallback } from "react";
import styles from "@/styles/random_name_app.module.css";

// TODO: なぜかフォーカスが当たり、エンターキーを押すための範囲が狭い。
// TODO 確定した名前がすぐ消える
// TODO 名前を大きくする。
// TODO 名前を追加するか選択できるように

// cssのための関数
function Layout({ children }) {
  return <div className={styles.container}>{children}</div>;
}

let names = [
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
names = names.map((name) => name.replace(/[\s　]/g, ""));

const Bingo: React.FC = () => {
  const [selectedName, setSelectedName] = useState<string | null>(null); //確定した名前
  const [IsShowingName, setIsShowingName] = useState<boolean>(false);
  const [nameConfirmed, setNameConfirmed] = useState<boolean>(false);
  const [showRandomName, setShowRandomName] = useState<boolean>(false);
  const [selectedNameList, setSelectedNameList] = useState<string[]>([]); //選択済みのリスト
  const [remainingNames, setRemainingNames] = useState<string[]>(names); //まだ選択されていない名前のリスト
  const bingoRef = useRef<HTMLDivElement>(null);
  const nameDisplay = useRef<HTMLDivElement>(null);

  const handleResize = useCallback(() => {
    const longestName = remainingNames.reduce((longest, name) =>
      name.length > longest.length ? name : longest
    );
    const fontSize = Math.floor((window.innerWidth * 0.8) / longestName.length);
    if (nameDisplay.current) {
      nameDisplay.current.style.fontSize = `${fontSize}px`;
    }
  }, [remainingNames]);

  useEffect(() => {
    if (bingoRef.current) {
      bingoRef.current.focus();
    }
  }, []);

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [handleResize]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    // ランダムに名前を表示する担当
    if (showRandomName) {
      //showRandomName ステートが true に設定されたときに発動
      intervalId = setInterval(() => {
        const remainingNamesCount = remainingNames.length;
        if (remainingNamesCount === 0) {
          //まだ選択されていない名前のリストが空になったら
          setShowRandomName(false);
        } else {
          const randomIndex = Math.floor(Math.random() * remainingNamesCount);
          const selectedName = remainingNames[randomIndex];
          setSelectedName(selectedName);
        }
      }, 60);
    }
    return () => {
      clearInterval(intervalId);
    };
  }, [showRandomName, remainingNames]);
  // おそらく始まり
  const startNameDisplay = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        event.preventDefault();
        if (!nameConfirmed) {
          setShowRandomName(!showRandomName);
        } else {
          setNameConfirmed(false);
          setSelectedName(null);
          setShowRandomName(false);
        }
      }
    },
    [nameConfirmed]
  );

  // 止まる
  const stopNameDisplay = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Enter" && selectedName) {
        event.preventDefault();
        setNameConfirmed(true);
        const shouldRemove = confirm(
          `${selectedName}をリストから削除しますか？`
        );
        if (shouldRemove) {
          setSelectedNameList([...selectedNameList, selectedName]); //ここで選択済みリストに追加
          setRemainingNames(
            remainingNames.filter((name) => name !== selectedName)
          );
          handleResize();
        }
      }
      if (remainingNames.length === 0) {
        setShowRandomName(false);
      }
    },
    [selectedName, remainingNames]
  );

  // グローバルなイベントリスナーを設定
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        if (showRandomName) {
          stopNameDisplay(event);
        } else {
          startNameDisplay(event);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [showRandomName, startNameDisplay, stopNameDisplay]);

  // useEffect(() => {
  //   window.addEventListener("keydown", startNameDisplay);
  //   window.addEventListener("keyup", stopNameDisplay);

  //   return () => {
  //     window.removeEventListener("keydown", startNameDisplay);
  //     window.removeEventListener("keyup", stopNameDisplay);
  //   };
  // }, [startNameDisplay, stopNameDisplay]);

  return (
    <Layout>
      <div>
        <div>
          <h2>Names List:</h2>

          {remainingNames.map((name) => (
            <span key={name}>{name} </span>
          ))}
        </div>
        <div>
          <h2>Selected Name:</h2>
          {
            selectedName && (
              <div className="nameDisplay" ref={nameDisplay}>
                {selectedName}
              </div>
            ) /* selectedNameがある場合のみ表示 */
          }
          <br></br>
          {!nameConfirmed && (
            <p>Press Enter to start/stop the name selection</p>
          )}
        </div>

        {selectedNameList.length > 0 && (
          <div>
            <h2>Selected Name List:</h2>
            <p>{selectedNameList.join(" ")}</p>
          </div>
        )}
        {selectedName && !nameConfirmed && (
          <div>
            <p>Press Enter to confirm the selected name</p>
          </div>
        )}
        {remainingNames.length === 0 && (
          <div>
            <p>All names have been selected</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Bingo;
