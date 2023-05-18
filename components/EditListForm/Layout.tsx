import React, { ReactNode } from "react";
import Link from "next/link";

type LayoutProps = {
  title: string | null;
  selectedListId: string | null;
  totalBytes: number;
  children: ReactNode;
};

const Layout: React.FC<LayoutProps> = ({
  title,
  selectedListId,
  totalBytes,
  children,
}) => (
  <React.Fragment>
    {selectedListId && (
      <header className="fixed top-0 w-full z-50 bg-white">
        <h1 className="items-center">{title}</h1>
        <div className="items-center">
          <p>合計バイト数: {totalBytes}/4096</p>
        </div>
        <Link
          href={`/random_name_app/${selectedListId}`}
          className="h-15 shadow-lg px-2 py-1 bg-blue-400 text-lg text-white font-semibold rounded hover:bg-blue-500 hover:shadow-sm transform transition duration-500 ease-in-out hover:-translate-y-1"
        >
          スタート
        </Link>
      </header>
    )}
    {selectedListId ? (
      <div className="mt-24">{children}</div>
    ) : (
      <div className="">{children}</div>
    )}
  </React.Fragment>
);

export default Layout;
