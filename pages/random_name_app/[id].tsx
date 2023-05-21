import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  ReactNode,
} from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import styles from "@/styles/random_name_app.module.css";
import Cookies from "js-cookie";

// TODO エンターキー待ちの時間に「Enterキーでストップ！」と表示する。1地番最初から出す。エンターキー押下後すぐに削除
// TODO レイアウトが崩れないようにする。人数が何人入力されても表示の上限を決めておく。
// TODO 内容理解＆整理

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
    console.log(isShowingName);
    if (startNotifier.current) {
      startNotifier.current.textContent = ""; // メッセージを非表示にする
    }

    //ここにユーザーにエンターキーでスタートを知らせる関数を作成
    if (stopNotifier.current) {
      stopNotifier.current.style.fontSize = `${fontSize.current * 0.2}px`;
      stopNotifier.current.textContent = "Enterキーでストップ！";
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
    console.log(isShowingName);

    if (stopNotifier.current) {
      stopNotifier.current.textContent = ""; // メッセージを非表示にする
    }

    if (!nameDisplay.current) return;

    const lastName = nameDisplay.current.textContent;
    const shouldRemove = confirm(`${lastName}を選択済みリストに移動しますか？`);

    if (shouldRemove && lastName) {
      setSelectedNameList([...selectedNameList, lastName]);
      setRemainingNames(remainingNames.filter((name) => name !== lastName));
    }
    //ここにユーザーにエンターキーでスタートを知らせる関数を作成
    if (startNotifier.current) {
      startNotifier.current.style.fontSize = `${fontSize.current * 0.2}px`;
      startNotifier.current.textContent = "Enterキーでスタート！";
    }
  }, [remainingNames, selectedNameList, isShowingName]);

  //useEffectでコンポーネントマウント時に設定する
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
          <div className="startNotifier animate-flash absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 text-[rgb(42,95,141)] bg-white text-6xl">
            Enterキーでスタート！
          </div>
        ) : (
          ""
        )}
      </div>
      <div className="underDisplay">
        {isShowingName ? (
          <div className="startNotifier animate-flash absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/3 z-10 text-[rgb(42,95,141)] bg-white text-6xl">
            Enterキーでストップ！
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
