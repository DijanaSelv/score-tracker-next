import { getBoardGames } from "../lib/queries";

export default async function BoardGames() {
  const boardGames = await getBoardGames();

  return (
    <div>
      {boardGames.map(
        (game: { boardgameid: number; name: string; slug: string }) => (
          <a
            href={`/boardgame/${game.slug}`}
            key={game.boardgameid}
            className="block"
          >
            {game.name}
          </a>
        )
      )}
    </div>
  );
}
