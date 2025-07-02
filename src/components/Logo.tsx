"use client";

import Image from "next/image";

type LogoProps = {
  className?: string;
};

export default function Logo(props: LogoProps) {
  return (
    <Image
      className={props.className}
      //   style={{
      //     // position: "relative",
      //     width: "100%",
      //     aspectRatio: "4 / 5",
      //     objectFit: "cover",
      //   }}
      src={"/pickleball_pickle.png"}
      alt="pickle playing pickleball"
      fill
    />
  );
}
