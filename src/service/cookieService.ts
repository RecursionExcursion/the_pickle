"use server";

import { cookies } from "next/headers";

const sessionCookieKey = "session";

export async function setSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(sessionCookieKey, token, {
    httpOnly: true,
    secure: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 2, // 2 days
  });
}

export async function getSessionCookie() {
  const cookieStore = await cookies();
  return cookieStore.get(sessionCookieKey);
}

export async function deleteCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(sessionCookieKey);
}
