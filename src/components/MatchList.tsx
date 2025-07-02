"use client";

import { useEffect, useState } from "react";
import { Match, Player } from "../service/types";

type MatchListProps = {
  player1: Player;
  player2: Player;
  matches: Match[];
};

export default function MatchList(props: MatchListProps) {
  const { player1, player2, matches } = props;

  const [bestMatch, setBestMatch] = useState<Match>();
  const [worstMatch, setWorstMatch] = useState<Match>();
  const [sharedMatches, setSharedMatches] = useState<Match[]>([]);

  useEffect(() => {
    setBestMatch(undefined);
    setWorstMatch(undefined);

    let bestPointDiff = Number.MAX_SAFE_INTEGER;
    let worstPointDiff = Number.MIN_SAFE_INTEGER;

    const releventMatches = matches.filter((m) => {
      const [a, b] = m.score;
      return (
        [a.id, b.id].includes(player1.id) && [a.id, b.id].includes(player2.id)
      );
    });

    releventMatches.forEach((m) => {
      const [a, b] = m.score;
      const scoreDiff = Math.abs(a.points - b.points);

      if (scoreDiff < bestPointDiff) {
        bestPointDiff = scoreDiff;
        setBestMatch(m);
      }

      if (scoreDiff > worstPointDiff) {
        worstPointDiff = scoreDiff;
        setWorstMatch(m);
      }
    });

    setSharedMatches(releventMatches);
  }, [matches, player1, player2]);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <div>
          {bestMatch && (
            <div>
              An Instant Classic:
              <MatchView m={bestMatch} p1={player1} p2={player2} />
            </div>
          )}
        </div>
        <div>
          {worstMatch && (
            <div>
              A Dogwalking:{" "}
              <MatchView m={worstMatch} p1={player1} p2={player2} />
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col justify-center items-center">
        <h3>Matches</h3>
        <div>
          {sharedMatches.map((sm) => (
            <MatchView key={sm.id} m={sm} p1={player1} p2={player2} />
          ))}
        </div>
      </div>
    </div>
  );
}

type MatchViewProps = {
  p1: Player;
  p2: Player;
  m: Match;
};

function MatchView(props: MatchViewProps) {
  const { m, p1, p2 } = props;

  const player1 = getPlayerData(p1, m);
  const player2 = getPlayerData(p2, m);

  return (
    <div className="border border-white p-2">
      <div className="flex gap-10 justify-center">
        <span>{new Date(m.date).toLocaleDateString()}</span>
        <span
          className={`${
            (player1?.points ?? 0) > (player2?.points ?? 0) && "text-yellow-300"
          }`}
        >
          {getPlayerName(p1.id, p1, p2)}-{player1?.points}
        </span>
        <span
          className={`${
            (player1?.points ?? 0) < (player2?.points ?? 0) && "text-yellow-300"
          }`}
        >
          {getPlayerName(p2.id, p1, p2)}-{player2?.points}
        </span>
      </div>
    </div>
  );
}

function getPlayerData(p: Player, m: Match) {
  const [a, b] = m.score;

  if (a.id === p.id) {
    return a;
  }

  if (b.id === p.id) {
    return b;
  }
}

function getPlayerName(pId: string, p1: Player, p2: Player) {
  if (pId === p1.id) {
    return p1.name;
  } else if (pId === p2.id) {
    return p2.name;
  }
}
