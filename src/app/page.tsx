"use client";

import Logo from "../components/Logo";
import { PickleProvider } from "../context/PickleContext";

export type View = "home" | "add" | "head" | "players" | "manage";

export default function Home() {
  return (
    <PickleProvider>
      <div className="flex justify-center items-center gap-2 h-full mb-24">
        <div className="flex w-24 h-24 relative scale-x-[-1]">
          <Logo />
        </div>
        <span
          style={{ fontFamily: "var(--font-dancing-script)" }}
          className="text-6xl text-center"
        >
          THE PICKLE
        </span>
        <div className="flex w-24 h-24 relative">
          <Logo />
        </div>
      </div>
    </PickleProvider>
  );
}
