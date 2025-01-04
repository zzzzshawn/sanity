"use client";

import { useState, useEffect } from "react";
import { AlertCircle, Search, Users, ShieldAlert } from "lucide-react";
import { Alert, AlertDescription } from "../@/components/ui/alert";
import { Input } from "../@/components/ui/input";

const ParticipantsSection = ({ id }) => {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const [tournamentExists, setTournamentExists] = useState(true);

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const response = await fetch(`/api/tournaments/${id}/participants`);
        const data = await response.json();
        console.log(data);
        if (response.status === 404) {
          setTournamentExists(false);
          setError("Tournament not found");
          return;
        }

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch participants");
        }

        setParticipants(data);
        setTotalCount(data.length);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchParticipants();
  }, [id]);

  const filteredParticipants = participants.filter(
    (team) =>
      team.players?.some((player) =>
        player.toLowerCase().includes(searchTerm.toLowerCase()),
      ) ||
      (team.rank &&
        team.rank.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (team.language &&
        team.language.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Tournament not found state
  if (!tournamentExists) {
    return (
      <div className="flex flex-col items-center justify-center h-48 space-y-4">
        <ShieldAlert className="h-12 w-12 text-destructive" />
        <h2 className="text-xl font-semibold text-destructive">
          Tournament Not Found
        </h2>
        <p className="text-muted-foreground">
          The tournament you&apos;re looking for doesn&apos;t exist or has been
          removed.
        </p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Stats Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search participants..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>Total Teams: {totalCount}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>
              Total Team Members:{" "}
              {participants.reduce(
                (acc, team) => acc + (team.players?.length || 0),
                0,
              )}
            </span>
          </div>
        </div>
      </div>

      {/* No Results Message */}
      {filteredParticipants.length === 0 && (
        <div className="text-center py-8">
          {searchTerm ? (
            <p className="text-muted-foreground">
              No participants found matching &quot;{searchTerm}&quot;
            </p>
          ) : (
            <p className="text-muted-foreground">
              No participants registered yet.
            </p>
          )}
        </div>
      )}

      {/* Participants Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredParticipants.map((team) => (
          <div
            key={team.id}
            className="bg-card p-4 rounded-lg shadow hover:shadow-lg transition-shadow duration-300 border border-border hover:border-primary"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold">{team.name}</h3>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="px-2 py-1 text-xs rounded bg-primary/10 text-primary">
                  {team.selectedPlatform}
                </span>
                {team.rank && (
                  <span className="text-xs text-muted-foreground">
                    Rank: {team.rank}
                  </span>
                )}
              </div>
            </div>

            {/* Team Members Section */}
            <div className="mb-4">
              <h4 className="text-sm font-medium mb-2">
                Team Members:{" "}
                <span className="text-muted-foreground">
                  ({team.players?.length || 0})
                </span>
              </h4>
              {team.players && team.players.length > 0 ? (
                <ul className="text-sm space-y-1">
                  {team.players.map((player, index) => (
                    <li
                      key={index}
                      className="text-muted-foreground flex items-center gap-2"
                    >
                      <span className="truncate">{player}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No members added yet.
                </p>
              )}
            </div>

            {/* Additional Details */}
            <div className="mt-4 pt-3 border-t border-border">
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">
                  {team.participantType}
                </span>
                {team.language && (
                  <span className="text-xs text-muted-foreground">
                    Language: {team.language}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ParticipantsSection;
