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
  return (
    <div className="flex items-center mb-8 justify-end divide-x divide-slate-400 ">
      <p className="px-4 max-sm:hidden">sort by:</p>
      <div className=" px-4 cursor-pointer transition-class outline-none appearance-none relative min-w-32 group">
        <p className="">
          {selectedSortTerm == "last_played"
            ? "date"
            : selectedSortTerm == "session_count"
            ? "sessions"
            : selectedSortTerm == "boardgamename"
            ? "board game"
            : selectedSortTerm}
        </p>

        <div className="absolute w-full z-20 left-0 pt-2 opacity-0 group-hover:opacity-100 -translate-y-2 group-hover:translate-y-0 pointer-events-none group-hover:pointer-events-auto transition-class">
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
