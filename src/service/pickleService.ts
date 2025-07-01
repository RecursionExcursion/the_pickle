"use server";

import { Match, Player, Score } from "./types";

const pickleRoute = process.env.PICKLE_API;
if (!pickleRoute) {
  throw Error("API route not found in env");
}

export async function getPlayers() {
  const res = await fetch(pickleRoute + "/player");
  if (res.ok) {
    return (await res.json()) as Player[];
  }
}

export async function getMatches() {
  const res = await fetch(pickleRoute + "/match");
  if (res.ok) {
    return (await res.json()) as Match[];
  }
}

export async function addMatch(score: Score[]) {
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
    },
    body: JSON.stringify(payload),
  });
}
export async function removeMatch(matchId: string) {
  const payload = {
    id: matchId,
  };

  const res =await fetch(pickleRoute + "/match", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  console.log({res});
  
}
