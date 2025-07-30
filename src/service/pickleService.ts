import { Match, Score } from "./types";

// type ServiceResponse<T> = {
//   status: number;
//   payload: T;
// };

const playersRoute = "api/the-pickle/players";
const matchesRoute = "api/the-pickle/matches";

// const playersCacheTag = "players";
// const matchesCacheTag = "matches";

// export async function invalidatePlayers() {
//   revalidateTag(playersCacheTag);
// }

// export async function invalidateMatches() {
//   revalidateTag(matchesCacheTag);
// }

export async function getPlayers() {
  return await fetch(playersRoute, {
    cache: "no-store",
  });
}

export async function getMatches() {
  return await fetch(matchesRoute, {
    cache: "no-store",
  });
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

  return await fetch(matchesRoute, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

export async function updateMatch(match: Match) {
  return await fetch(matchesRoute, {
    method: "PUT",
    body: JSON.stringify(match),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function removeMatch(matchId: string) {
  const payload = {
    id: matchId,
  };

  return await fetch(matchesRoute, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}
