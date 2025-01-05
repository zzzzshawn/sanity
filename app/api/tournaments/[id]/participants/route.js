// app/api/tournaments/[id]/participants/route.js
import { NextResponse } from "next/server";
import dbConnect from "../../../../../lib/dbConnect"; // Assuming you have this utility
import Tournament from "../../../../../model/Tournament"; // Your Tournament model
import { TeamModel } from "../../../../../model/Team";
import UserModel from "../../../../../model/User";

export async function GET(request, { params }) {
  const { id } = params;

  try {
    await dbConnect();

    const tournament = await Tournament.findById(id)
      .populate({
        path: "teamsRegistered.id",
        model: TeamModel,
        populate: {
          path: "players",
          model: UserModel,
          select: "username",
        },
      })
      .exec();

    if (!tournament) {
      return NextResponse.json(
        { error: "Tournament not found" },
        { status: 404 },
      );
    }

    // Safely transform the data with optional chaining and fallback values
    const enrichedParticipants = (tournament.teamsRegistered || []).map(
      (team) => {
        const teamDetails = team?.id || {}; // Fallback to empty object if id is null
        return {
          id: teamDetails._id || team._id || "unknown",
          name: team?.name || "Unnamed Team",
          email: team?.email || "",
          selectedPlatform: team?.selectedPlatform || "Not specified",
          participantType: team?.participantType || "Not specified",
          rank: teamDetails?.rank || "Unranked",
          language: teamDetails?.language || "Not specified",
          players: (teamDetails?.players || []).map(
            (player) => player?.username || "Unknown Player",
          ),
          members: team?.members || [],
        };
      },
    );

    return NextResponse.json(enrichedParticipants);
  } catch (error) {
    console.error("Error fetching participants:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
