export const trashCanIco = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 448 512"
    fill="currentColor"
  >
    <path d="M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z" />
  </svg>
);

export const hamburgerIco = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-menu-icon lucide-menu"
  >
    <path d="M4 12h16" />
    <path d="M4 18h16" />
    <path d="M4 6h16" />
  </svg>
);

export const actualHamburgerIco = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-hamburger-icon lucide-hamburger"
  >
    <path d="M12 16H4a2 2 0 1 1 0-4h16a2 2 0 1 1 0 4h-4.25" />
    <path d="M5 12a2 2 0 0 1-2-2 9 7 0 0 1 18 0 2 2 0 0 1-2 2" />
    <path d="M5 16a2 2 0 0 0-2 2 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 2 2 0 0 0-2-2q0 0 0 0" />
    <path d="m6.67 12 6.13 4.6a2 2 0 0 0 2.8-.4l3.15-4.2" />
  </svg>
);

export const chevDown = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-chevron-down-icon lucide-chevron-down"
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
);

export const chevUp = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-chevron-up-icon lucide-chevron-up"
  >
    <path d="m18 15-6-6-6 6" />
  </svg>
);

export const pen = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-pen-icon lucide-pen"
  >
    <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
  </svg>
);

const strokeWidth1 = .5;
const strokeWidth2 = 1;

export const courtSvg = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="100%"
    height="100%"
    viewBox="0 0 20 44"
    fill="none"
    stroke="black"
  >
    {/* Horz */}
    <line
      x1="0"
      y1="0"
      x2="20"
      y2="0"
      stroke="white"
      strokeWidth={strokeWidth1}
    />
    <line
      x1="0"
      y1="44"
      x2="20"
      y2="44"
      stroke="white"
      strokeWidth={strokeWidth1}
    />
    {/* Vert */}
    <line
      x1="20"
      y1="44"
      x2="20"
      y2="0"
      stroke="white"
      strokeWidth={strokeWidth2}
    />
    <line
      x1="0"
      y1="0"
      x2="0"
      y2="44"
      stroke="white"
      strokeWidth={strokeWidth2}
    />

    {/* Center line */}
    <line
      x1="0"
      y1="22"
      x2="20"
      y2="22"
      stroke="gray"
      strokeWidth={strokeWidth1}
    />
    {/*  kitchen */}
    <line
      x1="0"
      y1="29"
      x2="20"
      y2="29"
      stroke="white"
      strokeWidth={strokeWidth1}
    />
    <line
      x1="0"
      y1="15"
      x2="20"
      y2="15"
      stroke="white"
      strokeWidth={strokeWidth1}
    />

    {/* Center back lines */}
    <line
      x1="10"
      y1="0"
      x2="10"
      y2="15"
      stroke="white"
      strokeWidth={strokeWidth1}
    />
    <line
      x1="10"
      y1="29"
      x2="10"
      y2="44"
      stroke="white"
      strokeWidth={strokeWidth1}
    />
  </svg>
);

export const ballSvg = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="100%"
    height="100%"
    viewBox="40 40 20 20"
    fill="none"
  >
    {/* Ball */}
    <circle cx="50" cy="50" r="10" fill="#e0ef00" />
    {/* Holes */}
    {/* Center Hole */}
    <circle cx="50" cy="50" r="2" fill="#c3d300" stroke="none" />
    
    <circle cx="55" cy="55" r="2" fill="#c3d300" stroke="none" />
    <circle cx="45" cy="45" r="2" fill="#c3d300" stroke="none" />

    <circle cx="55" cy="45" r="2" fill="#c3d300" stroke="none" />
    <circle cx="45" cy="55" r="2" fill="#c3d300" stroke="none" />
  </svg>
);
