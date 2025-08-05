import { NextRequest, NextResponse } from "next/server";
import thePickle from "../the-pickle";
import { authChain, mw_pipe } from "../mw";
import { Match, Score } from "../../../../service/types";
import { ApiCache } from "../cache";

const matchCache = new ApiCache<Match[]>([]);

export const POST = mw_pipe(...authChain)(async (r: NextRequest) => {
  const { date = Date.now(), score } = (await r.json()) as {
    date?: number;
    score: Score[];
  };
  //TODO Validate match
  const res = await thePickle.matches.create(date, score);

  if (res.ok()) {
    matchCache.invalidate();
  }

  return NextResponse.json(res.payload, { status: res.status });
});

export const GET = mw_pipe(...authChain)(async () => {
  if (matchCache.isValid()) {
    return NextResponse.json(matchCache.get(), { status: 200 });
  }

  const res = await thePickle.matches.get();

  if (res.ok()) {
    matchCache.set(res.payload);
  }

  return NextResponse.json(res.payload, { status: res.status });
});

export const PUT = mw_pipe(...authChain)(async (r: NextRequest) => {
  const match = (await r.json()) as Match;

  const isValid = matchValidation(match);
  if (!isValid) {
    return new NextResponse(null, { status: 400 });
  }

  const res = await thePickle.matches.update(match);

  if (res.ok()) {
    matchCache.invalidate();
  }

  return NextResponse.json(null, { status: res.status });
});

export const DELETE = mw_pipe(...authChain)(async (r: NextRequest) => {
  const { id } = (await r.json()) as {
    id: string;
  };

  if (!id) {
    return new NextResponse(null, { status: 400 });
  }

  const res = await thePickle.matches.delete(id);
  if (res.ok()) {
    matchCache.invalidate();
  }
  return new NextResponse(null, { status: res.status });
});

function matchValidation(m: Match) {
  if (!m) return false;

  const validId = typeof m.id === "string";
  const validDate = typeof m.date === "number";
  const validScore =
    m.score && typeof m.score === "object" && m.score.length === 2;

  // p1
  const validP1Id = typeof m.score[0].id === "string";
  const validP1Points = typeof m.score[0].points === "number";

  const validP2Id = typeof m.score[1].id === "string";
  const validP2Points = typeof m.score[1].points === "number";

  const validP1 = validP1Id && validP1Points;
  const validP2 = validP2Id && validP2Points;

  return validId && validDate && validScore && validP1 && validP2;
}
