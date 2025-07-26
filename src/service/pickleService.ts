import { Match, Player, Score } from "./types";

type ServiceResponse<T> = {
  status: number;
  payload: T;
};

const playersRoute = "api/the-pickle/players";
const matchesRoute = "api/the-pickle/matches";

const unauthorizedErrorMessage = "unauthorized";

// const playersCacheTag = "players";
// const matchesCacheTag = "matches";

// export async function invalidatePlayers() {
//   revalidateTag(playersCacheTag);
// }

// export async function invalidateMatches() {
//   revalidateTag(matchesCacheTag);
// }

export async function getPlayers(): Promise<ServiceResponse<Player[]>> {
  const res = await fetch(playersRoute, {
    // next: { tags: [playersCacheTag] },
  });

  return {
    status: res.status,
    payload: (await res.json()) as Player[],
  };
}

export async function getMatches(): Promise<ServiceResponse<Match[]>> {
  const res = await fetch(matchesRoute, {
    // next: { tags: [matchesCacheTag] },
  });

  return {
    status: res.status,
    payload: (await res.json()) as Match[],
  };
}

export async function addMatch(
  score: Score[]
): Promise<ServiceResponse<boolean>> {
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

  const res = await fetch(matchesRoute, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
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
  const payload = {
    id: matchId,
  };

  const res = await fetch(matchesRoute, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
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
