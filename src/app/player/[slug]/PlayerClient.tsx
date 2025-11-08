"use client";
import { useState } from "react";

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
  return (
    <div className="mt-12">
      {playerData.map((row: PlayerRow, i: number) => (
        <div className="grid grid-cols-5 w-full" key={`playerrow-${i}`}>
          <a className="block" href={`/boardgame/${row.boardgameslug}`}>
            {row.boardgamename}
          </a>
          <div>{row.date.toLocaleDateString("en-GB")}</div>
          <div>{row.score}</div>
          <div>{row.position}</div>
          <button className="block cursor-pointer">session details</button>
        </div>
      ))}
    </div>
  );
};

export default PlayerClient;
