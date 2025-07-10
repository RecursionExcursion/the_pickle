"use server";

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

const unauthorizedErrorMessage = "unauthorized";

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
    throw Error(unauthorizedErrorMessage);
  }

  const res = await fetch(pickleRoute + "/player", {
    next: { tags: [playersCacheTag] },
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.status === 401) {
    throw Error(unauthorizedErrorMessage);
  }

  if (!res.ok) {
    throw Error("failed to fetch players");
  }

  return (await res.json()) as Player[];
}

export async function getMatches() {
  const token = await getToken();
  if (!token) {
    throw Error(unauthorizedErrorMessage);
  }

  const res = await fetch(pickleRoute + "/match", {
    next: { tags: [matchesCacheTag] },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.status === 401) {
    throw Error(unauthorizedErrorMessage);
  }

  if (!res.ok) {
    throw Error("failed to fetch matches");
  }

  return (await res.json()) as Match[];
}

export async function addMatch(score: Score[]) {
  const token = await getToken();
  if (!token) {
    throw Error(unauthorizedErrorMessage);
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

  const res = await fetch(pickleRoute + "/match", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (res.status === 401) {
    throw Error(unauthorizedErrorMessage);
  }

  if (!res.ok) {
    throw Error("Something went wrong");
  }

  if (res.ok) {
    await invalidateMatches();
  }
}

export async function removeMatch(matchId: string): Promise<boolean> {
  const token = await getToken();
  if (!token) {
    throw Error(unauthorizedErrorMessage);
  }

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

  if (res.status === 401) {
    throw Error(unauthorizedErrorMessage);
  }

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

  if (!res.ok) {
    return false;
  }

  const token = await res.json();
  await setSessionCookie(token);
  return true;
}
