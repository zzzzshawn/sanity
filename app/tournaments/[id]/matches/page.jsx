"use client";

import React, { useEffect, useState } from "react";

export default function TournamentMatches({ params }) {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const unwrappedId = React.use(params);

  useEffect(() => {
    fetchMatches();
  }, [unwrappedId.id]);

  const fetchMatches = async () => {
    try {
      const response = await fetch(
        `/api/tournaments/${unwrappedId.id}/matches`,
      );
      const data = await response.json();

      if (!response.ok) throw new Error(data.error);

      setMatches(data.matches);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 1:
        return "In Progress";
      case 2:
        return "Pending";
      case 3:
        return "Completed";
      default:
        return "Unknown";
    }
  };

  if (loading) return <div>Loading matches...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Tournament Matches</h1>

      <div className="grid gap-4">
        {matches.map((match) => (
          <div
            key={match.id}
            className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-center">
              <div className="flex-1">
                <p className="text-sm text-gray-600">
                  Match {match.matchNumber} | Round {match.roundNumber} |{" "}
                  {match.stageName}
                </p>
                <div className="mt-2 space-y-2">
                  <p className="font-semibold">{match.opponent1Name}</p>
                  <p className="text-gray-500">vs</p>
                  <p className="font-semibold">{match.opponent2Name}</p>
                </div>
              </div>

              <div
                className={`text-sm font-semibold ${
                  match.status === 3
                    ? "text-green-600"
                    : match.status === 1
                      ? "text-blue-600"
                      : "text-gray-600"
                }`}
              >
                {getStatusText(match.status)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
