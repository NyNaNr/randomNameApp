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
import { isMobile } from "../../utils/random_name_app";

// TODO レイアウトが崩れないようにする。人数が何人入力されても表示の上限を決めておく。

type LayoutProps = {
  children: ReactNode;
};

function Layout({ children }: LayoutProps) {
  return <div className={styles.container}>{children}</div>;
}

const RandomNameApp: React.FC = () => {
  const [NAMES, setNAMES] = useState<string[]>([]);
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
        setNAMES(decodedNames);
        setRemainingNames(decodedNames);
      }
    }
  }, [router.isReady, router.query]);

  const [isShowingName, setIsShowingName] = useState<boolean>(false);
  const intervalId = useRef<number | null>(null);
  const [remainingNames, setRemainingNames] = useState<string[]>(NAMES);
  const [selectedNameList, setSelectedNameList] = useState<string[]>([]);

  const nameDisplay = useRef<HTMLDivElement>(null);
  const startNotifier = useRef<HTMLDivElement>(null);
  const stopNotifier = useRef<HTMLDivElement>(null);

  const fontSize = useRef(0); //fontSizeをuseRefで保持;

  const calcFontSize = (list: string[]) => {
    const longestName = list.reduce(
      (longest, name) => (name.length > longest.length ? name : longest),
      ""
    );
    fontSize.current = Math.floor(
      (window.innerWidth * 0.9) / longestName.length
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
    nameDisplay.current.textContent = randomName;
    calcFontSize(remainingNames);
  }, [remainingNames]);

  const startNameDisplay = useCallback(() => {
    if (!isShowingName) {
      setIsShowingName(true);
      intervalId.current = window.setInterval(showRandomName, 16);
    }

    if (remainingNames.length === 1) {
      const message = "最後の一人になりました。はじめからにしますか？";
      const shouldReload = confirm(message);
      if (shouldReload) {
        window.location.reload();
      }
    }
  }, [showRandomName, remainingNames.length, isShowingName]);

  const stopNameDisplay = useCallback(() => {
    if (isShowingName) {
      if (intervalId.current !== null) {
        clearInterval(intervalId.current);
      }
      setIsShowingName(false);
    }

    if (!nameDisplay.current) return;

    const lastName = nameDisplay.current.textContent;
    const shouldRemove = confirm(`${lastName}を選択済みリストに移動しますか？`);

    if (shouldRemove && lastName) {
      setSelectedNameList([...selectedNameList, lastName]);
      setRemainingNames(remainingNames.filter((name) => name !== lastName));
    }
  }, [remainingNames, selectedNameList, isShowingName]);

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

  useLayoutEffect(() => {
    calcFontSize(remainingNames);
    showRandomName();
    if (nameDisplay.current !== null) {
      nameDisplay.current.style.opacity = `${0}`;
    }
  }, [remainingNames, showRandomName]);

  return (
    <Layout>
      <Head>
        <title>とにかく大きい ランダムネーム アプリ</title>
      </Head>

      <div className={styles.lists}>
        <div className={styles.cleanedNames}>
          {/* 未選択の名前を表示 */}
          <h2>未選択リスト</h2>

          <p>{remainingNames.join(" ")}</p>
        </div>
      </div>
      <div className={styles.display}>
        <div className={styles.nameDisplay} ref={nameDisplay}></div>
        {!isShowingName ? (
          <div
            className={styles.startNotifier}
            ref={startNotifier}
            onClick={startNameDisplay}
          >
            {isMobile() ? "ここをタッチでスタート!!" : "Enterキーでスタート!!"}
          </div>
        ) : (
          ""
        )}
      </div>
      <div className="underDisplay relative">
        {isShowingName ? (
          <div
            className={styles.stopNotifier}
            ref={stopNotifier}
            onClick={stopNameDisplay}
          >
            {isMobile() ? "ここをタッチでストップ!!" : "Enterキーでストップ!!"}
          </div>
        ) : (
          ""
        )}
      </div>

      <div className={styles.lists}>
        <div className={styles.removedNames}>
          {/* 選択済みの名前を表示 */}
          <h2>選択済みリスト</h2>

          <p>{selectedNameList.join(" ")}</p>
        </div>
      </div>

      <h2>
        <Link href="/random_name_app/home">← Back to home</Link>
      </h2>
    </Layout>
  );
};

export default RandomNameApp;
