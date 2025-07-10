import Link from "next/link";
import { ReactNode } from "react";

type LinkButtonProps = {
  children: ReactNode;
  href: string;
};

export default function LinkButton(props: LinkButtonProps) {
  return (
    <Link
      className="text-center border border-white w-full"
      href={props.href}
    >
      {props.children}
    </Link>
  );
}
