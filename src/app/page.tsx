import BoardGamesList from "../../components/BoardGamesList";

export default async function Home() {
  return (
    <main className="pt-22 lg:pt-32 container mx-auto px-4 lg:px-6">
      <section>
        <BoardGamesList />
      </section>
    </main>
  );
}
