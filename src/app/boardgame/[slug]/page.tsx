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
    <div className="container mx-auto px-4 lg:px-6 flex flex-col justify-center pt-16 ">
      <h1 className="pb-8 font-semibold lg:text-3xl"> {boardGame.name}</h1>
      <h2 className="lg:text-xl font-semibold pb-4">Sessions</h2>
      <div className="flex flex-col gap-3">
        {sessions.map((session: { sessionid: number; date: string }) => (
          <div
            key={session.sessionid}
            className="p-4 border rounded-md flex flex-col gap-2.5"
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
    </div>
  );
};

export default boardGame;
