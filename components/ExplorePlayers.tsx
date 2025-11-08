"use client";
import { useGlobalData } from "@/app/context/GlobalDataContext";
import { useState } from "react";

const ExplorePlayers = () => {
  const [PlayerListPopup, setPlayerListPopup] = useState<boolean>(false);
  const { players } = useGlobalData();

  return (
    <>
      <button
        onMouseDown={() => {
          setPlayerListPopup((prev) => !prev);
        }}
        className="cursor-pointer border border-slate-400  hover:border-teal-700 transition-class  text-sm  px-2 py-1 rounded-md hover:rounded-none"
      >
        Explore Players
      </button>
      {PlayerListPopup && (
        <div
          onMouseDown={() => setPlayerListPopup(false)}
          className={
            "fixed inset-0 bg-foreground/10 backdrop-blur-xs bg-opacity-50 flex items-center justify-center"
          }
        >
          <div
            className="mx-auto my-auto bg-background p-4 lg:p-6 modal-content min-w-96"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold mb-4">Fren!</h2>
            <div className="grid grid-cols-2 gap-0.5">
              {players.map((player) => (
                <a
                  href={`/player/${player.slug}`}
                  key={`player-${player.slug}`}
                  className="block hover:text-teal-700 transition-class cursor-pointer"
                >
                  {player.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ExplorePlayers;
