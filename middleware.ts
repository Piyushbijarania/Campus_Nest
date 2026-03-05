import { NextResponse } from "next/server";

export function middleware() {
  // Member 2: protect /dashboard, /pg/create, /rides/create
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
