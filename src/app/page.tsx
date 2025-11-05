import Image from "next/image";
import NewBoardGame from "../../components/NewBoardGame";
import { getBoardGames, getPlayers } from "../../lib/queries";
import BoardGamesList from "../../components/BoardGamesList";
import NewSession from "../../components/NewSession";
import NewPlayer from "../../components/NewPlayer";

export default async function Home() {
  const boardGames = await getBoardGames();
  const players = await getPlayers();

  return (
    <div className="font-sans items-center justify-center min-h-screen p-8 flex">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <BoardGamesList boardGames={boardGames} />
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <NewBoardGame />
          <NewSession boardGames={boardGames} players={players} />
          <NewPlayer />
        </div>
      </main>
    </div>
  );
}
