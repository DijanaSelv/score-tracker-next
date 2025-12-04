"use server";
import type { Props } from "@/../lib/types";
import PlayerClient from "./PlayerClient";

import { getPlayerDataBySlug } from "@/../lib/queries";

const PlayerPage = async ({ params }: Props) => {
  const { slug } = await params;

  const player = await getPlayerDataBySlug(slug);

  type PlayerRowRaw = {
    playername: string;
    boardgameslug: string;
    position: number | null;
    sessionid: number;
    date: Date | string | null;
    score: number;
    boardgamename: string;
  };

  const playerClient = (player as PlayerRowRaw[]).map((item) => ({
    ...item,
    date: item.date
      ? item.date instanceof Date
        ? item.date.toISOString()
        : String(item.date)
      : "",
  }));

  console.log(player, "player");

  return (
    <div className="container mx-auto px-4 lg:px-6 flex flex-col justify-center pt-16">
      {player.length ? (
        <>
          <h2 className="lg:text-2xl">
            Check out{" "}
            <span className="font-semibold">{player[0].playername}</span>&apos;s
            sessions
          </h2>

          {player.length > 1 && player[0].date != null ? (
            <PlayerClient playerData={playerClient} />
          ) : (
            <div className="mt-12">
              {" "}
              {player[0].playername} hasn&apos;t played any games yet. (кутраче){" "}
            </div>
          )}
        </>
      ) : (
        <div>No such player exist.</div>
      )}
    </div>
  );
};

export default PlayerPage;
