"use client";

import Counter from "@/../components/Counter";
import type { Session } from "@/../lib/types";
import { formatDate } from "../lib/utils";
import PopupModalWrapper from "./PopupModalWrapper";
import SecondaryButton from "./SecondaryButton";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const SessionDetailsCard = ({
  session,
  noPointsBoardGame,
}: {
  session: Session;
  noPointsBoardGame: boolean;
}) => {
  const router = useRouter();

  const [deleteItemPopup, setDeleteItemPopup] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{
    id: number;
    date: string;
  } | null>(null);

  const [sessionDetails, setSessionDetails] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/session/${session.sessionid}`);
      const data = await res.json();
      const ordered = (data ?? []).sort(
        (a: { score: number }, b: { score: number }) => b.score - a.score
      );
      setSessionDetails(ordered);
      setIsLoading(false);
    }
    load();
  }, [session.sessionid]);

  const deleteSessionHandler = async (id: number) => {
    await fetch(`/api/deleteSession/${id}`);
    router.refresh();
    setDeleteItemPopup(false);
    setItemToDelete(null);
  };

  if (isLoading) return <div className="p-4 border rounded-sm">Loading...</div>;

  return (
    <div
      key={session.sessionid}
      className="p-4 border rounded-sm flex flex-col gap-2.5 md:gap-6 lg:gap-6 border-slate-400 hover:rounded-none hover:border-highlight transition-class card-static-hover group"
    >
      <div className="flex justify-between items-center ">
        <p className="font-medium text-lg"> {formatDate(session.date)}</p>
        <button
          className="opacity-0 group-hover:opacity-100 transition-class cursor-pointer text-foreground/60 hover:text-danger"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            setItemToDelete({
              id: session.sessionid,
              date: session.date,
            });
            setDeleteItemPopup(true);
          }}
        >
          <i className="fa-solid fa-trash text-sm "></i>
        </button>
      </div>

      <div className="max-w-60">
        {sessionDetails.map((item) => (
          <div
            key={`${session.sessionid}-${item.name}`}
            className="grid grid-cols-2 gap-2"
          >
            <a
              href={`/players/${item.slug}`}
              className="transition-class hover:text-danger flex items-center gap-2"
            >
              {item.name}
              {!noPointsBoardGame && item.position == 1 && (
                <i className="fa-solid fa-crown text-xs text-amber-400"></i>
              )}
            </a>

            <p>
              {noPointsBoardGame ? (
                <>
                  {item.score ? (
                    <i className="fa-solid fa-crown text-xs text-amber-400"></i>
                  ) : (
                    <i className="fa-solid fa-skull text-xs text-danger"></i>
                  )}
                </>
              ) : (
                <Counter value={item.score} />
              )}
            </p>
          </div>
        ))}
      </div>

      {/* Delete Session popup */}
      <PopupModalWrapper
        isOpen={deleteItemPopup}
        closeAndResetForm={() => setDeleteItemPopup(false)}
      >
        {itemToDelete && (
          <div className="flex flex-col gap-4 lg:gap-6">
            <h2 className="font-semibold lg:text-2xl md:text-xl text-base">
              Delete Session
            </h2>
            <p className="text-balance pr-5 max-w-lg">
              Are you sure you want to delete the session on{" "}
              <span className="font-semibold text-danger">
                {formatDate(itemToDelete.date)}
              </span>
              ?
            </p>
            <div className="flex items-center justify-end w-fit ml-auto gap-3">
              <SecondaryButton
                onClickHandle={() => deleteSessionHandler(itemToDelete.id)}
                danger={true}
              >
                Delete
              </SecondaryButton>
              <SecondaryButton onClickHandle={() => setDeleteItemPopup(false)}>
                Cancel
              </SecondaryButton>
            </div>
          </div>
        )}
      </PopupModalWrapper>
    </div>
  );
};
export default SessionDetailsCard;
