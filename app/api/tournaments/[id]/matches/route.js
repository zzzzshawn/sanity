import { NextResponse } from "next/server";
import dbConnect from "../../../../../lib/dbConnect";
import Bracket from "../../../../../model/Bracket";
import mongoose from "mongoose";

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;

    // Find bracket where stage has the matching tournament_id
    const bracket = await Bracket.findOne({
      "stage.tournament_id": id,
    }).lean();

    console.log(bracket);

    if (!bracket) {
      return NextResponse.json(
        { error: "No matches found for this tournament" },
        { status: 404 },
      );
    }

    // Return matches with related data
    const matches = bracket.match.map((match) => {
      const round = bracket.round.find((r) => r.id === match.round_id);
      const stage = bracket.stage.find((s) => s.id === match.stage_id);

      // Get participant names from the participants array
      const opponent1 = bracket.participant.find(
        (p) => p.id.toString() === match.opponent1.id.toString(),
      );
      const opponent2 = bracket.participant.find(
        (p) => p.id.toString() === match.opponent2.id.toString(),
      );

      return {
        id: match.id,
        matchNumber: match.number,
        roundNumber: round?.number || "Unknown",
        stageName: stage?.name || "Unknown",
        opponent1Name: opponent1?.name || "TBD",
        opponent2Name: opponent2?.name || "TBD",
        status: match.status,
        groupId: match.group_id,
      };
    });

    return NextResponse.json({ matches });
  } catch (error) {
    console.error("Error fetching matches:", error);
    return NextResponse.json(
      { error: "Failed to fetch matches" },
      { status: 500 },
    );
  }
}
