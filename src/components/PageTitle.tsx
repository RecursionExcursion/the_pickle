import { ReactNode } from "react";

export default function PageTitle(props: { children: ReactNode }) {
  return (
    <h2
      className="text-center text-4xl"
      style={{ fontFamily: "var(--font-dancing-script)" }}
    >
      {props.children}
    </h2>
  );
}
