export default async function SinglePGPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold">PG #{id}</h1>
      <p className="text-zinc-600 mt-2">Member 3: fetch by id and display</p>
    </main>
  );
}
