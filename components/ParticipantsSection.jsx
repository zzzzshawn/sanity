"use client";

import React, { useState, useEffect } from "react";
import {
  AlertCircle,
  Search,
  Users,
  ShieldAlert,
  User,
  Globe,
  Trophy,
} from "lucide-react";
import { Alert, AlertDescription } from "../@/components/ui/alert";
import { Input } from "../@/components/ui/input";
import { Badge } from "../@/components/ui/badge";
import { Card, CardHeader, CardContent } from "../@/components/ui/card";
import Pacman from "../app/loading";

const ParticipantsSection = ({ id }) => {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [tournamentExists, setTournamentExists] = useState(true);

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const response = await fetch(`/api/tournaments/${id}/participants`);
        const data = await response.json();

        if (response.status === 404) {
          setTournamentExists(false);
          setError("Tournament not found");
          return;
        }

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch participants");
        }

        setParticipants(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message);
        setParticipants([]);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchParticipants();
    }
  }, [id]);

  const filteredParticipants = participants.filter((team) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      (team?.name || "").toLowerCase().includes(searchLower) ||
      (team?.players || []).some((player) =>
        (player || "").toLowerCase().includes(searchLower),
      ) ||
      (team?.rank || "").toLowerCase().includes(searchLower) ||
      (team?.language || "").toLowerCase().includes(searchLower) ||
      (team?.participantType || "").toLowerCase().includes(searchLower)
    );
  });

  if (loading) {
    return <Pacman />;
  }

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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search teams..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>Registered Teams: {participants?.length || 0}</span>
          </div>
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>
              Total Players:{" "}
              {participants.reduce(
                (acc, team) => acc + ((team?.players || []).length || 0),
                0,
              )}
            </span>
          </div>
        </div>
      </div>

      {filteredParticipants.length === 0 && (
        <div className="text-center py-8">
          {searchTerm ? (
            <p className="text-muted-foreground">
              No teams found matching &quot;{searchTerm}&quot;
            </p>
          ) : (
            <p className="text-muted-foreground">No teams registered yet.</p>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredParticipants.map((team) => (
          <Card
            key={team?.id}
            className="hover:shadow-lg transition-shadow duration-300"
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">
                    {team?.name || "Unnamed Team"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {team?.participantType || "Not specified"}
                  </p>
                </div>
                {team?.selectedPlatform && (
                  <Badge variant="default">
                    <div className="px-3 py-1">{team.selectedPlatform} </div>
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-2 flex-wrap">
                  {team?.rank && (
                    <div className="flex items-center gap-1 text-xs">
                      <Trophy className="h-3 w-3" />
                      <span>{team.rank}</span>
                    </div>
                  )}
                  {team?.language && (
                    <div className="flex items-center gap-1 text-xs">
                      <Globe className="h-3 w-3" />
                      <span>{team.language}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Team Members ({(team?.players || []).length})
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {(team?.players || []).map((player, index) => (
                      <div
                        key={index}
                        className="text-sm text-muted-foreground flex items-center gap-1"
                      >
                        <User className="h-3 w-3" />
                        <span className="truncate">
                          {player || "Unknown Player"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ParticipantsSection;
