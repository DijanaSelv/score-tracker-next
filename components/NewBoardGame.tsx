"use client";
import { useRef, useState } from "react";
import { addBoardGame } from "../lib/queries";

const NewBoardGame = () => {
  const [newGamePopupOpen, setNewGamePopupOpen] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [addingGame, setAddingGame] = useState<boolean>(false);
  const formRef = useRef<HTMLFormElement>(null);

  const closeAndResetForm = () => {
    setNewGamePopupOpen(false);
    formRef.current?.reset();
    setError(null);
  };

  const submitBoardGame = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAddingGame(true);
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;

    try {
      await addBoardGame(name);
      closeAndResetForm();
    } catch (error) {
      console.error("Error adding board game:", error);
      if (error.message.includes("duplicate key")) {
        setError("A board game with this name already exists.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
    setAddingGame(false);
  };
  return (
    <>
      <button
        onClick={() => {
          setNewGamePopupOpen((prev) => !prev);
        }}
        className="cursor-pointer border  hover:border-teal-700 transition-class  text-sm  px-2 py-1 rounded-md hover:rounded-none"
      >
        + Add New Game
      </button>

      {newGamePopupOpen && (
        <div
          onClick={closeAndResetForm}
          className={
            "fixed inset-0 bg-foreground/10 backdrop-blur-xs bg-opacity-50 flex items-center justify-center"
          }
        >
          <div
            className="mx-auto my-auto bg-background p-4 modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold mb-4">Add New Board Game</h2>
            <form
              ref={formRef}
              className="flex flex-col gap-1 min-w-xs new-game-form"
              onSubmit={submitBoardGame}
            >
              <label htmlFor="name">Name</label>
              <input
                type="text"
                required
                placeholder="name"
                id="name"
                name="name"
                className="border px-2 py-1.5 outline-none focus:border-teal-700 transition-class"
              />
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <button
                type="submit"
                className="mt-2 cursor-pointer border  hover:border-teal-700 transition-class    px-2 py-1.5"
              >
                {addingGame ? "Adding..." : "+ Add Board Game"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default NewBoardGame;
