"use client";
import { useRef, useState } from "react";
import { addSession } from "../lib/queries";
import { useRouter } from "next/navigation";

const NewSession = ({
  boardGames,
  players,
}: {
  boardGames: any[];
  players: any[];
}) => {
  const [newSessionPopupOpen, setNewSessionPopupOpen] =
    useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [addingSession, setAddingSession] = useState<boolean>(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [playerScores, setPlayerScores] = useState<any[]>([
    { id: undefined, score: undefined },
  ]);
  const router = useRouter();

  // Allow updating either id or score (or both) from UI handlers.
  const handlePlayerChange = (
    index: number,
    newId?: number,
    newScore?: number
  ) => {
    setPlayerScores((prev) =>
      prev.map((item, i) =>
        i === index
          ? { ...item, id: newId ?? item.id, score: newScore ?? item.score }
          : item
      )
    );
  };

  const closeAndResetForm = () => {
    setNewSessionPopupOpen(false);
    formRef.current?.reset();
    setPlayerScores([{ id: undefined, score: undefined }]);
    setError(null);
  };

  const submitSession = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAddingSession(true);
    const formData = new FormData(e.currentTarget);
    const dateValue = formData.get("date");
    const date = new Date(dateValue);
    const boardgameid = formData.get("boardgame") as number;

    try {
      await addSession(boardgameid, date, playerScores);
      closeAndResetForm();
      router.refresh();
    } catch (err: any) {
      console.error("Error adding board game:", err);
      if (err?.message?.includes("duplicate key")) {
        setError("A board game with this name already exists.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
    setAddingSession(false);
  };

  return (
    <>
      <button
        onClick={() => {
          setNewSessionPopupOpen((prev) => !prev);
        }}
        className="cursor-pointer border border-slate-400  hover:border-teal-700 transition-class  text-sm  px-2 py-1 rounded-md hover:rounded-none"
      >
        + Add New Session
      </button>

      {newSessionPopupOpen && (
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
            <h2 className="text-lg font-semibold mb-4">Add New Session</h2>
            <form
              ref={formRef}
              className="flex flex-col gap-3 min-w-xs new-game-form"
              onSubmit={submitSession}
            >
              <div className="flex flex-col ">
                <label htmlFor="date">Date</label>
                <input
                  type="date"
                  required
                  placeholder="choose date"
                  id="date"
                  name="date"
                  className="border px-2 py-1.5 outline-none focus:border-teal-700 transition-class"
                />
              </div>
              <div className="flex flex-col ">
                <label htmlFor="boardgame">Board Game</label>
                <select
                  required
                  id="boardgame"
                  name="boardgame"
                  className="border px-2 py-1.5 outline-none focus:border-teal-700 transition-class"
                  defaultValue={undefined}
                >
                  <option value={undefined}>Choose...</option>
                  {boardGames.map((game) => (
                    <option
                      value={game.boardgameid}
                      key={`boardgame-${game.boardgameid}`}
                    >
                      {game.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col ">
                {playerScores.map((item, i) => (
                  <div
                    key={`playerdiv-${i}`}
                    className="flex items-center gap-4"
                  >
                    <select
                      id={`playerName-${i}`}
                      value={item.id ?? ""}
                      onChange={(e) =>
                        handlePlayerChange(i, Number(e.target.value))
                      }
                      name={`player-${i}`}
                    >
                      <option value="">Choose...</option>
                      {players
                        .filter(
                          (player) =>
                            player.playerid === item.id ||
                            !playerScores.some(
                              (entry) => entry.id == player.playerid
                            )
                        )
                        .map((player) => (
                          <option
                            value={player.playerid}
                            key={`player-${player.playerid}`}
                          >
                            {player.name}
                          </option>
                        ))}
                    </select>
                    <input
                      type="number"
                      id={`playerscore-${i}`}
                      placeholder="Add score..."
                      value={item.score || 0}
                      onChange={(e) =>
                        handlePlayerChange(i, undefined, Number(e.target.value))
                      }
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    setPlayerScores((prev) => [
                      ...prev,
                      { id: undefined, score: undefined },
                    ])
                  }
                  className="border p-1 cursor-pointer rounded-sm border-slate-400 hover:border-teal-700 hover:rounded-none hover:shadow-sm hover:border-teal-700\20"
                  aria-label="add a player to the session"
                >
                  <i className="fa-solid fa-plus" aria-hidden="true"></i>
                </button>
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <button
                type="submit"
                className="mt-2 cursor-pointer border  hover:border-teal-700 transition-class    px-2 py-1.5"
              >
                {addingSession ? "Adding..." : "+ Add Board Game"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default NewSession;
