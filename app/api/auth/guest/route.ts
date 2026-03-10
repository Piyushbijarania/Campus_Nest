import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createToken, COOKIE_NAME } from "@/lib/auth-edge";

const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

/** One-click guest login for judges/demo. Uses GUEST_EMAIL + GUEST_PASSWORD from env. */
export async function POST() {
  try {
    const guestEmail = process.env.GUEST_EMAIL?.trim().toLowerCase();
    const guestPassword = process.env.GUEST_PASSWORD;
    const guestCollege = process.env.ALLOWED_EMAIL_DOMAIN || "bitmesra.ac.in";

    if (!guestEmail || !guestPassword) {
      return NextResponse.json(
        { success: false, message: "Guest login is not configured." },
        { status: 503 }
      );
    }

    let user = await prisma.user.findUnique({ where: { email: guestEmail } });

    if (!user) {
      const hashed = await bcrypt.hash(guestPassword, 10);
      user = await prisma.user.create({
        data: {
          email: guestEmail,
          password: hashed,
          name: "Guest",
          college: guestCollege,
        },
      });
    } else {
      const valid = await bcrypt.compare(guestPassword, user.password);
      if (!valid) {
        return NextResponse.json(
          { success: false, message: "Invalid guest credentials." },
          { status: 401 }
        );
      }
      // Ensure existing guest has college so they can use rides
      if (!user.college) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: { college: guestCollege },
        });
      }
    }

    const token = await createToken(user.id);
    const res = NextResponse.json({
      success: true,
      user: { id: user.id, email: user.email, name: user.name },
    });

    res.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: COOKIE_MAX_AGE,
      path: "/",
    });

    return res;
  } catch (e) {
    console.error("Guest login error:", e);
    return NextResponse.json(
      { success: false, message: "Something went wrong." },
      { status: 500 }
    );
  }
}
