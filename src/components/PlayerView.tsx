"use client";

import { Match, Player } from "../service/types";

type PlayerViewProps = {
  players: Player[];
  matches: Match[];
};


export default function PlayerView(props: PlayerViewProps) {
  const { players, matches } = props;
  
 const prs = getPlayerRecords(players, matches)
  
  return (
    <div className="flex flex-col justify-center items-center gap-2 pt-2 border border-white">
      {prs.map((pr) => (
        <div key={pr.player.id}>
          <span>
            {pr.player.name}={pr.wins}-{pr.losses} {`(${pr.pf})-(${pr.pa})`}
          </span>
        </div>
      ))}
    </div>
  );
}

type PlayerRecord = {
  player: Player;
  wins: number;
  losses: number;
  pf: number;
  pa: number;
};
function getPlayerRecords(players: Player[],matches: Match[]){
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

  return prs
}