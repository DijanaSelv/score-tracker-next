"use client";
import { useRef, useState } from "react";
import { addBoardGame } from "../lib/queries";
import { useRouter } from "next/navigation";
import PrimaryButton from "./PrimaryButton";
import PopupModalWrapper from "./PopupModalWrapper";
import { Checkbox } from "@mui/material";

const NewBoardGame = () => {
  const [newGamePopupOpen, setNewGamePopupOpen] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [addingGame, setAddingGame] = useState<boolean>(false);
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  const closeAndResetForm = () => {
    setNewGamePopupOpen(false);
    formRef.current?.reset();
    setError(null);
  };

  const submitBoardGame = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const noPoints = formData.get("nopoints") != null;

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
  return (
    <>
      <PrimaryButton
        onClickHandle={() => {
          setNewGamePopupOpen((prev) => !prev);
        }}
      >
        + New Game
      </PrimaryButton>
      <PopupModalWrapper
        closeAndResetForm={closeAndResetForm}
        isOpen={newGamePopupOpen}
      >
        <h2 className="text-lg font-semibold mb-4">Add a new Board Game</h2>
        <form
          ref={formRef}
          className="flex flex-col gap-4 min-w-xs new-game-form"
          onSubmit={submitBoardGame}
        >
          <div className="flex flex-col gap-1">
            <label htmlFor="name">Name</label>
            <input
              required
              type="text"
              placeholder="name"
              id="name"
              name="name"
              className="border border-slate-400 px-2 py-1.5 outline-none focus:border-teal-700 transition-class"
            />
          </div>
          <div className="flex flex-row items-center justify-between w-full cursor-pointer">
            <label htmlFor="nopoints" className="cursor-pointer">
              Won or lost only (no points)
            </label>
            <input
              type="checkbox"
              id="nopoints"
              name="nopoints"
              value="true"
              className="border border-slate-400 px-2 py-1.5 size-4! outline-none focus:border-teal-700 transition-class"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="mt-2 cursor-pointer border border-slate-400  hover:border-teal-700 transition-class    px-2 py-1.5"
          >
            {addingGame ? "Adding..." : "+ Add Board Game"}
          </button>
        </form>
      </PopupModalWrapper>
    </>
  );
};

export default NewBoardGame;
