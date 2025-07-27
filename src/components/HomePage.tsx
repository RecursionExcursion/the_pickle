import { useEffect, useState } from "react";
import { usePickleContext } from "../context/PickleContext";

export default function HomePageView() {
  const { matches } = usePickleContext();

  const [matchesPlayed, setMatchesPlayed] = useState(0);
  const [pointsScored, setPointsScored] = useState(0);

  useEffect(() => {
    const duration = 1500;
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
      className="relative reverse-shadow rounded-sm flex flex-col justify-start items-center gap-[50px] h-full pt-10 bg-cover bg-no-repeat bg-center"
      style={{
        fontFamily: "var(--font-dancing-script)",
        backgroundImage: "url('/pickles_plauing_pickle.gif')",
      }}
    >
      <div className="flex justify-around w-full">
        <div className="flex flex-col text-2xl text-center text-black font-bold">
          <span className="text-nowrap">Matches Played</span>
          <span>{matchesPlayed}</span>
        </div>
        <div className="flex flex-col text-2xl text-center text-black">
          <span className="text-nowrap">Points Scored</span>
          <span>{[pointsScored]}</span>
        </div>
      </div>
    </div>
  );
}
