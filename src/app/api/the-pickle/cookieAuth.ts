import { cookies } from "next/headers";

const SESSION_COOKIE_KEY = "session";
export async function setSessionCookie(payload: string) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_KEY, payload, {
    httpOnly: true,
    secure: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function getSessionCookie() {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE_KEY);
}

export async function deleteSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_KEY);
}
