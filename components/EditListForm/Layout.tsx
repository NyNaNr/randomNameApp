import React, { ReactNode } from "react";
import Link from "next/link";

type LayoutProps = {
  selectedListId: string | null;
  totalBytes: number;
  children: ReactNode;
};

const Layout: React.FC<LayoutProps> = ({
  selectedListId,
  totalBytes,
  children,
}) => (
  <React.Fragment>
    {selectedListId && (
      <header className="fixed top-0 w-full z-50 bg-white">
        <div className="">
          <p>保存可能な文字容量: {totalBytes}/4058 bytes</p>
        </div>
        {totalBytes > 4058 ? (
          <div>
            <p>文字数が保存容量を超えています。減らしてください</p>
          </div>
        ) : (
          <div>
            <br />
          </div>
        )}
        <Link
          href={`/random_name_app/${selectedListId}`}
          className="h-15 shadow-lg px-2 py-1 bg-blue-400 text-lg text-white font-semibold rounded hover:bg-blue-500 hover:shadow-sm transform transition duration-500 ease-in-out hover:-translate-y-1"
        >
          スタート
        </Link>
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
