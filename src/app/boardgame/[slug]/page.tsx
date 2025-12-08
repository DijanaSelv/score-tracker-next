import SessionDetailsCard from "@/../components/SessionDetailsCard";
import ChartsSection from "./ChartsSection";

import type { Session, Props } from "@/../lib/types";
import {
  getBoardGameBySlug,
  getSessions,
  getBoardGameHighScore,
  getMostFrequentPlayers,
  getMostTimesWon,
} from "@/../lib/queries";

const boardGame = async ({ params }: Props) => {
  // await props and params so we don't access properties on a proxied object
  const { slug } = await params;

  const boardGame = await getBoardGameBySlug(slug);

  const sessions = await getSessions(boardGame.boardgameid);

  const sessionIds = sessions.map((session: Session) => session.sessionid);

  /* here we get statistics from the backend, compared to the player page where we calculate them in the frontend */
  const highScore =
    sessionIds.length > 0 ? await getBoardGameHighScore(sessionIds) : null;
  const mostFrequentPlayers =
    sessionIds.length > 0 ? await getMostFrequentPlayers(sessionIds) : null;
  const mostTimesWon =
    sessionIds.length > 0 ? await getMostTimesWon(sessionIds) : null;

  return (
    <div className="flex flex-col gap-6 lg:gap-8">
      <h1 className=" font-semibold lg:text-4xl md:text-3xl text-2xl">
        {boardGame.name}
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        <div className="lg:col-span-8 xl:col-span-7 flex flex-col gap-6 lg:gap-8">
          {sessions.length > 0 ? (
            <div className="grid grid-cols-1 min-[450px]:grid-cols-2 md:grid-cols-3  gap-3">
              {sessions.map((session: Session, i: number) => (
                <SessionDetailsCard {...session} key={`session-card-${i}`} />
              ))}
            </div>
          ) : (
            <div>
              <p className="">Treba da se deshni nekoja partija.</p>
            </div>
          )}
        </div>

        <div className="lg:col-span-4 xl:col-span-5 flex flex-col gap-6 lg:gap-8">
          <ChartsSection />
        </div>
      </div>
    </div>
  );
};

export default boardGame;
