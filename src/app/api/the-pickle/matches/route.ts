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
