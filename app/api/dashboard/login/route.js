import { NextResponse } from "next/server";
import {
  DASHBOARD_COOKIE_NAME,
  getDashboardPassword
} from "../../../../lib/dashboard-auth";

export async function POST(request) {
  const body = await request.json().catch(() => ({}));

  if ((body?.password || "") !== getDashboardPassword()) {
    return NextResponse.json(
      { ok: false, message: "Wrong dashboard password." },
      { status: 401 }
    );
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(DASHBOARD_COOKIE_NAME, getDashboardPassword(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });

  return response;
}
