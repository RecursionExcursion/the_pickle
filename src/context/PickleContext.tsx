"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Match, Player } from "../service/types";
import BurgerMenu from "../components/BurgerMenu";
import {
  getMatches,
  getPlayers,
  invalidateMatches,
  invalidatePlayers,
} from "../service/pickleService";
import { routeLinks } from "../routes/routes";
import { useRouter } from "next/navigation";

type PickleContextState = {
  players: Player[];
  matches: Match[];
  updateContent: () => Promise<void>;
};

export const PickleContext = createContext<PickleContextState>({
  players: [],
  matches: [],
  updateContent: async () => {},
});

type PickleProviderProps = {
  children: React.ReactNode;
};

export const PickleProvider = (props: PickleProviderProps) => {
  const router = useRouter();
  const [players, setPlayers] = useState<Player[]>();
  const [matches, setMatches] = useState<Match[]>();

  useEffect(() => {
    updateContent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function updateContent() {
    try {
      const p = await getPlayers();
      const m = await getMatches();
      setPlayers(p);
      setMatches(m);
    } catch (err) {
      if (err instanceof Error && err.message === "unauthorized") {
        if (err.message === "unauthorized") {
          router.push("/login");
        } else {
          alert(err.message);
        }
      }
    }
  }

  async function invalidateAndUpdateContent() {
    await invalidatePlayers();
    await invalidateMatches();
    await updateContent();
  }

  if (!players || !matches) {
    return null;
  }

  return (
    <PickleContext.Provider
      value={{
        players: players,
        matches: matches,
        updateContent: invalidateAndUpdateContent,
      }}
    >
      <div className="flex flex-col gap-5 p-4 h-screen">
        <BurgerMenu links={routeLinks} />
        {props.children}
      </div>
    </PickleContext.Provider>
  );
};

export const usePickleContext = () => useContext(PickleContext);
