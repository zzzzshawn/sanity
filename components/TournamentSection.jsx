"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { PacmanLoader } from "react-spinners";
const TournamentSection = ({ filters }) => {
  const [tournaments, setTournaments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchTournaments() {
      try {
        const response = await fetch("/api/tournaments");
        if (!response.ok) throw new Error("Failed to fetch tournaments");
        const data = await response.json();
        setTournaments(data.tournaments);
        setIsLoading(false);
      } catch (err) {
        console.error("Error in fetchTournaments:", err);
        setError(err.message);
        setIsLoading(false);
      }
    }
    fetchTournaments();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <PacmanLoader color="#3B82F6" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[400px] text-red-500">
        Error: {error}
      </div>
    );
  }

  const filteredTournaments = tournaments.filter((tournament) => {
    const status = getStatus(tournament.tournamentDates);
    const entryFee =
      tournament.prize?.length > 0
        ? tournament.prize[0].amount === 0
          ? "free"
          : "paid"
        : "";

    if (filters?.entryFee && filters.entryFee !== entryFee) return false;
    if (filters?.mode && filters.mode.toUpperCase() !== tournament.gameType)
      return false;
    if (filters?.status && filters.status !== status.toLowerCase())
      return false;
    if (filters?.gameId && filters.gameId !== tournament.gameId?._id)
      return false;

    return true;
  });

  return (
    <div className="mt-8">
      {filteredTournaments.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[400px] text-gray-400">
          <p className="text-xl font-medium mb-4">No tournaments found</p>
          <p>Try adjusting your filters or check back later</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTournaments.map((tournament) => (
            <Link
              key={tournament._id}
              href={`/tournaments/${tournament._id}`}
              className="transition-transform duration-300 hover:scale-105"
              prefetch={true}
              aria-label="tournament-redirect-btn"
            >
              <TournamentCard {...tournament} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

const TournamentCard = ({
  tournamentName,
  tournamentDates,
  gameType,
  prize,
  slots,
  registeredNumber,
  gameId,
  organizerId,
}) => {
  const status = getStatus(tournamentDates);
  const entryFee =
    prize?.length > 0 ? (prize[0].amount === 0 ? "Free" : "Paid") : "N/A";

  const statusColors = {
    Open: "bg-green-500",
    Live: "bg-yellow-500",
    Completed: "bg-red-500",
  };

  return (
    <div className="bg-gray-800 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent z-10" />
        <span className="absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-medium z-20 text-white ${statusColors[status]}">
          {status}
        </span>
        <span className="absolute bottom-4 left-4 px-3 py-1 bg-blue-600 rounded-full text-sm font-medium text-white z-20">
          {gameType}
        </span>
        <Image
          src={
            (gameId && gameId.gameBannerPhoto) || "/placeholder-tournament.jpg"
          }
          alt={tournamentName}
          width={500}
          height={280}
          className="w-full h-64 object-cover"
        />
      </div>

      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-white mb-2">
            {tournamentName}
          </h3>
          <p className="text-gray-400 text-sm">
            {new Date(tournamentDates.started).toLocaleDateString()}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <p className="text-gray-400 text-sm mb-1">Entry</p>
            <p className="text-white font-medium">{entryFee}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-400 text-sm mb-1">Mode</p>
            <p className="text-white font-medium">{gameType}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-400 text-sm mb-1">Slots</p>
            <p className="text-white font-medium">
              {registeredNumber}/{slots}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-700 rounded-xl">
          <div className="flex items-center space-x-3">
            <Image
              src={
                (organizerId && organizerId.bannerPhoto) ||
                "/placeholder-organizer.jpg"
              }
              alt={organizerId ? organizerId.orgName : "Organizer"}
              width={32}
              height={32}
              className="rounded-full"
            />
            <div>
              <p className="text-white font-medium">
                {organizerId ? organizerId.orgName : "Unknown Organizer"}
              </p>
              <p className="text-gray-400 text-sm">Host</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function getStatus(dates) {
  const now = new Date();
  const startDate = new Date(dates.started);
  const endDate = new Date(dates.ended);

  if (now < startDate) return "Open";
  if (now >= startDate && now <= endDate) return "Live";
  return "Completed";
}

export default TournamentSection;
