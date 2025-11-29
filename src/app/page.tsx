import BoardGamesClient from "./BoardGamesClient";

export default async function Home() {
  return (
    <section className="flex flex-col gap-12 lg:gap-22">
      <BoardGamesClient />
    </section>
  );
}
