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
    const pRes = await getPlayers();
    const mRes = await getMatches();

    if (pRes.status === 401 || mRes.status === 401) {
      router.push("/login");
    }

    if (pRes.status === 200 && mRes.status === 200) {
      setPlayers(pRes.payload);
      setMatches(mRes.payload);
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
