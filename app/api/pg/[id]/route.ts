// Member 3: GET single PG by id
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return Response.json({ message: "GET /api/pg/" + id + " – implement in Member 3 PR" }, { status: 501 });
}
