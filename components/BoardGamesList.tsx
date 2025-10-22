"use client";
import { useEffect, useMemo, useState } from "react";

export default function BoardGamesList({ boardGames }: { boardGames: any[] }) {
  const [sortTerm, setSortTerm] = useState<
    "name" | "last_played" | "session_count"
  >("name");

  const [sortDescending, setsortDescending] = useState<boolean>(true);

  const sortedGames = useMemo(() => {
    const sorted = [...boardGames].sort((a, b) => {
      if (sortTerm === "name") {
        return a.name.localeCompare(b.name);
      } else if (sortTerm === "last_played") {
        return (
          new Date(b.last_played).getTime() - new Date(a.last_played).getTime()
        );
      } else {
        return b.session_count - a.session_count;
      }
    });

    return sortDescending ? sorted : sorted.reverse();
  }, [sortTerm, boardGames, sortDescending]);

  return (
    <section>
      <div className="flex items-center  mb-8 justify-end divide-x divide-slate-400 text-sm">
        <label className="px-4">Sort by:</label>
        <select
          onChange={(e) => setSortTerm(e.target.value as any)}
          value={sortTerm}
          className=" px-4 cursor-pointer transition-class outline-none appearance-none relative "
        >
          <option value="name">Name</option>
          <option value="last_played">Last Played</option>
          <option value="session_count">Sessions</option>
        </select>

        <button
          onClick={() => setsortDescending((prev) => !prev)}
          className="   px-4 text-xs cursor-pointer  transition-class"
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
      <div className="grid grid-cols-2 gap-4">
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
              className="flex flex-col justify-between border border-slate-400 p-4 hover:border-teal-700 transition-class rounded-lg hover:rounded-none hover:shadow-md hover:shadow-teal-600/20"
            >
              <h3 className="font-medium lg:text-xl md:text-lg text-base pb-2">
                {game.name}
              </h3>

              {game.session_count == 0 ? (
                <div>
                  <p className="font-light">Never played</p>
                </div>
              ) : (
                <div>
                  <p className="font-light">
                    {" "}
                    Sessions: {game.session_count || 0}
                  </p>
                  <p className="font-light">
                    Last played: {new Date(game.last_played).getDate()}.
                    {new Date(game.last_played).getMonth() + 1}.
                    {new Date(game.last_played).getFullYear()}
                  </p>
                </div>
              )}
            </a>
          )
        )}
      </div>
    </section>
  );
}
