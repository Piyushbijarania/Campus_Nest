import { NextResponse } from "next/server";
import { getSession, isAdminEmail } from "@/lib/auth";

export async function GET() {
  const user = await getSession();
  if (!user) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }
  return NextResponse.json({
    id: user.id,
    email: user.email,
    name: user.name,
    college: user.college,
    isAdmin: isAdminEmail(user.email),
  });
}
