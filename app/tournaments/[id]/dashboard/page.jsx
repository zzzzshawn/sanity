// app/tournaments/[id]/dashboard/page.jsx
"use client";

import React, { useState, useEffect } from "react";
import {
  CalendarDays,
  Users,
  Trophy,
  AlertCircle,
  Link as LinkIcon,
  Gamepad2,
  Medal,
  ScrollText,
} from "lucide-react";
import { Alert, AlertDescription } from "../../../../@/components/ui/alert";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../@/components/ui/card";
import { Badge } from "../../../../@/components/ui/badge";
import { PacmanLoader } from "react-spinners";

export default function TournamentDashboard({ params }) {
  const [tournament, setTournament] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const unwrappedParams = React.use(params);

  useEffect(() => {
    const fetchTournament = async () => {
      try {
        const response = await fetch(
          `/api/tournaments/${unwrappedParams.id}/dashboard`,
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch tournament details");
        }

        setTournament(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTournament();
  }, [unwrappedParams.id]);

  if (loading) {
    return (
      <div className="flex w-full h-screen justify-center items-center ">
        <PacmanLoader color="white" />
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

  if (!tournament) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Tournament not found</p>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">{tournament.tournamentName}</h1>
        <div className="flex gap-2">
          <Badge variant="outline">{tournament.gameType}</Badge>
          <Badge variant="outline">{tournament.format}</Badge>
          <Badge>{tournament.tournamentVisibility}</Badge>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Game Info */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Game Information
            </CardTitle>
            <Gamepad2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p>
                <strong>Game:</strong> {tournament.gameInfo.name}
              </p>
              <p>
                <strong>Category:</strong> {tournament.gameInfo.category}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Organizer Info */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Organizer Details
            </CardTitle>
            <Medal className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p>
                <strong>Name:</strong> {tournament.organizerInfo.name}
              </p>
              <p>
                <strong>Contact:</strong> {tournament.organizerInfo.email}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Dates */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Important Dates
            </CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p>
                <strong>Registration Ends:</strong>{" "}
                {formatDate(tournament.dates.registrationEnd)}
              </p>
              <p>
                <strong>Tournament Start:</strong>{" "}
                {formatDate(tournament.dates.tournamentStart)}
              </p>
              <p>
                <strong>Tournament End:</strong>{" "}
                {formatDate(tournament.dates.tournamentEnd)}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Participant Info */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Participation Details
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p>
                <strong>Registered Teams:</strong>{" "}
                {tournament.participantInfo.registeredTeams}/
                {tournament.participantInfo.maxTeams}
              </p>
              <p>
                <strong>Remaining Slots:</strong>{" "}
                {tournament.participantInfo.remainingSlots}
              </p>
              <p>
                <strong>Team Size:</strong>{" "}
                {tournament.participantInfo.minTeamMembers}-
                {tournament.participantInfo.maxTeamMembers} members
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Prize Info */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Prize Pool</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {tournament.prizeConfig?.length > 0 ? (
                tournament.prizeConfig.map((prize, index) => (
                  <p key={index}>
                    <strong>Position {prize.position}:</strong> {prize.amount}{" "}
                    {prize.currency}
                  </p>
                ))
              ) : (
                <p className="text-muted-foreground">
                  No prize information available
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Links & Resources */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Important Links
            </CardTitle>
            <LinkIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(tournament.links || {}).length > 0 ? (
                Object.entries(tournament.links).map(([key, value]) => (
                  <p key={key}>
                    <strong>{key}:</strong> {value}
                  </p>
                ))
              ) : (
                <p className="text-muted-foreground">No links available</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rules Section */}
      {tournament.rules && (
        <Card className="mt-6">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tournament Rules
            </CardTitle>
            <ScrollText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{tournament.rules}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
