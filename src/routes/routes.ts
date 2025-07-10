export type RouteLink = {
  text: string;
  path: string;
};

export const routeLinks: RouteLink[] = [
  {
    text: "Home",
    path: "/",
  },
  {
    text: "Players",
    path: "/players",
  },
  {
    text: "Add Match",
    path: "/addMatch",
  },
  {
    text: "H2H",
    path: "/h2h",
  },
  {
    text: "Manage Matches",
    path: "/matches",
  },
  {
    text: "Logout",
    path: "/logout",
  },
];
