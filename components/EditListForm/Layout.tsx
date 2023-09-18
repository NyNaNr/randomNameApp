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
  //以下詳細設定のチェックボックスの状態管理
  const [isDeleteSpaceChecked, setIsDeleteSpaceChecked] = useState(true);
  const [isNewLineChecked, setIsNewLineChecked] = useState(false);

  //以下詳細設定のローカルストレージ管理
  useEffect(() => {
    loadFromLocalStorage();
  }, [selectedListId]);

  useEffect(() => {
    saveToLocalStorage();
  }, [isDeleteSpaceChecked, isNewLineChecked]);

  const saveToLocalStorage = () => {
    if (!selectedListId) return;
    const currentData = localStorage.getItem("checkboxStates") || "{}";
    const parsedData = JSON.parse(currentData);

    parsedData[selectedListId] = {
      isDeleteSpaceChecked: isDeleteSpaceChecked,
      isNewLineChecked: isNewLineChecked,
    };

    localStorage.setItem("checkboxStates", JSON.stringify(parsedData));
  };

  const loadFromLocalStorage = () => {
    if (!selectedListId) return;
    const currentData = localStorage.getItem("checkboxStates") || "{}";
    const parsedData = JSON.parse(currentData);

    if (parsedData[selectedListId]) {
      setIsDeleteSpaceChecked(
        parsedData[selectedListId].isDeleteSpaceChecked || false
      );
      setIsNewLineChecked(parsedData[selectedListId].isNewLineChecked || false);
    }
  };
  //以上詳細設定のローカルストレージ管理

  //以下詳細設定の開閉を検知する
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
  //以上詳細設定の開閉を検知する

  // 詳細設定を閉じる(黒背景クリック)
  const handleBackgroundClick = () => {
    setIsDetailsOpen(false);
  };

  return (
    <React.Fragment>
      {selectedListId && (
        <div className="relative">
          {/* 詳細設定用、黒背景 */}
          {isDetailsOpen ? (
            <div
              onClick={handleBackgroundClick}
              className="absolute top-0 left-0 z-30 min-h-screen h-full w-full bg-black opacity-40 "
            ></div>
          ) : (
            ""
          )}
          {/* スマホ用、黒背景 */}
          {isOpen ? (
            <div
              onClick={toggleOpen}
              className="absolute top-0 left-0 z-40 min-h-screen h-full w-full bg-black opacity-70 sm:hidden"
            ></div>
          ) : (
            ""
          )}
          <header className="header fixed top-0 w-full z-30 p-1 bg-white shadow-md">
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
          <div
            className={`user-options absolute ${
              lineNumber < 2 ? "top-20" : "top-14"
            } right-0 z-30`}
          >
            <details
              open={isDetailsOpen}
              className={`rounded-lg shadow-md rounded-tl-none rounded-tr-none bg-white px-2 ${
                isDetailsOpen ? "" : "mr-4"
              }`}
            >
              <summary className={`  ${isDetailsOpen ? " animate-flash" : ""}`}>
                詳細設定
              </summary>
              <p>文字間のスペースの扱い</p>
              <fieldset>
                <legend>①文字間のスペースを削除する。</legend>
                <div>
                  <input
                    type="checkbox"
                    id="deleteSpace"
                    name="interest"
                    value="deleteSpace"
                    checked={isDeleteSpaceChecked}
                    onChange={() =>
                      setIsDeleteSpaceChecked(!isDeleteSpaceChecked)
                    }
                  />
                  <label htmlFor="deleteSpace">
                    する。（したほうが少しでも文字が大きく表示できます。）
                  </label>
                </div>
              </fieldset>
              <fieldset>
                <legend
                  className={`${isDeleteSpaceChecked ? "text-gray-400" : ""}`}
                >
                  ②文字間のスペースを改行として表示する。（英単語の複合名詞が複数行で表示されます。）
                </legend>
                <div>
                  <input
                    type="checkbox"
                    id="newLine"
                    name="interest"
                    value="newLine"
                    checked={isNewLineChecked}
                    onChange={() => setIsNewLineChecked(!isNewLineChecked)}
                    disabled={isDeleteSpaceChecked}
                  />
                  <label htmlFor="deleteSpace">する。</label>
                </div>
              </fieldset>
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
