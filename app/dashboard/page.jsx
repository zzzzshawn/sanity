"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Pacman from "../loading";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../@/components/ui/card";
import Link from "next/link";
import { CalendarDays, Users, Trophy, Brackets } from "lucide-react";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState({
    participatedTournaments: [],
    upcomingTournaments: [],
    userTeams: [],
    userBrackets: [],
  });

  useEffect(() => {
    //console.log("Session:", session);
    if (status === "unauthenticated") {
      router.push("/sign-in");
    }

    if (status === "authenticated" && session?.user) {
      fetchDashboardData();
    }
  }, [status, session, router]);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch("/api/dashboard", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "same-origin",
      });

      const data = await response.json();

      if (data.error) {
        console.log("API Error:", data.error);
        setUserData({
          participatedTournaments: [],
          upcomingTournaments: [],
          userTeams: [],
          userBrackets: [],
        });
        return;
      }

      setUserData(data);
    } catch (error) {
      console.log("Fetch Error:", error);
      setUserData({
        participatedTournaments: [],
        upcomingTournaments: [],
        userTeams: [],
        userBrackets: [],
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "loading" || isLoading) {
    return <Pacman />;
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-white/90">
          Welcome back, {session.user.username}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Participated Tournaments */}
          <Card className="border-0 bg-gray-800/50 backdrop-blur-sm hover:bg-gray-800/60 transition-all">
            <CardHeader className="flex flex-row items-center gap-2">
              <Trophy className="w-6 h-6 " />
              <CardTitle className="text-xl text-white/90">
                Participated Tournaments
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              {userData?.participatedTournaments.map((tournament) => (
                <div
                  key={tournament._id}
                  className="group relative bg-gray-700/50 p-4 rounded-lg hover:bg-gray-700/70 transition-all"
                >
                  <h3 className="font-medium text-white/90">
                    {tournament.tournamentName}
                  </h3>
                  <p className="text-sm text-gray-300 mt-2 mb-3">
                    Game: {tournament.game}
                  </p>
                  <Link
                    href={`/tournaments/${tournament._id}`}
                    className="inline-flex items-center text-sm hover:text-gray-400 transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Upcoming Tournaments */}
          <Card className="border-0 bg-gray-800/50 backdrop-blur-sm hover:bg-gray-800/60 transition-all">
            <CardHeader className="flex flex-row items-center gap-2">
              <CalendarDays className="w-6 h-6 " />
              <CardTitle className="text-xl text-white/90">
                Upcoming Tournaments
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              {userData?.upcomingTournaments.map((tournament) => (
                <div
                  key={tournament._id}
                  className="group relative bg-gray-700/50 p-4 rounded-lg hover:bg-gray-700/70 transition-all"
                >
                  <h3 className="font-medium text-white/90">
                    {tournament.tournamentName}
                  </h3>
                  <p className="text-sm text-gray-300 mt-2 mb-3">
                    Registration Ends:{" "}
                    {new Date(
                      tournament.tournamentDates.ended,
                    ).toLocaleDateString()}
                  </p>
                  <Link
                    href={`/tournaments/${tournament._id}`}
                    className="inline-flex items-center  text-sm hover:text-gray-400 transition-colors"
                  >
                    Register Now
                  </Link>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* User Teams */}
          <Card className="border-0 bg-gray-800/50 backdrop-blur-sm hover:bg-gray-800/60 transition-all">
            <CardHeader className="flex flex-row items-center gap-2">
              <Users className="w-6 h-6 " />
              <CardTitle className="text-xl text-white/90">My Teams</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              {userData?.userTeams.map((team) => (
                <div
                  key={team._id}
                  className="group relative bg-gray-700/50 p-4 rounded-lg hover:bg-gray-700/70 transition-all"
                >
                  <h3 className="font-medium text-white/90">{team.teamName}</h3>
                  <p className="text-sm text-gray-300 mt-2 mb-3">
                    Members: {team.members?.length}
                  </p>
                  <Link
                    href={`/teams/${team._id}`}
                    className="inline-flex items-center text-sm hover:text-gray-400 transition-colors"
                  >
                    View Team
                  </Link>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Brackets */}
          <Card className="border-0 bg-gray-800/50 backdrop-blur-sm hover:bg-gray-800/60 transition-all">
            <CardHeader className="flex flex-row items-center gap-2">
              <Brackets className="w-6 h-6 " />
              <CardTitle className="text-xl text-white/90">
                My Brackets
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              {userData?.userBrackets.map((bracket) => (
                <div
                  key={bracket._id}
                  className="group relative bg-gray-700/50 p-4 rounded-lg hover:bg-gray-700/70 transition-all"
                >
                  <p className="font-medium text-white/90">
                    {bracket.tournamentName}
                  </p>
                  <Link
                    href={`/brackets/${bracket._id}`}
                    className="inline-flex items-center  text-sm hover:text-gray-400 transition-colors mt-3"
                  >
                    View Bracket
                  </Link>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
