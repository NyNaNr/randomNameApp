import React, { ReactNode } from "react";
import Link from "next/link";
import { useState, useEffect } from "react";
type LayoutProps = {
  selectedListId: string | null;
  totalBytes: number;
  children: ReactNode;
  lineNumber: number;
  isOpen: boolean;
  toggleOpen: () => void;
};

const Layout: React.FC<LayoutProps> = ({
  selectedListId,
  totalBytes,
  children,
  lineNumber,
  isOpen,
  toggleOpen,
}) => {
  //以下ユーザーオプションの開閉を検知する
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  useEffect(() => {
    const detailsElem = document.querySelector("details");

    const handleToggle = () => {
      setIsDetailsOpen(detailsElem?.open ?? false);
    };

    detailsElem?.addEventListener("toggle", handleToggle);

    return () => {
      detailsElem?.removeEventListener("toggle", handleToggle);
    };
  }, []);
  //以上ユーザーオプションの開閉を検知する

  return (
    <React.Fragment>
      {selectedListId && (
        <div className="relative">
          <header className="header fixed top-0 w-full z-10 p-1 bg-white shadow-md">
            {isOpen ? (
              <div
                onClick={toggleOpen}
                className="absolute top-0 left-0 z-10 min-h-screen h-full w-full bg-black opacity-70 sm:hidden"
              ></div>
            ) : (
              ""
            )}
            <div className="container">
              <div className="text-black">
                <p>保存可能な文字容量: {totalBytes}/4058 bytes</p>
              </div>
              {totalBytes > 4058 ? (
                <div className="text-black animate-flash">
                  <p>文字数が保存容量を超えています。減らしてください。</p>
                </div>
              ) : (
                <div></div>
              )}
              <div className="text-black">合計 : {lineNumber}人</div>
              {lineNumber < 2 ? (
                <div className="text-black animate-flash">
                  <p>2人以上入力してください</p>
                </div>
              ) : (
                <div></div>
              )}

              <div className="fixed start-links z-5 flex top-2 right-0 w-24">
                {totalBytes > 4058 || lineNumber < 2 ? (
                  <div className="link-blocker absolute h-15 px-2 py-1 text-lg text-white font-semibold rounded z-20 cursor-not-allowed">
                    スタート
                  </div>
                ) : null}

                <Link
                  href={`/random_name_app/id/${selectedListId}`}
                  className={`absolute h-15 z-10 shadow-lg px-2 py-1 bg-blue-400 text-lg text-white font-semibold rounded hover:shadow-sm  ${
                    totalBytes > 4058 || lineNumber < 2
                      ? " bg-gray-500/50"
                      : "hover:bg-blue-500"
                  }`}
                >
                  スタート
                </Link>
              </div>
            </div>
          </header>
          <div className="user-options absolute top-14 right-0 z-20">
            <details
              className={`rounded-lg shadow-md rounded-tl-none rounded-tr-none bg-white z-20 px-2 ${
                isDetailsOpen ? "" : "mr-4"
              }`}
            >
              <summary className="">詳細設定</summary>
              <p>
                了解しました。ヘッダー内にその要素を入れずに、ヘッダーのすぐ右下に表示させる場合、ヘッダーとその要素が含まれる親要素（コンテナ）をrelativeで配置し、user-optionsをその親要素に対して絶対配置する方法が考えられます。
                以下の手順でそれを実現できます。
                ヘッダーとuser-optionsの両方を含む親要素（コンテナ）を作成し、そのコンテナにrelativeクラスを追加します。
                user-optionsをコンテナの中に配置し、absoluteクラスを使用してコンテナの右下に配置します。
                コードとしては以下のようになります：
              </p>
            </details>
          </div>
        </div>
      )}
      {selectedListId ? (
        <div className="mt-24 flex-grow">{children}</div>
      ) : (
        <div className="">{children}</div>
      )}
    </React.Fragment>
  );
};

export default Layout;
