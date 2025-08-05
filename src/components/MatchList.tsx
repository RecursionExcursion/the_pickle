"use client";

import { useMemo } from "react";
import { Match, Player } from "../service/types";
import CollapsibleMenu from "./CollapsibleMenu";

type MatchListProps = {
  player1: Player;
  player2: Player;
  matches: Match[];
};

export default function MatchList(props: MatchListProps) {
  const { player1, player2, matches } = props;

  const stats = useMemo(() => {
    type PStats = {
      player: Player;
      wins: number;
      points: number;
      streak: Streak;
    };

    const p1Stats: PStats = {
      player: player1,
      wins: 0,
      points: 0,
      streak: new Streak(player1.id),
    };
    const p2Stats: PStats = {
      player: player2,
      wins: 0,
      points: 0,
      streak: new Streak(player2.id),
    };

    let bestMatch: Match | undefined;
    let worstMatch: Match | undefined;
    let bestPointsScored = -1;
    let worstPointDiff = Number.MIN_SAFE_INTEGER;

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
        p1Stats.wins++;
        p1Stats.streak.inc();
        p2Stats.streak.reset();
      } else {
        p2Stats.wins++;
        p2Stats.streak.inc();
        p1Stats.streak.reset();
      }
      p1Stats.points += p1Points;
      p2Stats.points += p2Points;

      const accPoints = p1Points + p2Points;
      const scoreDiff = Math.abs(a.points - b.points);
      if (accPoints > bestPointsScored) {
        bestPointsScored = accPoints;
        bestMatch = m;
      }

      if (scoreDiff > worstPointDiff) {
        worstPointDiff = scoreDiff;
        worstMatch = m;
      }
    });

    const sharedMatches = releventMatches.sort((a, b) => b.date - a.date);

    return {
      p1Stats,
      p2Stats,
      sharedMatches,
      bestMatch,
      worstMatch,
    };
  }, [player1, player2, matches]);

  return (
    <div className="flex flex-col gap-5 w-full">
      <div className="flex justify-around text-5xl">
        <span>{stats.p1Stats.wins}</span>
        <span>{stats.p2Stats.wins}</span>
      </div>
      <div className="flex justify-around text-5xl">
        <span>{`(${stats.p1Stats.points})`}</span>
        <span>{`(${stats.p2Stats.points})`}</span>
      </div>
      <div className="flex flex-col gap-2 w-full">
        <CollapsibleMenu
          items={[
            {
              title: "All Matches",
              node: (
                <div className="flex-1 overflow-y-scroll h-70 border border-white">
                  {stats.sharedMatches.map((sm) => (
                    <MatchView key={sm.id} m={sm} p1={player1} p2={player2} />
                  ))}
                </div>
              ),
            },
            {
              title: "Extras",
              node: (
                <div>
                  <div>
                    {stats.bestMatch && (
                      <div>
                        Instant Classic:
                        <MatchView
                          m={stats.bestMatch}
                          p1={player1}
                          p2={player2}
                        />
                      </div>
                    )}
                  </div>
                  <div>
                    {stats.worstMatch && (
                      <div>
                        Ass Beating:
                        <MatchView
                          m={stats.worstMatch}
                          p1={player1}
                          p2={player2}
                        />
                      </div>
                    )}
                  </div>
                  Streaks:
                  <div className="border border-white p-2 text-nowrap text-center">
                    <div>
                      {`Current streak: ${
                        stats.p1Stats.streak.current
                          ? stats.p1Stats.player.name
                          : stats.p2Stats.player.name
                      }: ${
                        stats.p1Stats.streak.current
                          ? stats.p1Stats.streak.current
                          : stats.p2Stats.streak.current
                      }`}
                    </div>
                  </div>
                  <div className="border border-white p-2 text-nowrap text-center">
                    <span className="font-bold">{player1.name}</span>
                    <span>{" best streak: " + stats.p1Stats.streak.best}</span>
                  </div>
                  <div className="border border-white p-2 text-nowrap text-center">
                    <span className="font-bold">{player2.name}</span>
                    <span>{" best streak: " + stats.p2Stats.streak.best}</span>
                  </div>
                </div>
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

class Streak {
  id: string;
  current: number = 0;
  best: number = 0;
  constructor(id: string) {
    this.id = id;
  }
  reset() {
    this.current = 0;
  }
  inc() {
    this.current++;
    if (this.current > this.best) {
      this.best = this.current;
    }
  }
}
