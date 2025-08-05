"use client";

import HomePageView from "../components/HomePage";
import { PickleProvider } from "../context/PickleContext";

export default function Home() {
  return (
    <PickleProvider>
      <HomePageView />
    </PickleProvider>
  );
}
