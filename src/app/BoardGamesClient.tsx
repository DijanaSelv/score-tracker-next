"use client";
import { useMemo, useState } from "react";
import { useGlobalData } from "@/app/context/GlobalDataContext";
import { formatDate } from "@/../lib/utils";

export default function BoardGamesList() {
  const [sortTerm, setSortTerm] = useState<
    "name" | "last_played" | "session_count"
  >("name");

  const { boardGames } = useGlobalData();

  const [sortDescending, setsortDescending] = useState<boolean>(true);

  const sortedGames = useMemo(() => {
    const sorted = [...boardGames].sort((a, b) => {
      if (sortTerm === "name") {
        return b.name.localeCompare(a.name);
      } else if (sortTerm === "last_played") {
        return (
          new Date(a.last_played).getTime() - new Date(b.last_played).getTime()
        );
      } else {
        return a.session_count - b.session_count;
      }
    });

    return sortDescending ? sorted : sorted.reverse();
  }, [sortTerm, boardGames, sortDescending]);

  console.log(sortedGames, "sorted games");
  return (
    <section>
      <div className="flex items-center mb-8 justify-end divide-x divide-slate-400 ">
        <p className="px-4 max-sm:hidden">sort by:</p>
        <div className=" px-4 cursor-pointer transition-class outline-none appearance-none relative min-w-28 group">
          <p className="">
            {sortTerm == "last_played"
              ? "date"
              : sortTerm == "session_count"
              ? "sessions"
              : sortTerm}
          </p>

          <div className="absolute w-full  z-20 left-0 pt-2 opacity-0 group-hover:opacity-100 -translate-y-2 group-hover:translate-y-0 pointer-events-none group-hover:pointer-events-auto transition-class">
            <div className="flex flex-col bg-foreground text-background *:py-1 *:px-2  *:hover:bg-background/10 ">
              <p
                onClick={(e) => setSortTerm("name")}
                className="transition-class"
              >
                name
              </p>
              <p
                onClick={(e) => setSortTerm("last_played")}
                className="transition-class"
              >
                date
              </p>
              <p
                onClick={(e) => setSortTerm("session_count")}
                className="transition-class"
              >
                sessions
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setsortDescending((prev) => !prev)}
          className=" text-sm px-4 cursor-pointer transition-class hover:text-accent"
          aria-label={`Sort ${sortDescending ? "ascending" : "descending"}`}
        >
          <i
            aria-hidden
            className={`fa-solid fa-arrow-down transition-class ${
              sortDescending && "rotate-180"
            }`}
          ></i>
        </button>
      </div>
      <div className="grid grid-cols-1 min-[450px]:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {sortedGames.map(
          (game: {
            boardgameid: number;
            name: string;
            slug: string;
            session_count: number;
            last_played: Date;
          }) => (
            <a
              href={`/boardgame/${game.slug}`}
              key={game.boardgameid}
              className="flex flex-col justify-between border border-slate-400 p-4 hover:border-teal-700 rounded-sm hover:rounded-none hover:shadow-md card-neon-hover bg-background group"
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                e.currentTarget.style.setProperty("--mx", `${x}px`);
                e.currentTarget.style.setProperty("--my", `${y}px`);
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.setProperty("--mx", `0px`);
                e.currentTarget.style.setProperty("--my", `0px`);
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="leading-[100%] font-semibold tracking-wide lg:text-2xl md:text-xl text-lg pb-2 group-hover:text-accent transition-class lg:min-h-16">
                  {game.name}
                </h3>

                <div className="flex items-start gap-2 lg:opacity-0 group-hover:opacity-100 transition-class">
                  <button
                    className="cursor-pointer transition-class hover:text-accent"
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                    }}
                  >
                    {" "}
                    <i className="fa-solid fa-pencil text-xs "></i>{" "}
                  </button>
                  <button
                    className="cursor-pointer transition-class hover:text-danger"
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                    }}
                  >
                    {" "}
                    <i className="fa-solid fa-xmark pt-1"></i>{" "}
                  </button>
                </div>
              </div>

              <div className="border-t border-slate-400 w-full flex flex-col lg:flex-row max-lg:divide-y  lg:divide-x divide-slate-400 mt-8 group-hover:mt-2 transition-class">
                <div className="lg:px-4 flex flex-row justify-between lg:flex-col lg:justify-end lg:items-center max-lg:py-2 lg:pt-4 max-lg:gap-4">
                  <p className="xl:text-2xl lg:text-xl text-lg  leading-[100%]">
                    {game.session_count || 0}
                  </p>
                  <p className="transition-class lg:opacity-0 group-hover:opacity-100 text-xs lg:max-h-0 group-hover:max-h-4 ">
                    sessions
                  </p>
                </div>
                <div className="flex-1 lg:px-4 justify-between flex lg:flex-col lg:justify-end flex-row max-lg:pt-2 max-lg:gap-4">
                  <p className="xl:text-2xl lg:text-xl  text-base  leading-[100%]">
                    {game.last_played ? formatDate(game.last_played) : "-"}
                  </p>
                  <span className=" transition-class lg:opacity-0 group-hover:opacity-100 text-xs lg:max-h-0 group-hover:max-h-4  ">
                    last played
                  </span>
                </div>
              </div>
            </a>
          )
        )}
      </div>
    </section>
  );
}
