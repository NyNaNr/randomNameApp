import React, {
  ChangeEvent,
  MouseEvent,
  KeyboardEvent,
  useRef,
  useState,
} from "react";

export default function EditInPlace() {
  const [origListName, setOrigListName] = useState("New List");
  const [newListName, setNewListName] = useState(origListName);
  const [isEditing, setIsEditing] = useState(false);
  const textInputRef = useRef<HTMLInputElement>(null);

  const edit = () => {
    setIsEditing(true);
  };

  const focus = () => {
    const textInput = textInputRef.current;
    if (textInput) {
      textInput.focus();
    }
  };

  //ここでcookieに保存の処理を追加？　名前を変更したとき、新規作成したとき、捨てた時に保存する必要がある
  const save = () => {
    if (newListName !== "") {
      setOrigListName(newListName);
      setIsEditing(false);
    } else {
    }
  };

  const cancel = () => {
    setNewListName(origListName);
    setIsEditing(false);
  };

  return (
    <main className="mx-auto max-w-4xl bg-gray-200 h-screen">
      <nav className="p-4 bg-indigo-700 text-indigo-100">
        <div>Edit in place</div>
        <div className="text-xs text-indigo-400 font-thin">
          Next.js + TailwindCSS + TypeScript
        </div>
      </nav>
      <section className="flex flex-wrap p-4">
        <div
          onClick={() => {
            if (!isEditing) {
              edit();
              setTimeout(() => focus());
            }
          }}
        >
          {!isEditing && (
            <div className="p-2 border border-gray-200 inline-flex items-center">
              <div className="p-1 border outline-none bg-transparent inline-flex items-center py-0 lh-[1] leading-[1]">
                {/*ここが表示される */}
                <span>{newListName}</span>
              </div>
            </div>
          )}
          {isEditing && (
            <div
              className="flex flex-col"
              onClick={(event: MouseEvent<HTMLDivElement>) =>
                event.stopPropagation()
              }
            >
              <div className="flex mb-4">
                <input
                  ref={textInputRef}
                  type="text"
                  className="p-1 pl-3 border outline-none bg-transparent inline-flex items-center py-0 lh-[1] leading-[1]"
                  value={newListName}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setNewListName(e.target.value)
                  }
                  onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
                    if (e.key === "Enter") save();
                    if (e.key === "Escape") cancel();
                  }}
                />
                {/*saveicon */}
                <button
                  type="button"
                  className="p-2 ml-2"
                  title="Save"
                  onClick={(e: MouseEvent<HTMLButtonElement>) => save()}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    className="tabler-icon tabler-icon-check"
                  >
                    <path d="M5 12l5 5l10 -10"></path>
                  </svg>
                </button>
                {/*CancelIcon */}
                <button
                  type="button"
                  className="p-2 ml-2"
                  title="Cancel"
                  onClick={(e: MouseEvent<HTMLButtonElement>) => cancel()}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    className="tabler-icon tabler-icon-x"
                  >
                    <path d="M18 6l-12 12"></path> <path d="M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
