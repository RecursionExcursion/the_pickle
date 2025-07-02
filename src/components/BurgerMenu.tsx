"use client";

import { useState } from "react";
import { actualHamburgerIco } from "../svg/svg";
import { View } from "../app/page";
import { emitter } from "../lib/eventEmiter";

export default function BurgerMenu() {
  const [open, setOpen] = useState(false);

  function selectMenuItem(view: View) {
    emitter.emit("menu", view);
    setOpen(false);
  }

  return (
    <div>
      <button className="scale-250" onClick={() => setOpen(!open)}>
        {actualHamburgerIco}
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
        <nav className="p-4 space-y-4">
          <button onClick={() => selectMenuItem("home")} className="block">
            Home
          </button>
          <button onClick={() => selectMenuItem("players")} className="block">
            Players
          </button>
          <button onClick={() => selectMenuItem("add")} className="block">
            Add Match
          </button>
          <button onClick={() => selectMenuItem("head")} className="block">
            H2H
          </button>
          <button onClick={() => selectMenuItem("manage")} className="block">
            Manage Matches
          </button>
          <button
            onClick={() => {
              setOpen(false);
            }}
            className="block"
          >
            Close
          </button>
        </nav>
      </div>
    </div>
  );
}
