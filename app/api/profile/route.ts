import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: Request) {
  const user = await getSession();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  const name = typeof body.name === "string" ? body.name.trim() : null;
  await prisma.user.update({
    where: { id: user.id },
    data: { name: name || null },
  });
  return NextResponse.json({ success: true, name: name || null });
}
