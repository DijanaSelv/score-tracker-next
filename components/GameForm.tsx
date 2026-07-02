"use client";
import { useEffect, useRef, useState } from "react";
import { addBoardGame, updateBoardGame } from "../lib/queries";
import { useRouter } from "next/navigation";
import { useSidebarContext } from "@/app/context/SideBarContext";
import { useGlobalData } from "@/app/context/GlobalDataContext";

const GameForm = () => {
  const [error, setError] = useState<string | null>(null);
  const [addingGame, setAddingGame] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [noPoints, setNoPoints] = useState<boolean>(false);

  const gameFormRef = useRef<HTMLFormElement>(null);

  const router = useRouter();

  const { sidebar, closeSidebar } = useSidebarContext();
  const { boardGames } = useGlobalData();

  const closeAndResetForm = () => {
    gameFormRef.current?.reset();
    setError(null);
  };

  useEffect(() => {
    if (
      sidebar.mode === "edit-game" &&
      sidebar.payload &&
      sidebar.payload.game
    ) {
      const game = sidebar.payload.game;

      setName(game.name);
      setNoPoints(game.nopoints);
    } else {
      setName("");
      setNoPoints(false);
    }
  }, [sidebar.mode, sidebar.payload]);

  const submitBoardGame = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name) {
      setError("You must type a name.");
      return;
    }

    try {
      setAddingGame(true);
      await addBoardGame(name, noPoints);
      closeAndResetForm();
      router.refresh();
    } catch (error: unknown) {
      console.error("Error adding board game:", error);

      if (error instanceof Error) {
        if (error.message.includes("duplicate key")) {
          setError("A board game with this name already exists.");
        } else {
          setError("An unexpected error occurred. Please try again.");
        }
      } else {
        // fallback if error is not an Error object
        setError("An unknown error occurred.");
      }
    }
    setAddingGame(false);
  };

  const updateCurrentGame = () => {
    try {
      setAddingGame(true);
      updateBoardGame(name, noPoints, sidebar.payload!.game!.boardgameid);
      closeAndResetForm();
      closeSidebar();
      router.refresh();
    } catch (error: unknown) {
      setError("Couldn't update board game");
      console.log(error);
    }

    setAddingGame(false);
  };

  return (
    <form
      ref={gameFormRef}
      className="flex flex-col gap-4 w-full"
      onSubmit={submitBoardGame}
    >
      <div className="flex flex-col gap-1">
        {sidebar.mode == "add-game" ? (
          <label htmlFor="name">Board Game Name</label>
        ) : (
          <label htmlFor="name">Edit Game </label>
        )}

        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          type="text"
          placeholder="name"
          id="name"
          name="name"
          className=" border border-slate-400 px-2 py-1.5 outline-none focus:border-teal-700 transition-class"
        />
      </div>
      <div className="flex flex-row items-center justify-between cursor-pointer">
        <label htmlFor="nopoints" className="cursor-pointer">
          Won or lost only (no points)
        </label>
        <input
          type="checkbox"
          checked={noPoints}
          id="nopoints"
          name="nopoints"
          onChange={() => setNoPoints((prev) => !prev)}
          className="border border-slate-400 px-2 py-1.5 size-4! outline-none focus:border-teal-700 transition-class cursor-pointer"
        />
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {sidebar.mode == "add-game" ? (
        <button
          type="submit"
          className="cursor-pointer border border-slate-400  hover:border-teal-700 transition-class    px-2 py-1.5"
        >
          {addingGame ? "Adding..." : "+ Add Board Game"}
        </button>
      ) : (
        <button
          type="button"
          disabled={
            sidebar.payload?.game?.name == name &&
            sidebar.payload?.game?.nopoints == noPoints
          }
          className=" enabled:cursor-pointer border border-slate-400 enabled:hover:border-teal-700 transition-class disabled:opacity-50 px-2 py-1.5"
          onClick={() => updateCurrentGame()}
        >
          Save Changes
        </button>
      )}
    </form>
  );
};

export default GameForm;
