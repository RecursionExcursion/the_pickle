"use client";

import { Player } from "../service/types";

type PlayerSelectProps = {
  title?: string;
  playerName: string | undefined;
  setPlayerName: (S: string) => void;
  playerList: Player[];
};

export function PlayerSelect(props: PlayerSelectProps) {
  const { title, playerName, setPlayerName, playerList } = props;
  return (
    <div className="flex justify-around text-xl items-center text-[var(--text-color)]">
      <span className="text-md font-medium ">
        {title}
      </span>
      <select
        name="PlayerSelect"
        className="mt-0.5 w-40 h-15 rounded border-gray-300 shadow-sm dark:border-gray-800 bg-[var(--color-secondary)] dark:text-white text-center"
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
