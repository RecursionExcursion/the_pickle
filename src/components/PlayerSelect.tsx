"use client";

import { Player } from "../service/types";

type PlayerSelectProps = {
  title?: string;
  playerName: string;
  setPlayerName: (S: string) => void;
  playerList: Player[];
};

export function PlayerSelect(props: PlayerSelectProps) {
  const { title, playerName, setPlayerName, playerList } = props;
  return (
    <div className="flex gap-3">
      {title ?? <span>{title}</span>}
      <select
        className="bg-white text-black px-2 py-1"
        value={playerName}
        onChange={(e) => setPlayerName(e.target.value)}
      >
        <option value={undefined}>Select a player</option>
        {playerList.map((plyr) => (
          <option key={plyr.id} value={plyr.id}>
            {plyr.name}
          </option>
        ))}
      </select>
    </div>
  );
}
