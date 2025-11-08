import type { Props } from "@/../lib/types";
import PlayerClient from "./PlayerClient";

import { getPlayerDataBySlug } from "@/../lib/queries";

const PlayerPage = async ({ params }: Props) => {
  const { slug } = await params;

  const player = await getPlayerDataBySlug(slug);
  console.log(player, "player");

  return (
    <div className="container mx-auto px-4 lg:px-6 flex flex-col justify-center pt-16">
      {player.length ? (
        <>
          <h2 className="lg:text-2xl">
            Check out{" "}
            <span className="font-semibold">{player[0].playername}'s</span>{" "}
            stuff
          </h2>

          {player.length > 1 && player[0].date != null ? (
            <PlayerClient playerData={player} />
          ) : (
            <div className="mt-12">
              {" "}
              {player[0].playername} hasn't played any games yet. (кутраче){" "}
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
