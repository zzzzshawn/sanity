// app/api/tournaments/[id]/route.js
import { NextResponse } from "next/server";
import dbConnect from "../../../../../lib/dbConnect";
import Tournament from "../../../../../model/Tournament";
import { TeamModel } from "../../../../../model/Team";
import Games from "../../../../../model/Games";
import Organizer from "../../../../../model/Organizer";

export async function GET(request, { params }) {
  const { id } = await params;

  try {
    await dbConnect();

    const tournament = await Tournament.findById(id)
      .populate("gameId")
      .populate("organizerId")
      .populate({
        path: "teamsRegistered.id",
        model: TeamModel,
        populate: {
          path: "players",
          select: "username",
        },
      });

    if (!tournament) {
      return NextResponse.json(
        { error: "Tournament not found" },
        { status: 404 },
      );
    }

    const tournamentData = {
      id: tournament._id,
      tournamentName: tournament.tournamentName || "Unnamed Tournament",
      gameInfo: {
        name: tournament.gameId?.name || "Unknown Game",
        category: tournament.gameId?.category || "Unknown Category",
      },
      organizerInfo: {
        name: tournament.organizerId?.orgName || "Unknown Organizer",
        email: tournament.organizerId?.orgEmail,
      },
      dates: {
        registrationEnd: tournament.registrationEndDate,
        tournamentStart: tournament.tournamentStartDate,
        tournamentEnd: tournament.tournamentEndDate,
      },
      format: tournament.tournamentFormat,
      gameType: tournament.gameType,
      participantInfo: {
        maxTeams: tournament.maxTeams,
        registeredTeams: tournament.registeredNumber,
        remainingSlots:
          tournament.maxTeams - (tournament.registeredNumber || 0),
        maxTeamMembers: tournament.maxTeamMembers,
        minTeamMembers: tournament.minTeamMembers,
      },
      prizeConfig: tournament.prizeConfig || [],
      rules: tournament.rules,
      links: tournament.links || {},
      howToX: tournament.howToX || [],
      tournamentVisibility: tournament.tournamentVisibility,
    };

    return NextResponse.json(tournamentData);
  } catch (error) {
    console.error("Error fetching tournament:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
