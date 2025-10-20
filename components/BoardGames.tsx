import { getBoardGames } from "../lib/queries";

export default async function BoardGames() {
  const boardGames = await getBoardGames();

  return (
    <div className="grid grid-cols-2 gap-4">
      {boardGames.map(
        (game: {
          boardgameid: number;
          name: string;
          slug: string;
          session_count: number;
          last_played: Date;
        }) => (
          <a
            href={`/boardgame/${game.slug}`}
            key={game.boardgameid}
            className="block border border-slate-400 p-4 hover:border-teal-700 transition-class rounded-lg hover:rounded-none"
          >
            <h3 className="font-medium lg:text-xl md:text-lg text-base pb-2">
              {game.name}
            </h3>
            <p>Sessions so far: {game.session_count || 0}</p>
            <p>
              Last Played:{" "}
              {game.last_played
                ? new Date(game.last_played).toLocaleDateString()
                : "Never played"}
            </p>
          </a>
        )
      )}
    </div>
  );
}
