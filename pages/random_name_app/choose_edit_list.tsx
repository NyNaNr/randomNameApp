import { Chatbar } from "@/components/Chatbar/Chatbar";

export default function Home() {
  return (
    <div className="flex h-screen">
      <div className="fixed top-0 left-0 z-40 flex h-screen w-[260px] flex-none flex-col space-y-2 bg-[#202123] p-2 text-[14px] transition-all sm:relative sm:top-0 ">
        <div className="flex items-center">
          <button className="text-sidebar flex w-[240px] flex-shrink-0 cursor-pointer select-none items-center gap-3 rounded-md border border-white/20 p-3 text-white transition-colors duration-200 hover:bg-gray-500/10 ">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              className="tabler-icon tabler-icon-plus"
            >
              <path d="M12 5l0 14"></path>
              <path d="M5 12l14 0"></path>
            </svg>
            新規リスト
          </button>
        </div>

        <div className="flex-grow overflow-auto">
          <div className="mt-8 select-none text-center text-white opacity-50">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              className="mx-auto mb-3"
            >
              <path d="M12 5h9"></path>
              <path d="M3 10h7"></path>
              <path d="M18 10h1"></path>
              <path d="M5 15h5"></path>
              <path d="M14 15h1m4 0h2"></path>
              <path d="M3 20h9m4 0h3"></path>
              <path d="M3 3l18 18"></path>
            </svg>
            <span className="text-[14px] leading-normal">No data.</span>
          </div>
        </div>
      </div>
      <div className="flex-grow">
        <div className="edit_list"></div>
      </div>
    </div>
  );
}
