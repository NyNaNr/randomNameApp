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
  //ページ遷移について
  const router = useRouter();
  useEffect(() => {
    if (router.isReady) {
      const { id } = router.query;
      if (typeof id === "string") {
        const cookieValue = Cookies.get(id);
        const decodedNames = cookieValue
          ? JSON.parse(decodeURIComponent(cookieValue))
          : [];
        setOriginalNames(decodedNames);
        setRemainingNames(decodedNames);
      }
    }
  }, [router.isReady, router.query]);

  const [isShowingName, setIsShowingName] = useState<boolean>(false);
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

  const calcFontSize = (list: string[]) => {
    const longestName = list.reduce(
      (longest, name) => (name.length > longest.length ? name : longest),
      ""
    );
    fontSize.current = Math.floor(
      (window.innerWidth * 0.95) / longestName.length
    );
    if (!nameDisplay.current) return;
    nameDisplay.current.style.fontSize = `${fontSize.current}px`;
    nameDisplay.current.style.opacity = `${1}`;
    if (startNotifier.current) {
      startNotifier.current.style.fontSize = `${fontSize.current * 0.2}px`;
    }

    if (stopNotifier.current) {
      stopNotifier.current.style.fontSize = `${fontSize.current * 0.2}px`;
    }
  };

  const showRandomName = useCallback(() => {
    if (!nameDisplay.current) return;
    const randomName =
      remainingNames[Math.floor(Math.random() * remainingNames.length)];
    console.log("-1", randomName);
    nameDisplay.current.textContent = randomName;
    console.log("0", nameDisplay.current.textContent);
    calcFontSize(remainingNames);
  }, [remainingNames]);

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
          <h2 className="underline ">抽選候補リスト</h2>

          <p>{remainingNames.join(" ")}</p>
        </div>
      </div>
      <div className={styles.display}>
        <div className={styles.nameDisplay} ref={nameDisplay}></div>
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
          <h2 className="underline">抽選済みリスト</h2>

          <p>{selectedNameList.join(" ")}</p>
        </div>
      </div>
      <div className="flex justify-between">
        <h2 className="m-5">
          <button
            className={`border border-solid p-3 pl-4 rounded-lg border-gray-400  bg-blue-100 dark:text-black hover:bg-blue-600 hover:text-white font-semibold ${
              selectedNameList.length > 0 ? "" : "cursor-not-allowed"
            }`}
            onClick={clickResetButton}
            ref={resetButtonRef}
          >
            リセット
          </button>
        </h2>

        <h2 className="m-5">
          <Link
            href="/random_name_app/home"
            className={
              "border border-solid p-3 pl-4 rounded-lg border-gray-400  bg-blue-100 dark:text-black hover:bg-blue-600 hover:text-white font-semibold "
            }
          >
            リスト選択画面へ戻る
          </Link>
        </h2>
      </div>
    </Layout>
  );
};

export default RandomNameApp;
