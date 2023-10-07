import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  ReactNode,
  useLayoutEffect,
} from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import styles from "@/styles/random_name_app.module.css";
import Cookies from "js-cookie";
import { isMobile } from "../../../utils/random_name_app";
import Modals from "../../../components/Modals";
import { useLeavePageConfirmation } from "../../../hooks";

// TODO レイアウトが崩れないようにする。人数が何人入力されても表示の上限を決めておく。

type LayoutProps = {
  children: ReactNode;
};

function Layout({ children }: LayoutProps) {
  return <div className={styles.container}>{children}</div>;
}

const RandomNameApp: React.FC = () => {
  //ページ遷移＆ユーザーオプションの反映
  const router = useRouter();
  const [namesWithIds, setNamesWithIds] = useState<
    { id: number; name: string }[]
  >([]);

  useEffect(() => {
    if (router.isReady) {
      const { id } = router.query;

      if (typeof id === "string") {
        // idに関連した値（名簿）を取得＆デコード
        const cookieValue = Cookies.get(id);
        let decodedNames = cookieValue
          ? JSON.parse(decodeURIComponent(cookieValue))
          : [];

        // 取得した名簿に番号を紐づけて、useStateで管理→改行機能追加による、抽選候補リストから消せない問題解消のため
        const namesWithIds = decodedNames.map(
          (name: string, index: number) => ({
            id: index,
            name,
          })
        );
        setNamesWithIds(namesWithIds);

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

        // 現在の id に関連する isNewLineChecked の値を取得
        const isNewLineChecked =
          parsedCheckboxStates[id] && parsedCheckboxStates[id].isNewLineChecked;
        setIsNewLineChecked(isNewLineChecked);

        setOriginalNames(decodedNames);
        setRemainingNames(decodedNames);
      }
    }
  }, [router.isReady, router.query]);

  const [isShowingName, setIsShowingName] = useState<boolean>(false);
  const [isAlphabetOrNumber, setIsAlphabetOrNumber] = useState<boolean>(false);
  const [isNewLineChecked, setIsNewLineChecked] = useState<boolean>(false);

  const intervalId = useRef<number | null>(null);
  const [originalNames, setOriginalNames] = useState<string[]>([]);
  const [remainingNames, setRemainingNames] = useState<string[]>([]);
  const [selectedNameList, setSelectedNameList] = useState<string[]>([]);
  const [lastName, setLastName] = useState<string | null>(null);
  const fontSize = useRef(0); //fontSizeをuseRefで保持;
  const resetButtonRef = React.useRef<HTMLButtonElement | null>(null);

  const nameDisplay = useRef<HTMLDivElement>(null);

  const startNotifier = useRef<HTMLDivElement>(null);
  const stopNotifier = useRef<HTMLDivElement>(null);
  const shortestName = useRef<HTMLDivElement>(null);
  const shortestNameWithLines = useRef<HTMLDivElement>(null);
  const [modalsOpen1, setModalsOpen1] = useState(false);
  const [modalsOpen2, setModalsOpen2] = useState(false);
  const [modalContent1, setModalContent1] = useState("");
  const [modalContent2] = useState("最後の1人になりました。初めからしますか？");
  const [mobileDevice, setMobileDevice] = useState(false);
  const [showLeavingAlert, setShowLeavingAlert] = useState(true);
  const [isTiming, setIsTiming] = useState(true);

  useLeavePageConfirmation(showLeavingAlert);

  useEffect(() => {
    const mobile = isMobile();
    setMobileDevice(mobile !== undefined ? mobile : false);
  }, []);

  // 1.リストの中身が英単語のみかどうか判定
  const isAlphabetNumber = (names: string[]) => {
    if (!names || names.length === 0) return; // リストがundefinedまたは空の場合、関数をfalseで終了する。

    // アルファベット（大文字・小文字）、数字、半角スペース、全角スペースのみで構成されているか判定
    const regex = /^[A-Za-z0-9\s　]+$/;
    // everyメソッドを使用して、すべての要素が条件を満たすかどうかをチェック
    const result = names.every((name) => regex.test(name));
    setIsAlphabetOrNumber(result);
  };

  // 1.リストの中身が英単語のみかどうか判定して、フォントサイズ確定
  const calcFontSize = useCallback(
    (name: string) => {
      if (!name) return; // nameがundefinedの場合、関数を早期に終了する。

      // 文字間の空白で分け、その後各セグメントの最長文字数を取得する。
      const getLongestSegmentLength = (str: string) => {
        const regex = /(?<=\S)([ ]{1,}|\u3000{1,})(?=\S)/g;
        const segments = str.split(regex);
        const lengths = segments.map((segment) => segment.length);
        return Math.max(...lengths);
      };

      let name_length;
      // name.lengthに対してisNewLineCheckedの分岐処理を行う。
      if (isNewLineChecked) {
        name_length = getLongestSegmentLength(name);
        console.log(`name_length ${name_length}`);
      }

      if (!isNewLineChecked) {
        name_length = name.length;
      }

      if (!name_length) return;

      //英単語の場合は、0.95=>1.5に変更
      const scaleFactor = isAlphabetOrNumber ? 1.42 : 0.95;
      console.log(isAlphabetOrNumber);
      const calculatedFontSize = Math.floor(
        (window.innerWidth * scaleFactor) / name_length
      );
      console.log(`calculatedFontSize${calculatedFontSize}`);
      // const maxAllowedFontSize = window.innerHeight * 0.95; // ディスプレイの高さの90%を上限とする

      // fontSize.current = Math.min(calculatedFontSize, maxAllowedFontSize);
      fontSize.current = calculatedFontSize;

      if (!nameDisplay.current) return;
      nameDisplay.current.style.fontSize = `${fontSize.current}px`;
      nameDisplay.current.style.opacity = "1";
    },
    [isAlphabetOrNumber, isNewLineChecked]
  );

  //以下、新フォントサイズ計算のdisplayBehindNameDisplayの高さを計算する。
  //1.最も短い文字数を取得
  const calcShortestFontSize = useCallback(
    (list: string[]) => {
      if (list.length === 0) return; // リストが空の場合のエラーハンドリング

      const ShortestName = list.reduce(
        (shortest, name) => (name.length < shortest.length ? name : shortest),
        list[0]
      );
      console.log(shortestName);

      const maxAllowedFontSize = window.innerHeight * 0.95; // ディスプレイの高さの90%を上限とする
      //英単語の場合は、0.65=>0.87に変更
      const scaleFactor = isAlphabetOrNumber ? 0.87 : 0.65;
      const calculatedFontSize = Math.floor(
        (window.innerWidth * scaleFactor) / ShortestName.length
      );

      const notifierFontSize = window.innerWidth * 0.025;

      fontSize.current = Math.min(calculatedFontSize, maxAllowedFontSize);

      if (!shortestName.current) return;
      shortestName.current.textContent = ShortestName;
      shortestName.current.style.fontSize = `${fontSize.current}px`;
      shortestName.current.style.opacity = `${0}`;

      if (startNotifier.current) {
        startNotifier.current.style.fontSize = `${notifierFontSize}px`;
      }

      if (stopNotifier.current) {
        stopNotifier.current.style.fontSize = `${notifierFontSize}px`;
      }
    },
    [isAlphabetOrNumber]
  );
  // 2.isNewLineChecked がtrueの場合に、行数が最長且つ、セグメントの最長文字数が最も少ない物を選ぶ
  const calcShortestFontSizeWithLines = useCallback((namesList: string[]) => {
    // スペースによる分割とその数のカウント
    const countSpaces = (name: string) => {
      const spaces = name.match(/(?<=\S)([ ]{1,}|\u3000{1,})(?=\S)/g);
      return spaces ? spaces.length : 0;
    };

    // スペースで名前を分割し、最も短いセグメントの長さを返す
    const shortestSegmentLength = (name: string) => {
      const segments = name.split(/\s|　/); // 半角スペースまたは全角スペースで分割
      return Math.min(...segments.map((segment) => segment.length));
    };

    // 行数が最長のものを見つける
    let maxSpaces = -1;
    let shortestWordLength = Infinity;
    let selectedName = "";

    for (let name of namesList) {
      const currentSpaces = countSpaces(name);
      if (currentSpaces > maxSpaces) {
        maxSpaces = currentSpaces;
        shortestWordLength = shortestSegmentLength(name);
        selectedName = name;
      } else if (currentSpaces === maxSpaces) {
        const currentShortestWordLength = shortestSegmentLength(name);
        if (currentShortestWordLength < shortestWordLength) {
          shortestWordLength = currentShortestWordLength;
          selectedName = name;
        }
      }
    }

    // 下のリターンを削除して、useRefでshortestNameWithLinesに埋め込む。フォントサイズはどうする？
    if (!shortestNameWithLines.current) return;
    shortestNameWithLines.current.textContent = selectedName;
    shortestNameWithLines.current.style.fontSize = `${fontSize.current}px`;
    shortestNameWithLines.current.style.opacity = `${0}`;

    return selectedName;
  }, []);
  //以上、新フォントサイズ計算のdisplayBehindNameDisplayの高さを計算する。

  const showRandomName = useCallback(() => {
    if (!nameDisplay.current) return;

    const randomName =
      remainingNames[Math.floor(Math.random() * remainingNames.length)];

    // isNewLineChecked が true の場合、スペースを <br> に置き換える
    if (isNewLineChecked) {
      const formattedName = randomName.replace(
        /(?<=\S)([ ]{1,}|\u3000{1,})(?=\S)/g,
        "<br>"
      );
      nameDisplay.current.innerHTML = formattedName; // 改行を表示するためにinnerHTMLを使用
    } else {
      nameDisplay.current.textContent = randomName;
    }

    // calcFontSize内での計算を避けるため事前に文字数を計算しておく。

    calcFontSize(randomName);
    calcShortestFontSize(remainingNames);
    isAlphabetNumber(remainingNames);
    console.log(
      `calcwithline:${calcShortestFontSizeWithLines(remainingNames)}`
    );
  }, [
    remainingNames,
    calcShortestFontSize,
    calcFontSize,
    calcShortestFontSizeWithLines,
    isNewLineChecked,
  ]);

  const clickResetButton = () => {
    const message = "はじめからにしますか？";
    if (selectedNameList.length > 0) {
      const shouldReload = confirm(message);
      if (shouldReload) {
        setRemainingNames(originalNames);
        setSelectedNameList([]);
        if (intervalId.current !== null) {
          clearInterval(intervalId.current);
        }
        setIsShowingName(false);
      }
      // フォーカスを外す
      if (resetButtonRef.current) {
        resetButtonRef.current.blur();
      }
    }
  };

  const startNameDisplay = useCallback(() => {
    if (!isShowingName) {
      setIsShowingName(true);
      intervalId.current = window.setInterval(showRandomName, 16);
    }

    if (remainingNames.length === 1) {
      if (isMobile()) {
        setModalsOpen2(true);
      } else {
        const message = "最後の1人になりました。はじめからにしますか？";
        const shouldReload = confirm(message);
        if (shouldReload) {
          setRemainingNames(originalNames);
          setSelectedNameList([]);
          if (intervalId.current !== null) {
            clearInterval(intervalId.current);
          }
          setIsShowingName(false);
        }
      }
    }
  }, [showRandomName, remainingNames.length, isShowingName, originalNames]);

  const forModalsConfirmRestart = () => {
    setRemainingNames(originalNames);
    setSelectedNameList([]);
    if (intervalId.current !== null) {
      clearInterval(intervalId.current);
    }
    setIsShowingName(false);
  };

  //名前の削除 isNewLine Falseの時
  const moveLastName = useCallback(() => {
    if (!nameDisplay.current) return;

    console.log("1", nameDisplay.current.textContent);
    const lastName = nameDisplay.current.textContent;
    console.log("2", lastName);
    setLastName(lastName);

    if (isMobile()) {
      lastName && setModalsOpen1(true);
    } else {
      const shouldRemove = confirm(
        `${lastName}を抽選済みリストに移動しますか？`
      );
      if (shouldRemove && lastName) {
        setSelectedNameList([...selectedNameList, lastName]);
        setRemainingNames(remainingNames.filter((name) => name !== lastName));
      }
      setIsTiming(true);
    }
  }, [remainingNames, selectedNameList]);

  //isNewLineChecked がtrueの場合
  const moveLastName_newLine = useCallback(() => {
    if (!nameDisplay.current) return;
    let sharedVariable: string | undefined;

    // 検索する名前から改行や空白を削除
    const nameToSearch = nameDisplay.current.textContent;
    if (!nameToSearch) return;
    const cleanedNameToSearch = nameToSearch.replace(/[\s\n　]/g, "");
    console.log(`cleanedNameToSearch ${cleanedNameToSearch}`);

    // namesWithIdsリストから名前を検索
    console.log(namesWithIds);
    const found = namesWithIds.find(({ name }) => {
      const cleanedName = name.replace(/[\s\n　]/g, "");

      return cleanedName === cleanedNameToSearch;
    });
    console.log(`found ${found?.id}`);
    console.log(`found ${found?.name}`);
    //取得した番号を元にnamesWithIdsから名前と番号を取得
    if (found) {
      const { name: extractedName, id } = found; // foundから名前と番号を取得
      console.log("Extracted Name:", extractedName);

      sharedVariable = extractedName;
      console.log("Found ID:", id);
      setLastName(sharedVariable);
    }

    if (isMobile()) {
      sharedVariable && setModalsOpen1(true);
    } else {
      const shouldRemove = confirm(
        `${sharedVariable}を抽選済みリストに移動しますか？`
      );
      if (shouldRemove && sharedVariable) {
        setSelectedNameList([...selectedNameList, sharedVariable]);
        setRemainingNames(
          remainingNames.filter((name) => name !== sharedVariable)
        );
      }
      setIsTiming(true);
    }
  }, [remainingNames, selectedNameList, namesWithIds]);

  const stopNameDisplay = useCallback(() => {
    if (isShowingName) {
      if (intervalId.current !== null) {
        clearInterval(intervalId.current);
      }
      setIsShowingName(false);
      setIsTiming(false);
    }

    if (isNewLineChecked) {
      setTimeout(moveLastName_newLine, 100);
    }

    if (!isNewLineChecked) {
      setTimeout(moveLastName, 100);
    } //削除される名前と削除されるべき名前を一致させるために処理を0.1秒遅らせる。
  }, [isShowingName, isNewLineChecked, moveLastName, moveLastName_newLine]);

  const forModalsDeleteLastName = () => {
    if (lastName) {
      setSelectedNameList([...selectedNameList, lastName]);
      setRemainingNames(remainingNames.filter((name) => name !== lastName));
    }
    setIsTiming(true);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter" && !modalsOpen1 && !modalsOpen2) {
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
  }, [
    startNameDisplay,
    stopNameDisplay,
    isShowingName,
    modalsOpen1,
    modalsOpen2,
  ]);
  //モーダル
  useEffect(() => {
    if (lastName) {
      setModalContent1(`{${lastName}}を抽選済みリストに移動しますか？`);
    }
  }, [lastName]);

  useLayoutEffect(() => {
    showRandomName();
  }, [remainingNames, showRandomName, isShowingName]); //isShowingName追加で、リストに追加しなかったときも「エンターキーでスタート」のフォントサイズが計算される

  return (
    <Layout>
      <Head>
        <title>とにかく大きい ランダムネーム アプリ</title>
      </Head>

      <Modals
        open={modalsOpen1}
        setOpen={setModalsOpen1}
        title={"確認"}
        content={modalContent1}
        onClick={forModalsDeleteLastName}
      />
      <Modals
        open={modalsOpen2}
        setOpen={setModalsOpen2}
        title={"確認"}
        content={modalContent2}
        onClick={forModalsConfirmRestart}
      />

      <div className={styles.lists}>
        <div className={styles.cleanedNames}>
          {/* 未選択の名前を表示 */}
          <details open>
            <summary className="underline ">
              抽選候補リスト(折りたためます)
            </summary>

            <p>{remainingNames.join(" ")}</p>
          </details>
        </div>
      </div>
      <div
        className={`displayBehindNameDisplay relative border border-gray-400 rounded-lg m-4`}
      >
        <div
          className={`displayBehindNameShortestCharacter items-center whitespace-nowrap mt-auto text-center z-10 relative leading-none`}
          ref={shortestName}
        ></div>
        <div
          className={`shortestNameWithLines items-center whitespace-nowrap mt-auto text-center z-10 relative leading-none`}
          ref={shortestNameWithLines}
        ></div>
        <div
          className={`nameDisplay items-center whitespace-nowrap mt-auto text-center z-20  absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 leading-none align-top`}
          ref={nameDisplay}
        ></div>
        <div
          className="overlay absolute top-0 left-0 w-full h-full opacity-0"
          onClick={isShowingName ? stopNameDisplay : startNameDisplay}
        ></div>
        {!isShowingName && !modalsOpen1 && isTiming ? (
          <div
            className={styles.startNotifier}
            ref={startNotifier}
            onClick={startNameDisplay}
          >
            {isMobile() ? "タッチでスタート!!" : "Enterキーでスタート!!"}
          </div>
        ) : (
          ""
        )}
      </div>
      <div className="underDisplay relative mb-5">
        {isShowingName ? (
          <div
            className={styles.stopNotifier}
            ref={stopNotifier}
            onClick={stopNameDisplay}
          >
            {isMobile() ? "タッチでストップ!!" : "Enterキーでストップ!!"}
          </div>
        ) : (
          ""
        )}
      </div>

      <div className={styles.lists}>
        <div className={styles.removedNames}>
          {/* 選択済みの名前を表示 */}
          <details open>
            <summary className="underline">抽選済みリスト</summary>

            <p>{selectedNameList.join(" ")}</p>
          </details>
        </div>
      </div>
      <div className="flex justify-between">
        <div className="m-4">
          <button
            className={`border border-solid p-3 rounded-lg border-gray-400  bg-blue-100 dark:text-black hover:bg-blue-600 hover:text-white font-semibold ${
              selectedNameList.length > 0 ? "" : "cursor-not-allowed"
            }`}
            onClick={clickResetButton}
            ref={resetButtonRef}
          >
            リセット
          </button>
        </div>

        <div className="m-4 mt-7 ">
          <Link
            href="/random_name_app/home"
            className={
              "border border-solid p-3 rounded-lg border-gray-400  bg-blue-100 dark:text-black hover:bg-blue-600 hover:text-white font-semibold "
            }
          >
            リスト選択画面へ戻る
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default RandomNameApp;
