import { useState } from "react";
import { chevDown, chevUp } from "../svg/svg";

type MenuItem = {
  title: string;
  node: React.ReactNode;
};

type CollapsibleMenuProps = {
  items: MenuItem[];
};

export default function CollapsibleMenu(props: CollapsibleMenuProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [openIndex, setOpenIndex] = useState(0);

  const { items } = props;

  return (
    <div className="w-full flex flex-col gap-5">
      <div className="w-full flex justify-around">
        {items.map((it, i) => (
          <button
            className="flex gap-2 border border-white px-2 py-1"
            key={i + it.title}
            onClick={() => {
              if (i === openIndex && isOpen) {
                setIsOpen(false);
                return;
              }
              setOpenIndex(i);
              setIsOpen(true);
            }}
          >
            {it.title} {i === openIndex && isOpen ? chevUp : chevDown}
          </button>
        ))}
      </div>
      <div className={isOpen ? "block" : "hidden"}>{items[openIndex].node}</div>
    </div>
  );
}
