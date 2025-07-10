"use client";

import HomePageView from "../components/HomePage";
import { PickleProvider } from "../context/PickleContext";

export type View = "home" | "add" | "head" | "players" | "manage";

export default function Home() {
  return (
    <PickleProvider>
      <HomePageView />
    </PickleProvider>
  );
}
