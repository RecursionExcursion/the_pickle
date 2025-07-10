"use server";

import { redirect } from "next/navigation";
import { Match, Player, Score } from "./types";
import { revalidateTag } from "next/cache";
import { getSessionCookie, setSessionCookie } from "./cookieService";

const pickleRoute = process.env.PICKLE_API;

if (!pickleRoute) {
  throw Error("API route not found in env");
}

async function getToken() {
  const cookie = await getSessionCookie();
  if (cookie) {
    return cookie.value;
  }
}

const redirectToLogin = () => redirect("/login");

const playersCacheTag = "players";
const matchesCacheTag = "matches";

export async function invalidatePlayers() {
  revalidateTag(playersCacheTag);
}

export async function invalidateMatches() {
  revalidateTag(matchesCacheTag);
}

export async function getPlayers() {
  const token = await getToken();
  if (!token) {
    throw Error("unauthorized");
  }

  const res = await fetch(pickleRoute + "/player", {
    next: { tags: [playersCacheTag] },
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.status === 401) {
    throw Error("unauthorized");
  }

  if (!res.ok) {
    throw Error("failed to fetch players");
  }

  return (await res.json()) as Player[];
}

export async function getMatches() {
  const token = await getToken();
  if (!token) {
    throw Error("unauthorized");
  }

  const res = await fetch(pickleRoute + "/match", {
    next: { tags: [matchesCacheTag] },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.status === 401) {
    throw Error("unauthorized");
  }

  if (!res.ok) {
    throw Error("failed to fetch players");
  }

  return (await res.json()) as Match[];
}

export async function addMatch(score: Score[]) {
  const token = await getToken();
  if (!token) {
    throw Error("unauthorized");
  }

  const payload = {
    date: Date.now(),
    score: [
      {
        id: score[0].id,
        points: score[0].points,
      },
      {
        id: score[1].id,
        points: score[1].points,
      },
    ],
  };

  await fetch(pickleRoute + "/match", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  await invalidateMatches();
}

export async function removeMatch(matchId: string): Promise<boolean> {
  const token = await getToken();
  if (!token) redirectToLogin();

  const payload = {
    id: matchId,
  };

  const res = await fetch(pickleRoute + "/match", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  return res.ok;
}

export async function login(un: string, pw: string): Promise<boolean> {
  const payload = {
    username: un,
    password: pw,
  };

  const res = await fetch(pickleRoute + "/auth", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (res.ok) {
    const token = await res.json();
    await setSessionCookie(token);
    return true;
  }
  return false;
}
