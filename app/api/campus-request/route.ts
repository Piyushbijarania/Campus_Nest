import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const college = typeof body.college === "string" ? body.college.trim() || null : null;
    const message = typeof body.message === "string" ? body.message.trim() || null : null;

    if (!email || email.length < 3) {
      return NextResponse.json(
        { success: false, message: "Please enter a valid email." },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { success: false, message: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    await prisma.campusRequest.create({
      data: { email, college, message },
    });

    return NextResponse.json({ success: true, message: "Thanks! We'll be in touch." });
  } catch (e) {
    console.error("Campus request error:", e);
    return NextResponse.json(
      { success: false, message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
