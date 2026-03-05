// Member 3: GET all, POST create – implement per API contract
export async function GET() {
  return Response.json([]);
}

export async function POST() {
  return Response.json({ success: false, message: "Implement in Member 3 PR" }, { status: 501 });
}
