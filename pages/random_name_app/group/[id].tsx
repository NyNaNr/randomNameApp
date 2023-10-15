import React, { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Cookies from "js-cookie";
import { isMobile } from "../../../utils/random_name_app";

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
  const selectRef = useRef<HTMLSelectElement>(null);
  const [mobileDevice, setMobileDevice] = useState(false);

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

  // モバイルかどうかの判定
  useEffect(() => {
    const mobile = isMobile();
    setMobileDevice(mobile !== undefined ? mobile : false);
  }, []);

  // 以下、行番号計算
  function generateNumberedArray(numRows: number) {
    let numberedArray = [];
    for (let i = 1; i <= numRows; i++) {
      numberedArray.push(i.toString());
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
  }, [numColumns, originalNames]);

  // 以上、行番号計算

  useEffect(() => {
    // originalNames がセットされたら、shuffledRoster も更新。つまり初回読み込み時に表示できる
    setShuffledRoster(shuffleArray(originalNames));
  }, [originalNames]);

  // 以下名簿シャッフル
  const [shuffledRoster, setShuffledRoster] = useState<string[]>(originalNames);
  const handleShuffle = useCallback(() => {
    setShuffledRoster(shuffleArray(originalNames));
  }, [originalNames]);
  // 以上名簿シャッフル

  //何列のするかのセレクトのonClick
  const handleChangeColumns = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setNumColumns(Number(event.target.value));
    // Remove focus from the select element
    if (selectRef.current) {
      selectRef.current?.blur();
    }
  };

  // エンターキーで〇〇クリック時に発火する関数
  const onClickShuffle = () => {
    if (isShowingName) {
      stopNameDisplay();
    } else {
      startNameDisplay();
    }
  };

  // 以下エンターキーでスタート
  const [isShowingName, setIsShowingName] = useState<boolean>(false);
  const intervalId = useRef<number | null>(null);

  const showRandomName = useCallback(() => {
    handleShuffle();
  }, [handleShuffle]);

  const startNameDisplay = useCallback(() => {
    if (!isShowingName) {
      setIsShowingName(true);
      intervalId.current = window.setInterval(showRandomName, 16);
    }
  }, [showRandomName, isShowingName]);

  const stopNameDisplay = useCallback(() => {
    if (isShowingName) {
      setIsShowingName(false);
      if (intervalId.current !== null) {
        clearInterval(intervalId.current);
      }
    }
  }, [isShowingName]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        if (isShowingName) {
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
  }, [startNameDisplay, stopNameDisplay, isShowingName]);

  return (
    <div className="p-6">
      <div className="header flex justify-between ">
        <div className="left">
          <button
            onClick={onClickShuffle}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            {isShowingName
              ? mobileDevice
                ? "ストップ"
                : "Enterキーでストップ"
              : mobileDevice
              ? "スタート"
              : "Enterキーでスタート"}
          </button>
          <select
            ref={selectRef}
            onChange={handleChangeColumns}
            value={numColumns}
            className="ml-4 p-2 rounded"
          >
            <option value={2}>2 人ペア</option>
            <option value={3}>3 人トリオ</option>
            <option value={4}>4 人グループ</option>
            <option value={5}>5 人グループ</option>
            <option value={6}>6 人グループ</option>
          </select>
        </div>
        <div className="right ml-4 p-2">
          <Link
            href="/random_name_app/home"
            className={
              "border border-solid py-2 px-4 rounded-lg border-gray-400  bg-blue-100 dark:text-black hover:bg-blue-700 hover:text-white font-semibold "
            }
          >
            選択画面へ戻る
          </Link>
        </div>
      </div>

      <div className="mt-6 flex">
        <div className={`min-w-max grid grid-cols-1 gap-4`}>
          {(numRows || []).map((name, index) => (
            <div key={index} className="min-w-max bg-gray-200 rounded-lg ">
              <div className="overflow-hidden whitespace-nowrap  text-center text-[min(3.5vw)]">
                {name}
              </div>
            </div>
          ))}
        </div>
        <div className={`ml-4 grid grid-cols-${numColumns} gap-4`}>
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
