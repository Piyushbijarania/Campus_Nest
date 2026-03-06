import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const ALLOWED_DOMAIN = (process.env.ALLOWED_EMAIL_DOMAIN || "bitmesra.ac.in")
  .toLowerCase()
  .replace(/^@/, "");

function isCollegeEmail(email: string): boolean {
  const domain = email.trim().toLowerCase().split("@")[1];
  return domain === ALLOWED_DOMAIN;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, name } = body;

    if (!email || typeof email !== "string" || !password || typeof password !== "string") {
      return NextResponse.json(
        { success: false, message: "Email and password are required." },
        { status: 400 }
      );
    }

    const emailTrimmed = email.trim().toLowerCase();
    if (!isCollegeEmail(emailTrimmed)) {
      return NextResponse.json(
        { success: false, message: "Only college email addresses are allowed." },
        { status: 400 }
      );
    }

    const college = emailTrimmed.split("@")[1] ?? null;
    const existing = await prisma.user.findUnique({ where: { email: emailTrimmed } });
    if (existing) {
      return NextResponse.json(
        { success: false, message: "An account with this email already exists." },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email: emailTrimmed,
        password: hashedPassword,
        name: typeof name === "string" ? name.trim() || null : null,
        college,
      },
      select: { id: true, email: true, name: true },
    });

    return NextResponse.json({
      success: true,
      user: { id: user.id, email: user.email, name: user.name },
    });
  } catch (e) {
    console.error("Signup error:", e);
    return NextResponse.json(
      { success: false, message: "Something went wrong." },
      { status: 500 }
    );
  }
}
