import { useEffect, useState } from "react";
import { usePickleContext } from "../context/PickleContext";
import Logo from "./Logo";

export default function HomePageView() {
  const { matches } = usePickleContext();

  const [matchesPlayed, setMatchesPlayed] = useState(0);
  const [pointsScored, setPointsScored] = useState(0);

  useEffect(() => {
    const duration = 5000;
    const start = Date.now();
    const totalMatches = matches.length;
    const totalPoints = matches.reduce(
      (sum, m) => sum + m.score[0].points + m.score[1].points,
      0
    );

    const animate = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);

      setMatchesPlayed(Math.floor(progress * totalMatches));
      setPointsScored(Math.floor(progress * totalPoints));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  }, [matches]);

  return (
    <div
      style={{ fontFamily: "var(--font-dancing-script)" }}
      className="flex flex-col justify-start items-center gap-50 h-full pt-10"
    >
      <div className="flex justify-around w-full">
        <div className="flex flex-col text-2xl text-center">
          <span className="text-nowrap">Matches Played</span>
          <span>{matchesPlayed}</span>
        </div>
        <div className="flex flex-col text-2xl text-center">
          <span className="text-nowrap">Points Scored</span>
          <span>{[pointsScored]}</span>
        </div>
      </div>
      <div className="flex gap-2">
        <div className="flex w-20 h-20 relative scale-x-[-1]">
          <Logo />
        </div>
        <span className="text-6xl text-center">THE PICKLE</span>
        <div className="flex w-20 h-20 relative">
          <Logo />
        </div>
      </div>
    </div>
  );
}
