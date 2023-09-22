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

  useEffect(() => {
    if (router.isReady) {
      const { id } = router.query;

      if (typeof id === "string") {
        // ローカルストレージから checkboxStates の値を取得
        const checkboxStates = localStorage.getItem("checkboxStates");
        const parsedCheckboxStates = checkboxStates
          ? JSON.parse(checkboxStates)
          : {};

        // 現在の id に関連する isDeleteSpaceChecked の値を取得
        const isDeleteSpaceChecked =
          parsedCheckboxStates[id] &&
          parsedCheckboxStates[id].isDeleteSpaceChecked;
        const cookieValue = Cookies.get(id);
        let decodedNames = cookieValue
          ? JSON.parse(decodeURIComponent(cookieValue))
          : [];

        // isDeleteSpaceChecked が true の場合、文字間のスペースを削除
        if (isDeleteSpaceChecked) {
          decodedNames = decodedNames.map((name: string) =>
            name.replace(/[\s　]/g, "")
          );
        }

        setOriginalNames(decodedNames);
        setRemainingNames(decodedNames);
      }
    }
  }, [router.isReady, router.query]);

  const [isShowingName, setIsShowingName] = useState<boolean>(false);
  const [isAlphabetOrNumber, setIsAlphabetOrNumber] = useState<boolean>(false);
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

    // アルファベット（大文字・小文字）や数字のみで構成されているか判定
    const regex = /^[A-Za-z0-9]+$/;
    // everyメソッドを使用して、すべての要素が条件を満たすかどうかをチェック
    const result = names.every((name) => regex.test(name));
    setIsAlphabetOrNumber(result);
  };

  // 1.リストの中身が英単語のみかどうか判定して、フォントサイズ確定
  const calcFontSize = useCallback(
    (name: string) => {
      if (!name) return; // nameがundefinedの場合、関数を早期に終了する。

      //英単語の場合は、0.95=>1.5に変更
      const scaleFactor = isAlphabetOrNumber ? 1.5 : 0.95;
      const calculatedFontSize = Math.floor(
        (window.innerWidth * scaleFactor) / name.length
      );
      const maxAllowedFontSize = window.innerHeight * 0.95; // ディスプレイの高さの90%を上限とする

      fontSize.current = Math.min(calculatedFontSize, maxAllowedFontSize);

      if (!nameDisplay.current) return;
      nameDisplay.current.style.fontSize = `${fontSize.current}px`;
      nameDisplay.current.style.opacity = "1";
    },
    [isAlphabetOrNumber]
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
      console.log(`shortestName:${ShortestName}`);

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
  //以上、新フォントサイズ計算のdisplayBehindNameDisplayの高さを計算する。

  const showRandomName = useCallback(() => {
    if (!nameDisplay.current) return;
    const randomName =
      remainingNames[Math.floor(Math.random() * remainingNames.length)];

    nameDisplay.current.textContent = randomName;
    calcFontSize(randomName); //　新フォントサイズ計算
    calcShortestFontSize(remainingNames); //新フォントサイズ計算
    isAlphabetNumber(remainingNames); //英単語チェック
  }, [remainingNames, calcShortestFontSize, calcFontSize]);

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

  const stopNameDisplay = useCallback(() => {
    if (isShowingName) {
      if (intervalId.current !== null) {
        clearInterval(intervalId.current);
      }
      setIsShowingName(false);
      setIsTiming(false);
    }
    setTimeout(moveLastName, 100);
  }, [isShowingName, moveLastName]);

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
          className={`displayBehindNameShortestCharacter items-center whitespace-nowrap mt-auto text-center z-10 relative`}
          ref={shortestName}
        ></div>
        <div
          className={`nameDisplay items-center whitespace-nowrap mt-auto text-center z-20  absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2`}
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
