"use client";

import { useState } from "react";
import { actualHamburgerIco } from "../svg/svg";

import Link from "next/link";
import { RouteLink } from "../routes/routes";
import { usePathname } from "next/navigation";
import Image from "next/image";

type BurgerMenuProps = {
  links: RouteLink[];
};

export default function BurgerMenu(props: BurgerMenuProps) {
  const { links } = props;
  const [open, setOpen] = useState(false);

  const pathname = usePathname();

  return (
    <div>
      <button className="p-4 reverse-shadow rounded-sm" onClick={() => setOpen(!open)}>
        <Image src={"hamburgerIcon.svg"} alt={""} width={100} height={100}/>
      </button>
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-64 z-50 transform transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "-translate-x-full"
        } shadow-lg`}
      >
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold">Menu</h2>
        </div>
        <nav className="p-4 space-y-4 flex flex-col">
          {links.map((l) => (
            <Link key={l.text + l.path} href={l.path}>
              <span
                onClick={() => {
                  if (pathname === l.path) {
                    setOpen(false);
                  }
                }}
              >
                {l.text}
              </span>
            </Link>
          ))}
          <button
            className="w-fit"
            onClick={() => {
              setOpen(false);
            }}
          >
            Close
          </button>
        </nav>
      </div>
    </div>
  );
}
