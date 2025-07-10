"use server";

import { redirect } from "next/navigation";
import { Match, Player, Score } from "./types";

const pickleRoute = process.env.PICKLE_API;

if (!pickleRoute) {
  throw Error("API route not found in env");
}

type Token = string | null;

const redirectToLogin = () => redirect("/login");

export async function getPlayers(token: Token) {
  if (!token) redirectToLogin();

  const res = await fetch(pickleRoute + "/player", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (res.ok) {
    return (await res.json()) as Player[];
  } else {
    redirectToLogin();
  }
}

export async function getMatches(token: Token) {
  if (!token) redirectToLogin();

  const res = await fetch(pickleRoute + "/match", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (res.ok) {
    return (await res.json()) as Match[];
  } else {
    redirectToLogin();
  }
}

export async function addMatch(score: Score[], token: Token) {
  if (!token) redirectToLogin();

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
}

export async function removeMatch(matchId: string, token: Token) {
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

  console.log({ res });
}

export async function login(un: string, pw: string): Promise<string | null> {
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
  console.log({ un, pw });
  console.log(res);

  if (res.ok) {
    const token = await res.json();
    console.log(token);
    return token;
  }
  return null;
}
