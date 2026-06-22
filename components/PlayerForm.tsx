"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { addPlayer } from "../lib/queries";

const PlayerForm = () => {
  const [error, setError] = useState<string | null>(null);
  const [addingPlayer, setAddingPlayer] = useState<boolean>(false);
  const playerFormRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  const closeAndResetForm = () => {
    playerFormRef.current?.reset();
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
  return (
    <form
      ref={playerFormRef}
      className="flex flex-col gap-1 min-w-xs"
      onSubmit={submitPlayer}
    >
      <label htmlFor="name">Player Name</label>
      <input
        type="text"
        placeholder="name"
        required
        id="name"
        name="name"
        className="border border-slate-400 px-2 py-1.5 outline-none focus:border-teal-700 transition-class"
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        type="submit"
        className="mt-2 cursor-pointer border border-slate-400 hover:border-teal-700 transition-class    px-2 py-1.5"
      >
        {addingPlayer ? "Adding..." : "+ Add Player"}
      </button>
    </form>
  );
};

export default PlayerForm;
