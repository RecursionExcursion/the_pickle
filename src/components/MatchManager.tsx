"use client";

import { useRouter } from "next/navigation";
import { usePickleContext } from "../context/PickleContext";
import { removeMatch } from "../service/pickleService";
import { Player } from "../service/types";
import { trashCanIco } from "../svg/svg";

export default function MatchManager() {
  const { matches, players, updateContent } = usePickleContext();
  const router = useRouter();

  async function handleDelete(id: string) {
    const confirmed = confirm("Are you sure you want to delete this match?");
    if (confirmed) {
      const removeMatchRes = await removeMatch(id);

      if (removeMatchRes.status === 401) {
        router.push("/login");
        return;
      }

      if (removeMatchRes.ok) {
        await updateContent();
      }
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
