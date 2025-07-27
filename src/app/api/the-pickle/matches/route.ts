import { NextRequest, NextResponse } from "next/server";
import thePickle from "../the_pickle";
import { mw, mw_pipe } from "../mw";
import { Match, Score } from "../../../../service/types";

const oneDayInMs = 24 * 60 * 60 * 1000;

const matchCache: {
  date: number;
  matches: Match[];
} = { date: 0, matches: [] };

export const POST = mw_pipe(...mw)(async (r: NextRequest) => {
  const { date = Date.now(), score } = (await r.json()) as {
    date?: number;
    score: Score[];
  };
  const success = await thePickle.matches.create(date, score);
  return NextResponse.json(success, { status: 200 });
});

export const GET = mw_pipe(...mw)(async () => {
  if (matchCache.date + oneDayInMs > Date.now()) {
    return NextResponse.json(matchCache.matches, { status: 200 });
  }

  console.log("Matches route");
  const matches = await thePickle.matches.get();

  if (matches.data) {
    matchCache.date = Date.now();
    matchCache.matches = matches.data;
  }

  return NextResponse.json(matches.data, { status: 200 });
});

export const DELETE = mw_pipe(...mw)(async (r: NextRequest) => {
  const { id } = (await r.json()) as {
    id: string;
  };

  if (!id) {
    return new NextResponse(null, { status: 400 });
  }

  const res = await thePickle.matches.delete(id);

  return new NextResponse(null, { status: res.status });
});
