"use client";

import Image from "next/image";
import Link from "next/link";
import Filter from "../../components/Filter";
import { env } from "../../lib/env";
import { useState, useEffect } from "react";
import Pacman from "../loading";
import { useSearchParams } from "next/navigation";

export default function Page() {
  const [gameData, setGameData] = useState([]); // State for game data
  const [isLoading, setIsLoading] = useState(true); // State for loading
  const [errorMessage, setErrorMessage] = useState(""); // State for errors

  const params = useSearchParams(); // Use searchParams directly
  const filter = params?.filter; // Access filter safely

  const filterUrl = filter
    ? `${env.NEXT_PUBLIC_BASE_URL}/api/games?filter=${filter}`
    : `${env.NEXT_PUBLIC_BASE_URL}/api/games`;

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true); // Set loading to true before fetching
      setErrorMessage(""); // Clear any previous errors

      try {
        const response = await fetch(filterUrl, { cache: "no-store" }); // Fetch API
        if (!response.ok) {
          throw new Error("Failed to fetch games");
        }
        const data = await response.json();
        setGameData(data);
      } catch (error) {
        console.error("Fetch error:", error);
        setErrorMessage("Failed to load games. Please try again later.");
      } finally {
        setIsLoading(false); // Stop loading after fetch
      }
    };

    fetchData();
  }, [filterUrl]); // Re-run fetch when filterUrl changes

  const filters = [
    { name: "FPS", value: "fps" },
    { name: "Battle Royale", value: "battle royale" },
    { name: "None", value: "none" },
  ];

  return (
    <section className="px-[5%] xl:px-[12%] pt-10 pb-20 transition-all">
      <div className="text-4xl font-semibold mb-10 flex items-center justify-between">
        <h1>Games</h1>
        <Filter filters={filters} containerClasses={`border rounded-2xl`} />
      </div>

      {isLoading ? ( // Show loading indicator if data is being fetched
        <Pacman />
      ) : errorMessage ? ( // Show error message if there's an error
        <p className="text-red-500">{errorMessage}</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-5 transition-all">
          {Array.isArray(gameData) && gameData.length > 0 ? (
            gameData.map((game) => (
              <div key={game._id} className="grid">
                <Link
                  href={`/games/${game._id}`}
                  className="relative h-64 w-full rounded-xl hover:scale-105 transition-all"
                  aria-label="game-id-page"
                >
                  <Image
                    src={game.gameBannerPhoto}
                    alt={game.name}
                    fill
                    className="rounded-xl object-cover"
                    draggable="false"
                  />
                </Link>
              </div>
            ))
          ) : (
            <p>No games found.</p>
          )}
        </div>
      )}
    </section>
  );
}
