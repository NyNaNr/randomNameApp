import React, { useState, useEffect, useRef } from "react";

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
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const [nameConfirmed, setNameConfirmed] = useState<boolean>(false);
  const [showNames, setShowNames] = useState<boolean>(false);
  const [selectedNameList, setSelectedNameList] = useState<string[]>([]);
  const [remainingNames, setRemainingNames] = useState<string[]>(names);
  const bingoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bingoRef.current) {
      bingoRef.current.focus();
    }
  }, []);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (showNames) {
      intervalId = setInterval(() => {
        const remainingNamesCount = remainingNames.length;
        if (remainingNamesCount === 0) {
          setShowNames(false);
        } else {
          const randomIndex = Math.floor(Math.random() * remainingNamesCount);
          const selectedName = remainingNames[randomIndex];
          setSelectedName(selectedName);
        }
      }, 100);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [showNames, remainingNames]);

  const handleKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      if (!nameConfirmed) {
        setShowNames(!showNames);
      } else {
        setNameConfirmed(false);
        setSelectedName(null);
        setShowNames(false);
      }
    }
  };

  const handleConfirmName = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" && selectedName) {
      event.preventDefault();
      setNameConfirmed(true);
      setSelectedNameList([...selectedNameList, selectedName]);
      setRemainingNames(remainingNames.filter((name) => name !== selectedName));
    }
    if (remainingNames.length === 0) {
      setShowNames(false);
    }
  };

  return (
    <div
      ref={bingoRef}
      tabIndex={0}
      onKeyDown={handleKeyPress}
      onKeyUp={handleConfirmName}
    >
      <div>
        <h2>Names List:</h2>

        {remainingNames.map((name) => (
          <span key={name}>{name} </span>
        ))}
      </div>
      <div>
        <h2>Selected Name:</h2>
        {selectedName && <p>{selectedName}</p>}
        {!nameConfirmed && <p>Press Enter to start/stop the name selection</p>}
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
  );
};

export default Bingo;
