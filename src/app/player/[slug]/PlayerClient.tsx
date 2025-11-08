"use client";
import { useRef, useState } from "react";

type PlayerRow = {
  boardgamename: string;
  playername: string;
  position: number | null;
  score: number;
  date: Date;
  sessionid: number;
  boardgameslug: string;
};

const PlayerClient = ({ playerData }: { playerData: PlayerRow[] }) => {
  const [sortCondition, setSortCondition] = useState<string>("boardgamename");
  const [sortDescending, setSortDescending] = useState<boolean>(true);

  const sortedPlayerData = playerData.sort((a, b) => {
    switch (sortCondition) {
      case "boardgamename":
        return a.boardgamename.localeCompare(b.boardgamename);
      case "position":
        return (a.position ?? -1) - (b.position ?? -1);
      case "score":
        return b.score - a.score;
      case "date":
        return b.date.getTime() - a.date.getTime();
      default:
        return 0;
    }
  });

  const finalSortedData = sortDescending
    ? sortedPlayerData
    : sortedPlayerData.reverse();

  return (
    <section>
      <div className="flex flex-row gap-5 divide-x divide-foreground/10 *:pr-5 mt-12 justify-end">
        <div>
          <label>Sort by:</label>
          <select
            value={sortCondition}
            className="cursor-pointer"
            onChange={(e) => setSortCondition(e.currentTarget.value as string)}
          >
            <option value="date">date</option>
            <option value="boardgamename">board game</option>
            <option value="score">score</option>
            <option value="position">position</option>
          </select>
        </div>
        <button
          onClick={() => setSortDescending((prev) => !prev)}
          className="cursor-pointer"
        >
          <i
            className={`fa-solid fa-arrow-down transition-class ${
              sortDescending ? "rotate-0" : "rotate-180"
            }`}
            aria-hidden="true"
            aria-label="descending/ascending button"
          ></i>
        </button>
      </div>

      <div className="mt-12 ">
        <div className="grid grid-cols-5 bg-foreground/5  py-1.5 font-medium px-2">
          <div>date</div>
          <div>board game</div>
          <div>score</div>
          <div>position</div>
          <div></div>
        </div>
        {finalSortedData.map((row: PlayerRow, i: number) => (
          <div
            className="grid grid-cols-5 w-full py-1 border-y border-collapse hover:border-teal-700/50 hover:shadow-teal-700/10 hover:shadow-sm border-foreground/5 px-2 transition-class hover:bg-teal-700/5"
            key={`playerrow-${i}`}
          >
            <div>{row.date.toLocaleDateString("en-GB")}</div>
            <a className="block" href={`/boardgame/${row.boardgameslug}`}>
              {row.boardgamename}
            </a>
            <div>{row.score}</div>
            <div>{row.position}</div>
            <button className="block cursor-pointer">session details</button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PlayerClient;
