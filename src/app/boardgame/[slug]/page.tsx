import NewSession from "@/../components/NewSession";
import { SessionDetailsCard } from "@/../components/SessionDetailscard";

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
    <div className="container mx-auto px-4 lg:px-6 flex flex-col justify-center pt-16 ">
      <h1 className="pb-8 font-semibold lg:text-3xl"> {boardGame.name}</h1>
      <h2 className="lg:text-xl font-semibold pb-4">Sessions</h2>
      {sessions.length > 0 ? (
        <div className="flex flex-col gap-3">
          {sessions.map((session: Session) => (
            <div
              key={session.sessionid}
              className="p-4 border rounded-sm flex flex-col gap-2.5"
            >
              <p className="font-medium">
                {" "}
                {new Date(session.date)
                  .toLocaleDateString("en-GB")
                  .replaceAll("/", ".")}
              </p>
              <SessionDetailsCard {...session} />
            </div>
          ))}
        </div>
      ) : (
        <div>
          <p className="mb-4">Treba da se deshni edna partija.</p>
        </div>
      )}

      <div className="mt-4">
        <NewSession defaultBoardGameSelected={+boardGame.boardgameid} />
      </div>
      <div className="mt-12">
        <h2 className="font-semibold lg:text-lg">Statistics:</h2>
        <div className="mt-4 flex flex-row *:pr-6 gap-6 divide-x divide-foreground/10 ">
          <div>
            <h3>The Bestest Score so far: </h3>
            {highScore ? (
              <div className="flex items-center gap-3">
                <p>{highScore.score}</p>
                <p>
                  ( by <span className="font-semibold">{highScore.name}</span>)
                </p>
              </div>
            ) : (
              <div>
                {" "}
                I mean kako mozhi da ima high score ako ja nemate igrano igrata.{" "}
              </div>
            )}
          </div>
          <div>
            <h3>Most frequent player: </h3>
            {mostFrequentPlayers ? (
              <div className="flex items-center gap-3">
                <p>{mostFrequentPlayers.name}</p>
              </div>
            ) : (
              <div> I mean nikoj ne se trudi. </div>
            )}
          </div>
          <div>
            <h3>Most times won: </h3>
            {mostTimesWon ? (
              <div className="flex items-center gap-3">
                <p>{mostTimesWon.name}</p>
                <p>games won: {mostTimesWon["games_won"]}</p>
              </div>
            ) : (
              <div> I mean nikoj nema pobedeno. </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default boardGame;
