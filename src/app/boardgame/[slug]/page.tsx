import { SessionDetailsCard } from "../../../../components/SessionDetailscard";
import { getBoardGameBySlug, getSessions } from "../../../../lib/queries";

interface Props {
  params: { slug: string };
}

const boardGame = async ({ params }: Props) => {
  // await props and params so we don't access properties on a proxied object
  const { slug } = await params;

  const boardGame = await getBoardGameBySlug(slug);
  const sessions = await getSessions(boardGame.boardgameid);

  return (
    <>
      <div>Board Game: {boardGame.name}</div>
      <h2>Sessions</h2>
      <div className="flex flex-col gap-3">
        {sessions.map((session: { sessionid: number; date: string }) => (
          <div
            key={session.sessionid}
            className="p-4 border rounded-md flex items-center justifybetween"
          >
            <SessionDetailsCard {...session} />
            <div>Date: {new Date(session.date).toLocaleDateString()}</div>
            <div></div>
          </div>
        ))}
      </div>
    </>
  );
};

export default boardGame;
