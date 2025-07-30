"use client";

import { useRouter } from "next/navigation";
import { usePickleContext } from "../context/PickleContext";
import { removeMatch } from "../service/pickleService";
import { Match, Player } from "../service/types";
import { pen, trashCanIco } from "../svg/svg";
import { ChangeEvent, useState } from "react";

export default function MatchManager() {
  const { matches, players, updateContent } = usePickleContext();
  const router = useRouter();
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [editingMatch, setEditingMatch] = useState<{
    id: string;
    score1: number;
    score2: number;
  }>();

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

  function handleEdit(m: Match, i: number): void {
    if (i !== selectedIndex) {
      setSelectedIndex(i);
      setEditingMatch({
        id: m.id,
        score1: m.score[0].points,
        score2: m.score[1].points,
      });
    } else {
      setSelectedIndex(-1);
      setEditingMatch(undefined);
    }
  }

  function onScoreEditChange(e: ChangeEvent<HTMLInputElement>) {
    if (!editingMatch) {
      return;
    }
    const { name, value } = e.target;
    setEditingMatch((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        [name]: value,
      };
    });
  }

  function saveMatch(){
    
  }

  return (
    <div>
      <div className="overflow-auto h-[500px] border border-white">
        {matches.map((m, i) => {
          const [a, b] = m.score;
          return (
            <div
              key={m.id}
              className="flex justify-between border border-white p-2 px-4"
            >
              <span>{new Date(m.date).toLocaleDateString()}</span>
              <span className="flex gap-3">
                <span>
                  <span className="flex">
                    {getPlayer(a.id, players).name}-
                    {selectedIndex === i ? (
                      <input
                        onChange={onScoreEditChange}
                        name="score1"
                        className="bg-white w-10 text-center text-black"
                        type="number"
                        value={editingMatch?.score1 ?? 0}
                      ></input>
                    ) : (
                      <span>{a.points}</span>
                    )}
                  </span>
                </span>
                <span>
                  <span>{getPlayer(b.id, players).name}-</span>
                  {selectedIndex === i ? (
                    <input
                      onChange={onScoreEditChange}
                      name="score2"
                      className="bg-white w-10 text-center text-black"
                      type="number"
                      value={editingMatch?.score2 ?? 0}
                    ></input>
                  ) : (
                    <span>{a.points}</span>
                  )}
                </span>
              </span>
              <button
                className="w-4 h-4 text-white cursor-pointer"
                onClick={() => handleEdit(m, i)}
              >
                {pen}
              </button>
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
      {editingMatch && <button onClick={saveMatch}>Save</button>}
    </div>
  );
}

function getPlayer(id: string, players: Player[]) {
  return players.find((p) => p.id === id)!;
}
