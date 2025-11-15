import BoardGamesList from "../../components/BoardGamesList";

export default async function Home() {
  return (
    <section className="flex flex-col gap-12 lg:gap-22">
      {/* <h1 className="lg:text-5xl text-4xl font-zen-dots">Board Games</h1> */}
      <BoardGamesList />
    </section>
  );
}
