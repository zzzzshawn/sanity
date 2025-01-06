"use client";

import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";

import { Button } from "../components/ui/button";
import { useEffect } from "react";

const ThemeSwitcher = ({ onClick }) => {
  return (
    <Button
      className="group size-8 rounded-full hover:bg-transparent"
      variant="outline"
      size="icon"
      onClick={onClick}
    >
      <span className="sr-only">Switch Theme</span>
      <SunIcon className="size-[1.2rem] rotate-90 scale-0 transition-transform duration-500 ease-in-out group-hover:rotate-[30deg] dark:rotate-0 dark:scale-100" />
      <MoonIcon className="absolute size-[1.2rem] rotate-0 scale-100 transition-transform duration-500 ease-in-out hover:rotate-6 group-hover:rotate-[30deg] dark:-rotate-90 dark:scale-0" />
    </Button>
  );
};

export function ThemeModeToggle() {
  const { setTheme, theme, systemTheme } = useTheme();

  useEffect(() => {
    if (theme === "system" && systemTheme) {
      setTheme(systemTheme);
    }
  }, [theme, systemTheme]);

  return (
    <>
      {theme === "dark" ? (
        <ThemeSwitcher onClick={() => setTheme("light")} />
      ) : (
        <ThemeSwitcher onClick={() => setTheme("dark")} />
      )}
    </>
  );
}
