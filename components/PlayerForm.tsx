"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { addPlayer, updatePlayer } from "../lib/queries";
import { useSidebarContext } from "@/app/context/SideBarContext";
import { useGlobalData } from "@/app/context/GlobalDataContext";

const PlayerForm = () => {
  const [error, setError] = useState<string | null>(null);
  const [addingPlayer, setAddingPlayer] = useState<boolean>(false);

  const [playerData, setPlayerData] = useState<string[]>([""]);
  const playerFormRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const { sidebar, closeSidebar } = useSidebarContext();
  const { players } = useGlobalData();

  useEffect(() => {
    if (
      sidebar.mode === "edit-player" &&
      sidebar.payload &&
      sidebar.payload.player
    ) {
      setPlayerData([sidebar.payload.player.name]);
    } else {
      setPlayerData([""]);
    }
  }, [sidebar.mode, sidebar.payload, players]);

  const removePlayerRow = (rowIndex: number) => {
    setPlayerData((prev) => {
      const newPlayers = prev.toSpliced(rowIndex, 1);
      return newPlayers;
    });
  };

  const closeAndResetForm = () => {
    playerFormRef.current?.reset();
    setPlayerData([""]);
    setError(null);
  };

  const submitPlayers = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;

    if (!name) {
      setError("You must type a name.");
      return;
    }

    try {
      setAddingPlayer(true);
      await Promise.all(playerData.map((p) => addPlayer(p)));
      closeAndResetForm();
      router.refresh();
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.message.includes("duplicate key")) {
          setError("A player with this name already exists.");
        } else {
          setError("An unexpected error occurred. Please try again.");
        }
      } else {
        setError("An unknown error occurred.");
      }
    }
    setAddingPlayer(false);
  };

  const updateCurrentPlayer = () => {
    try {
      setAddingPlayer(true);
      updatePlayer(playerData[0], sidebar.payload!.player!.playerid);
      closeAndResetForm();
      closeSidebar();
      router.refresh();
    } catch (error: unknown) {
      setError("Couldn't update player");
    }

    setAddingPlayer(false);
  };

  return (
    <form
      ref={playerFormRef}
      className="flex flex-col gap-4 w-full"
      onSubmit={submitPlayers}
    >
      <div className="flex flex-col gap-1">
        {sidebar.mode == "add-player" ? (
          <label className="">Add Players</label>
        ) : (
          <label className="">Edit Player</label>
        )}

        {playerData.map((item, i) => (
          <div
            className="flex flex-row gap-2 items-stretch pb-2"
            key={`newplayerdiv-${i}`}
          >
            <input
              type="text"
              placeholder="name"
              required
              id="name"
              name="name"
              className="border border-slate-400 px-2 py-1 outline-none focus:border-teal-700 transition-class flex-1"
              value={playerData[i]}
              onChange={(e) =>
                setPlayerData((prev) =>
                  prev.map((item, index) =>
                    i == index ? e.target.value : item,
                  ),
                )
              }
            />
            {i != 0 && (
              <button
                className="border  px-2 h-full flex items-center border-slate-400 justify-center cursor-pointer hover:text-amber-700 hover:border-amber-700 transition-class text-sm sm:text-base"
                type="button"
                key={`delete-player-row-${i}`}
                onClick={() => removePlayerRow(Number(i))}
              >
                {" "}
                <i className="fa-solid fa-xmark"></i>
              </button>
            )}
          </div>
        ))}
      </div>

      {sidebar.mode == "add-player" && (
        <button
          type="button"
          onClick={() => setPlayerData((prev) => [...prev, ""])}
          className="border p-1 cursor-pointer  border-slate-400 hover:rounded-none hover:shadow-sm hover:border-teal-700\20 flex items-baseline gap-1 justify-center transition-class text-xs  opacity-50 hover:opacity-100  w-fit ml-auto"
          aria-label="add a player to the session"
        >
          <span>add player</span>
          <i className="fa-solid fa-plus text-[8px]" aria-hidden="true"></i>
        </button>
      )}
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {sidebar.mode == "add-player" ? (
        <button
          type="submit"
          className=" cursor-pointer border border-slate-400 hover:border-teal-700 transition-class    px-2 py-1.5"
        >
          {addingPlayer
            ? "Adding..."
            : `+ Add Player${playerData.length > 1 ? "s" : ""}`}
        </button>
      ) : (
        <button
          type="button"
          disabled={sidebar.payload?.player?.name == playerData[0]}
          className=" enabled:cursor-pointer border border-slate-400 enabled:hover:border-teal-700 transition-class disabled:opacity-50 px-2 py-1.5"
          onClick={() => updateCurrentPlayer()}
        >
          Save Changes
        </button>
      )}
    </form>
  );
};

export default PlayerForm;
