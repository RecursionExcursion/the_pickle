import { NextRequest, NextResponse } from "next/server";
import thePickle from "../the_pickle";
import { mw, mw_pipe } from "../mw";
import { Match, Score } from "../../../../service/types";
import { ApiCache } from "../cache";

const matchCache = new ApiCache<Match[]>([]);

export const POST = mw_pipe(...mw)(async (r: NextRequest) => {
  const { date = Date.now(), score } = (await r.json()) as {
    date?: number;
    score: Score[];
  };
  const { payload: data, status } = await thePickle.matches.create(date, score);

  if (data) {
    matchCache.invalidate();
  }

  return NextResponse.json(data, { status: status });
});

export const GET = mw_pipe(...mw)(async () => {
  if (matchCache.isValid()) {
    return NextResponse.json(matchCache.data, { status: 200 });
  }

  const matches = await thePickle.matches.get();

  if (matches.payload) {
    matchCache.set(matches.payload);
  }

  return NextResponse.json(matches.payload, { status: 200 });
});

export const DELETE = mw_pipe(...mw)(async (r: NextRequest) => {
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
