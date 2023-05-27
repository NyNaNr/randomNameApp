import { ArrowBarLeft, ArrowBarRight } from "tabler-icons-react";

interface Props {
  onClick: any;
}

export const CloseSidebarButton = ({ onClick }: Props) => {
  return (
    <>
      <button
        className={`fixed top-20 left-[270px]
        z-50 h-7 w-7 hover:text-gray-400 text-white dark:text-white dark:hover:text-gray-300 sm:top-20 sm:left-[270px] sm:h-8 sm:w-8 sm:text-neutral-700`}
        onClick={onClick}
      >
        <ArrowBarLeft />
      </button>
    </>
  );
};

export const OpenSidebarButton = ({ onClick }: Props) => {
  return (
    <button
      className={`fixed top-20 left-2
       z-50 h-7 w-7 text-black hover:text-gray-400 dark:text-white dark:hover:text-gray-300 sm:top-20 sm:left-2
       sm:h-8 sm:w-8 sm:text-neutral-700`}
      onClick={onClick}
    >
      <ArrowBarRight />
    </button>
  );
};
