"use client";

import { usePickleContext } from "../context/PickleContext";
import { Match, Player } from "../service/types";

export default function PlayerView() {
  const { players, matches } = usePickleContext();

  const prs = getPlayerRecords(players, matches);

  return (
      <table className="border-separate border-spacing-4 text-center border border-white">
        <thead>
          <tr>
            <th>Name</th>
            <th>Wins</th>
            <th>Losses</th>
            <th>PF</th>
            <th>PA</th>
          </tr>
        </thead>
        <tbody>
          {prs.map((pr) => (
            <tr key={pr.player.id}>
              <td>{pr.player.name}</td>
              <td>{pr.wins}</td>
              <td>{pr.losses}</td>
              <td>{pr.pf}</td>
              <td>{pr.pa}</td>
            </tr>
          ))}
        </tbody>
      </table>
  );
}

type PlayerRecord = {
  player: Player;
  wins: number;
  losses: number;
  pf: number;
  pa: number;
};
function getPlayerRecords(players: Player[], matches: Match[]) {
  const prs = players.map((p) => {
    return {
      player: p,
      wins: 0,
      losses: 0,
      pf: 0,
      pa: 0,
    } as PlayerRecord;
  });

  for (const m of matches) {
    const p1 = m.score[0];
    const p2 = m.score[1];

    const pr1 = prs.find((pr) => pr.player.id === p1.id)!;
    const pr2 = prs.find((pr) => pr.player.id === p2.id)!;

    if (p1.points > p2.points) {
      pr1.wins++;
      pr2.losses++;
    } else {
      pr1.losses++;
      pr2.wins++;
    }

    pr1.pf += p1.points;
    pr1.pa += p2.points;

    pr2.pf += p2.points;
    pr2.pa += p1.points;
  }

  return prs;
}
