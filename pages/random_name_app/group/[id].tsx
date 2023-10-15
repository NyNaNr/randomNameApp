import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";

// シャッフル関数
function shuffleArray<T>(array: T[]): T[] {
  let shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
}

// コンポーネント
const RosterShuffler: React.FC = () => {
  const [originalNames, setOriginalNames] = useState<string[]>([]);

  //ページ遷移＆ユーザーオプションの反映
  const router = useRouter();
  const [numColumns, setNumColumns] = useState(2); // 列数を管理するステート
  const [numRows, setNumRows] = useState<string[]>(); // 行数を管理するステート

  useEffect(() => {
    if (router.isReady) {
      const { id } = router.query;

      if (typeof id === "string") {
        // idに関連した値（名簿）を取得＆デコード
        const cookieValue = Cookies.get(id);
        let decodedNames = cookieValue
          ? JSON.parse(decodeURIComponent(cookieValue))
          : [];

        // ローカルストレージから checkboxStates の値を取得
        const checkboxStates = localStorage.getItem("checkboxStates");
        const parsedCheckboxStates = checkboxStates
          ? JSON.parse(checkboxStates)
          : {};

        // 現在の id に関連する isDeleteSpaceChecked の値を取得
        const isDeleteSpaceChecked =
          parsedCheckboxStates[id] &&
          parsedCheckboxStates[id].isDeleteSpaceChecked;

        // isDeleteSpaceChecked が true の場合、文字間のスペースを削除
        if (isDeleteSpaceChecked) {
          decodedNames = decodedNames.map((name: string) =>
            name.replace(/[\s\n　]/g, "")
          );
        }

        setOriginalNames(decodedNames);
      }
    }
  }, [router.isReady, router.query]);

  // 以下、行番号計算
  function generateNumberedArray(numRows: number) {
    let numberedArray = [];
    for (let i = 1; i <= numRows; i++) {
      numberedArray.push(String.fromCodePoint(9311 + i));
    }
    return numberedArray;
  }

  useEffect(() => {
    const numberOfElements = originalNames.length;
    let line_numbers = Math.ceil(numberOfElements / numColumns);
    if (line_numbers) {
      const numberedArray = generateNumberedArray(line_numbers);
      setNumRows(numberedArray);
    }
  }, [numColumns, originalNames, numRows]);

  // 以上、行番号計算

  useEffect(() => {
    // originalNames がセットされたら、shuffledRoster も更新。つまり初回読み込み時に表示できる
    setShuffledRoster(shuffleArray(originalNames));
  }, [originalNames]);

  const [shuffledRoster, setShuffledRoster] = useState<string[]>(originalNames);

  const handleShuffle = () => {
    setShuffledRoster(shuffleArray(originalNames));
  };

  const handleChangeColumns = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setNumColumns(Number(event.target.value));
  };

  return (
    <div className="p-6">
      <button
        onClick={handleShuffle}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Shuffle Roster
      </button>
      <select
        onChange={handleChangeColumns}
        value={numColumns}
        className="ml-4 p-2"
      >
        <option value={2}>2 Columns</option>
        <option value={3}>3 Columns</option>
        <option value={4}>4 Columns</option>
        <option value={5}>5 Columns</option>
        <option value={6}>6 Columns</option>
      </select>
      <div className="mt-6 flex">
        <div className={`grid grid-cols-1 gap-4`}>
          {(numRows || []).map((name, index) => (
            <div key={index} className=" bg-gray-200 rounded-lg ">
              <div className="overflow-hidden whitespace-nowrap overflow-ellipsis text-center text-[min(3vw)]">
                {name}
              </div>
            </div>
          ))}
        </div>
        <div className={` grid grid-cols-${numColumns} gap-4`}>
          {shuffledRoster.map((name, index) => (
            <div key={index} className=" bg-gray-200 rounded-lg ">
              <div className="overflow-hidden whitespace-nowrap overflow-ellipsis text-center text-[min(3.5vw)]">
                {name}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RosterShuffler;
