import Image from "next/image";
import NewBoardGame from "../../components/NewBoardGame";
import { getBoardGames } from "../../lib/queries";
import BoardGamesList from "../../components/BoardGamesList";

export default async function Home() {
  const boardGames = await getBoardGames();

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <BoardGamesList boardGames={boardGames} />
        <NewBoardGame />
      </main>
    </div>
  );
}
