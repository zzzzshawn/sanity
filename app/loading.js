"use client";

import { PacmanLoader } from "react-spinners";
import { useTheme } from "next-themes";

export default function Pacman() {
  const { theme } = useTheme(); // Access current theme

  const loaderColor = theme === "dark" ? "white" : "black"; // Set color dynamically

  return (
    <div className="flex w-full h-screen justify-center items-center">
      <PacmanLoader color={loaderColor} />
    </div>
  );
}
