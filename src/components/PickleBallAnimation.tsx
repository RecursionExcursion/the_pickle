"use client";

import { useEffect, useRef } from "react";
import { ballSvg, courtSvg } from "../svg/svg";

export default function PickleBallAnimation() {
  const ballRef = useRef<HTMLDivElement>(null);
  const courtRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    startAnimation();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function startAnimation() {
    setInterval(moveBall, 1000);
  }

  const moveBall = () => {
    const ball = ballRef.current;
    const court = courtRef.current;
    if (!ball || !court) return;

    //TODO calc top of ball and adjuct y coord
    //Maybe consider left side of ball too

    const courtRect = court.getBoundingClientRect();
    const ballRect = ball.getBoundingClientRect();

    const landingSpotX = courtRect.width * Math.random();
    let r = Math.random() / 2;
    if (ballRect.y < courtRect.y + courtRect.height / 2) r += 0.5;
    const landingSpotY = courtRect.height * r;

    ball.style.transition = "transform 1s ease";
    ball.style.transform = `translate(${landingSpotX.toFixed()}px, ${landingSpotY.toFixed()}px)`;
  };

  return (
    <div className="h-screen p-8 z-[-5] absolute bg-blue-500">
      <div ref={courtRef} className="h-full w-fit m-auto relative">
        {courtSvg}
        {/* <Court /> */}
        <div ref={ballRef} className="absolute top-0">
          <Ball />
        </div>
      </div>
      <div className="absolute w-full h-full bg-black opacity-90 top-0 left-0"></div>
    </div>
  );
}

function Ball() {
  return <div className="h-6 w-6">{ballSvg}</div>;
}
