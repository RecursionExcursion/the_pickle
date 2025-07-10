"use server";

import { Match, Player, Score } from "./types";
import { revalidateTag } from "next/cache";
import { getSessionCookie, setSessionCookie } from "./cookieService";

type ServiceResponse<T> = {
  status: number;
  payload: T;
};

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

export async function getPlayers(): Promise<ServiceResponse<Player[]>> {
  const token = await getToken();
  if (!token) {
    return {
      status: 401,
      payload: [],
    };
  }

  const res = await fetch(pickleRoute + "/player", {
    next: { tags: [playersCacheTag] },
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return {
    status: res.status,
    payload: (await res.json()) as Player[],
  };
}

export async function getMatches(): Promise<ServiceResponse<Match[]>> {
  const token = await getToken();
  if (!token) {
    return {
      status: 401,
      payload: [],
    };
  }

  const res = await fetch(pickleRoute + "/match", {
    next: { tags: [matchesCacheTag] },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return {
    status: res.status,
    payload: (await res.json()) as Match[],
  };
}

export async function addMatch(
  score: Score[]
): Promise<ServiceResponse<boolean>> {
  const token = await getToken();
  if (!token) {
    return {
      status: 401,
      payload: false,
    };
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

  return {
    status: res.status,
    payload: res.ok,
  };
}

export async function removeMatch(
  matchId: string
): Promise<ServiceResponse<boolean>> {
  const token = await getToken();
  if (!token) {
    return {
      status: 401,
      payload: false,
    };
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

  return {
    status: res.status,
    payload: res.ok,
  };
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
