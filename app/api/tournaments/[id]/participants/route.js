// app/api/tournaments/[id]/participants/route.js
import { NextResponse } from "next/server";
import dbConnect from "../../../../../lib/dbConnect"; // Assuming you have this utility
import Tournament from "../../../../../model/Tournament"; // Your Tournament model
import { TeamModel } from "../../../../../model/Team";

export async function GET(request, { params }) {
  const { id } = await params;

  try {
    await dbConnect();

    // Check if tournament exists
    const tournament = await Tournament.findById(id);

    if (!tournament) {
      return NextResponse.json(
        { error: "Tournament not found" },
        { status: 404 },
      );
    }

    // Get registered teams data
    const teamsRegistered = tournament.teamsRegistered || [];

    // If there are no registered teams, return empty array
    if (teamsRegistered.length === 0) {
      return NextResponse.json([]);
    }

    // Fetch additional team details for registered teams
    const teamIds = teamsRegistered.map((team) => team.id);

    const teamDetails = await TeamModel.find({
      _id: { $in: teamIds },
    }).populate("players", "username"); // Assuming UserModel has username field

    // Merge tournament registration data with team details
    const enrichedParticipants = teamsRegistered.map((regTeam) => {
      const teamDetail = teamDetails.find(
        (t) => t._id.toString() === regTeam.id.toString(),
      );
      return {
        ...regTeam,
        rank: teamDetail?.rank || "Unranked",
        language: teamDetail?.language || "Not specified",
        players: teamDetail?.players?.map((p) => p.username) || [],
        // Add any other team details you want to include
      };
    });

    return NextResponse.json(enrichedParticipants);
  } catch (error) {
    console.error("Error fetching participants:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
