"use client";

import { useEffect, useState } from "react";
import { Match, Player } from "../service/types";
import CollapsibleMenu from "./CollapsibleMenu";

type MatchListProps = {
  player1: Player;
  player2: Player;
  matches: Match[];
};

export default function MatchList(props: MatchListProps) {
  const { player1, player2, matches } = props;

  const [p1Wins, setP1Wins] = useState(0);
  const [p2Wins, setP2Wins] = useState(0);
  const [p1BestStreak, setP1BestStreak] = useState(0);
  const [p1Points, setP1Points] = useState(0);
  const [p2Points, setP2Points] = useState(0);
  const [p2BestStreak, setP2BestStreak] = useState(0);

  const [bestMatch, setBestMatch] = useState<Match>();
  const [worstMatch, setWorstMatch] = useState<Match>();
  const [sharedMatches, setSharedMatches] = useState<Match[]>([]);

  useEffect(() => {
    //reset state
    setBestMatch(undefined);
    setWorstMatch(undefined);
    setP1Wins(0);
    setP2Wins(0);
    setP1Points(0);
    setP2Points(0);
    setP1BestStreak(0);
    setP2BestStreak(0);

    let bestPointDiff = Number.MAX_SAFE_INTEGER;
    let worstPointDiff = Number.MIN_SAFE_INTEGER;

    let p1Best = 0;
    let p1CurrStreak = 0;
    let p2Best = 0;
    let p2CurrStreak = 0;

    const releventMatches = matches.filter((m) => {
      const [a, b] = m.score;
      return (
        [a.id, b.id].includes(player1.id) && [a.id, b.id].includes(player2.id)
      );
    });

    releventMatches.forEach((m) => {
      const [a, b] = m.score;

      const p1Points = a.id === player1.id ? a.points : b.points;
      const p2Points = a.id === player2.id ? a.points : b.points;

      if (p1Points > p2Points) {
        setP1Wins((prev) => prev + 1);
        p1CurrStreak++;
        p1Best = Math.max(p1Best, p1CurrStreak);
        p2CurrStreak = 0;
      } else {
        setP2Wins((prev) => prev + 1);
        p2CurrStreak++;
        p2Best = Math.max(p2Best, p2CurrStreak);
        p1CurrStreak = 0;
      }

      setP1Points((prev) => prev + p1Points);
      setP2Points((prev) => prev + p2Points);

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

    setSharedMatches(releventMatches.sort((a, b) => b.date - a.date));
    setP1BestStreak(p1Best);
    setP2BestStreak(p2Best);
  }, [matches, player1, player2]);

  return (
    <div className="flex flex-col gap-5 w-full">
      <div className="flex justify-around text-5xl">
        <span>{p1Wins}</span>
        <span>{p2Wins}</span>
      </div>
      <div className="flex justify-around text-5xl">
        <span>{`(${p1Points})`}</span>
        <span>{`(${p2Points})`}</span>
      </div>
      <div className="flex flex-col gap-2 w-full">
        <CollapsibleMenu
          items={[
            {
              title: "All Matches",
              node: (
                <div className="flex-1 overflow-y-scroll h-70 border border-white">
                  {sharedMatches.map((sm) => (
                    <MatchView key={sm.id} m={sm} p1={player1} p2={player2} />
                  ))}
                </div>
              ),
            },
            {
              title: "Extras",
              node: (
                <>
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
                  <div className="flex justify-around">
                    <div>{player1.name + " best streak: " + p1BestStreak}</div>
                    <div>
                      <div>
                        {player2.name + " best streak: " + p2BestStreak}
                      </div>
                    </div>
                  </div>
                </>
              ),
            },
          ]}
        ></CollapsibleMenu>
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
