"use client";

import { useState } from "react";
import TournamentSection from "../../components/TournamentSection";
import { ListFilter } from "lucide-react";
import { Button } from "../../@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

const TournamentPage = () => {
  const router = useRouter();
  const [filters, setFilters] = useState({
    entryFee: "",
    mode: "",
    status: "",
    gameId: "",
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({
      entryFee: "",
      mode: "",
      status: "",
      gameId: "",
    });
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="flex flex-col space-y-8 md:flex-row md:items-center md:justify-between mb-12">
          <div className="space-y-4">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
              Gaming Tournaments
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl">
              Join competitive gaming tournaments, compete with the best, and win exciting prizes
            </p>
          </div>

          <div className="flex space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="bg-gray-800 hover:bg-gray-700 border-gray-600 text-gray-200 px-6 py-3 rounded-xl flex items-center gap-3 transition-all duration-300 hover:border-blue-500"
                >
                  <ListFilter className="w-5 h-5" />
                  Filters
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-80 bg-gray-800 border-gray-700 rounded-xl shadow-2xl p-6">
                {[
                  {
                    label: "Game",
                    name: "gameId",
                    options: [
                      { value: "", label: "All Games" },
                      { value: "676d205ad9a2b1079a937312", label: "Valorant" },
                      { value: "676d205ad9a2b1079a937316", label: "CS:GO" },
                      { value: "676d205ad9a2b1079a937320", label: "BGMI" },
                      { value: "676d205ad9a2b1079a937317", label: "Fortnite" },
                    ],
                  },
                  {
                    label: "Entry Fee",
                    name: "entryFee",
                    options: [
                      { value: "", label: "All" },
                      { value: "free", label: "Free" },
                      { value: "paid", label: "Paid" },
                    ],
                  },
                  {
                    label: "Mode",
                    name: "mode",
                    options: [
                      { value: "", label: "All" },
                      { value: "solo", label: "Solo" },
                      { value: "duo", label: "Duo" },
                      { value: "squad", label: "Squad" },
                    ],
                  },
                  {
                    label: "Status",
                    name: "status",
                    options: [
                      { value: "", label: "All" },
                      { value: "open", label: "Open" },
                      { value: "live", label: "Live" },
                      { value: "completed", label: "Completed" },
                    ],
                  },
                ].map((filter) => (
                  <div key={filter.name} className="mb-6">
                    <label className="text-sm font-medium text-gray-300 mb-2 block">
                      {filter.label}
                    </label>
                    <select
                      name={filter.name}
                      value={filters[filter.name]}
                      onChange={handleFilterChange}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                      {filter.options.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}

                <DropdownMenuSeparator className="my-4 border-gray-700" />

                <Button
                  variant="ghost"
                  onClick={clearFilters}
                  className="w-full bg-gray-700 hover:bg-gray-600 text-gray-200 py-3 rounded-lg transition-all"
                >
                  Clear Filters
                </Button>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              onClick={() => router.push("/create/tournament")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300"
            >
              Create Tournament
            </Button>
          </div>
        </div>

        <TournamentSection filters={filters} />
      </div>
    </div>
  );
};

export default TournamentPage;