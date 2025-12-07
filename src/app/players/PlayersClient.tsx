"use client";

import { useGlobalData } from "@/app/context/GlobalDataContext";
import { useState } from "react";
import PopupModalWrapper from "../../../components/PopupModalWrapper";
import SecondaryButton from "../../../components/SecondaryButton";
import { useRouter } from "next/navigation";

const PlayersClient = () => {
  const [deleteItemPopup, setDeleteItemPopup] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{
    id: number;
    name: string;
  } | null>(null);

  const router = useRouter();

  const { players } = useGlobalData();

  const deleteSessionHandler = async (id: number) => {
    await fetch(`/api/deletePlayer/${id}`);
    router.refresh();
    setDeleteItemPopup(false);
    setItemToDelete(null);
  };

  return (
    <section>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        <div className="lg:col-span-8 xl:col-span-7">
          {players.length ? (
            <div className="flex flex-col w-full  divide-y divide-slate-400 ">
              {players.map((player) => (
                <div className="group flex items-center justify-between w-full">
                  <a
                    key={`players/${player.slug}`}
                    href={`players/${player.slug}`}
                    className="hover:text-danger transition-class lg:text-lg text-base py-1 lg:py-2 pl-3 lg:pl-4 block grow "
                  >
                    {player.name}
                  </a>
                  <button
                    className="opacity-0 group-hover:opacity-100 transition-class cursor-pointer text-foreground/60 hover:text-danger"
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      setItemToDelete({
                        id: player.playerid,
                        name: player.name,
                      });
                      setDeleteItemPopup(true);
                    }}
                  >
                    <i className="fa-solid fa-trash text-xs "></i>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <>
              <h2>There are no players added so far.</h2>
            </>
          )}
        </div>
        <div className="lg:col-span-4 xl:col-span-5 text-center pt-8">
          stats coming soon...
        </div>
      </div>
      {/* Delete Character popup */}
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
              Are you sure you want to delete{" "}
              <span className="font-semibold text-danger">
                {itemToDelete.name}
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
    </section>
  );
};

export default PlayersClient;
