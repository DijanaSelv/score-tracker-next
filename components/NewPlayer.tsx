"use client";

import { useRef, useState } from "react";
import { addPlayer } from "../lib/queries";
import { useRouter } from "next/navigation";

const NewPlayer = () => {
  const [NewPlayerPopup, setNewPlayerPopup] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [addingPlayer, setAddingPlayer] = useState<boolean>(false);
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  const closeAndResetForm = () => {
    setNewPlayerPopup(false);
    formRef.current?.reset();
    setError(null);
  };

  const submitPlayer = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;

    if (!name) {
      setError("You must type a name.");
      return;
    }

    try {
      setAddingPlayer(true);
      await addPlayer(name);
      closeAndResetForm();
      router.refresh();
    } catch (error) {
      if (error.message.includes("duplicate key")) {
        setError("A player with this name already exists.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <>
      <button
        onClick={() => {
          setNewPlayerPopup((prev) => !prev);
        }}
        className="cursor-pointer border border-slate-400  hover:border-teal-700 transition-class  text-sm  px-2 py-1 rounded-md hover:rounded-none"
      >
        + Add New Player
      </button>
      {NewPlayerPopup && (
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
              onSubmit={submitPlayer}
            >
              <label htmlFor="name">Name</label>
              <input
                type="text"
                placeholder="name"
                required
                id="name"
                name="name"
                className="border px-2 py-1.5 outline-none focus:border-teal-700 transition-class"
              />
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <button
                type="submit"
                className="mt-2 cursor-pointer border  hover:border-teal-700 transition-class    px-2 py-1.5"
              >
                {addingPlayer ? "Adding..." : "+ Add Player"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default NewPlayer;
