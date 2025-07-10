"use client";

import { usePickleContext } from "../context/PickleContext";
import { emitter } from "../lib/eventEmiter";
import { removeMatch } from "../service/pickleService";
import {  Player } from "../service/types";
import { trashCanIco } from "../svg/svg";

export default function MatchManager() {
  const { matches, players } = usePickleContext();

  async function handleDelete(id: string) {
    const ok = confirm("Are you sure you want to delete this match?");
    if (ok) {
      await removeMatch(id);
      emitter.emit("update");
    }
  }

  return (
    <div>
      {matches.map((m) => {
        const [a, b] = m.score;

        return (
          <div
            key={m.id}
            className="flex justify-between border border-white p-2 px-4"
          >
            <span>{new Date(m.date).toLocaleDateString()}</span>
            <span className="flex gap-3">
              <span>
                {getPlayer(a.id, players).name}-{a.points}
              </span>
              <span>
                {getPlayer(b.id, players).name}-{b.points}
              </span>
            </span>
            <button
              className="w-4 h-4 text-red-500 cursor-pointer"
              onClick={() => handleDelete(m.id)}
            >
              {trashCanIco}
            </button>
          </div>
        );
      })}
    </div>
  );
}

function getPlayer(id: string, players: Player[]) {
  return players.find((p) => p.id === id)!;
}
