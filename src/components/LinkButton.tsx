import Link from "next/link";
import { ReactNode } from "react";

type LinkButtonProps = {
  children: ReactNode;
  href: string;
  classStyle?: string;
};

export default function LinkButton(props: LinkButtonProps) {
  const { classStyle = "clickable" } = props;
  return (
    <Link className={classStyle} href={props.href}>
      {props.children}
    </Link>
  );
}
