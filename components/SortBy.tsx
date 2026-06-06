import { useState, useRef, useEffect } from "react";

const SortBy = ({
  selectedSortTerm,
  sortDescendingValue,
  sortTerms,
  setSortTerm,
  setSortDescending,
}: {
  selectedSortTerm: string;
  sortDescendingValue: boolean;
  sortTerms: string[];
  setSortTerm: (value: string) => void;
  setSortDescending: (value: boolean) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", handleClickOutside);

    return () => {
      document.removeEventListener("pointerdown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex items-center justify-end divide-x divide-slate-500 border border-slate-500 rounded-sm p-1">
      <p className="px-4 max-lg:hidden">sort by:</p>
      <div
        className=" px-4 cursor-pointer transition-class outline-none appearance-none relative min-w-32 group"
        onClick={() => setIsOpen((prev) => !prev)}
        ref={dropdownRef}
      >
        <p className="">
          <span className="text-xs lg:hidden pr-3">
            {" "}
            <i className="fa-solid fa-sort  "></i>{" "}
          </span>
          {selectedSortTerm == "last_played"
            ? "date"
            : selectedSortTerm == "session_count"
              ? "sessions"
              : selectedSortTerm == "boardgamename"
                ? "board game"
                : selectedSortTerm}
        </p>

        <div
          className={`absolute w-full z-20 left-0 pt-2 transition-class
            ${
              isOpen
                ? "opacity-100 translate-y-0 pointer-events-auto"
                : "opacity-0 -translate-y-2 pointer-events-none"
            }
            group-hover:opacity-100
            group-hover:translate-y-0
            group-hover:pointer-events-auto`}
        >
          <div className="flex flex-col bg-foreground text-background *:py-1 *:px-2  *:hover:bg-background/10 ">
            {sortTerms.map((term, i) => (
              <p
                key={`sort-option-${i}`}
                onClick={(e) => setSortTerm(term)}
                className="transition-class"
              >
                {term == "session_count"
                  ? "sessions"
                  : term == "last_played"
                    ? "date"
                    : term == "boardgamename"
                      ? "board game"
                      : term}
              </p>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={() => setSortDescending(!sortDescendingValue)}
        className=" text-sm px-4 cursor-pointer transition-class hover:text-accent"
        aria-label={`Sort ${sortDescendingValue ? "ascending" : "descending"}`}
      >
        <i
          aria-hidden
          className={`fa-solid fa-arrow-up transition-class ${
            sortDescendingValue && "rotate-180"
          }`}
        ></i>
      </button>
    </div>
  );
};

export default SortBy;
