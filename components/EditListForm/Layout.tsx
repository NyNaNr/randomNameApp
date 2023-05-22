import React, { ReactNode } from "react";
import Link from "next/link";

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
}) => (
  <React.Fragment>
    {selectedListId && (
      <header className="header fixed top-0 w-full z-40 bg-white">
        {isOpen ? (
          <div
            onClick={toggleOpen}
            className="absolute top-0 left-0 z-10 h-full w-full bg-black opacity-70 sm:hidden"
          ></div>
        ) : (
          ""
        )}
        <div className="text-black">
          <p>保存可能な文字容量: {totalBytes}/4058 bytes</p>
        </div>
        {totalBytes > 4058 ? (
          <div className="text-black animate-flash">
            <p>文字数が保存容量を超えています。減らしてください。</p>
          </div>
        ) : (
          <div>
            <br />
          </div>
        )}
        <div className="text-black">合計 : {lineNumber}人</div>
        {lineNumber < 2 ? (
          <div className="text-black animate-flash">
            <p>2人以上入力してください</p>
          </div>
        ) : (
          <div>
            <br />
          </div>
        )}

        <div className="start-links relative">
          {totalBytes > 4058 || lineNumber < 2 ? (
            <div className="link-blocker absolute h-15 px-2 py-1 text-lg text-white font-semibold rounded z-20 cursor-not-allowed">
              スタート
            </div>
          ) : null}

          <Link
            href={`/random_name_app/id/${selectedListId}`}
            className={`absolute h-15 z-10 shadow-lg px-2 py-1 bg-blue-400 text-lg text-white font-semibold rounded  hover:shadow-sm  ${
              totalBytes > 4058 || lineNumber < 2
                ? " bg-gray-500/50"
                : "hover:bg-blue-500"
            }`}
          >
            スタート
          </Link>
        </div>
      </header>
    )}
    {selectedListId ? (
      <div className="mt-24 flex-grow">{children}</div>
    ) : (
      <div className="">{children}</div>
    )}
  </React.Fragment>
);

export default Layout;
