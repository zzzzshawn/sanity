import { NextResponse } from "next/server";
import dbConnect from "../../../../../lib/dbConnect";
import Bracket from "../../../../../model/Bracket";
import Tournament from "../../../../../model/Tournament";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../lib/authOptions";
import mongoose from "mongoose";

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;

    // Convert string ID to ObjectId
    const tournamentId = mongoose.Types.ObjectId.createFromHexString(id);

    // Find bracket where any stage has the matching tournament_id
    const bracket = await Bracket.findOne({
      'stage.tournament_id': tournamentId
    }).lean();
    console.log(bracket);
    if (!bracket) {
      return NextResponse.json(
        { error: "No matches found for this tournament" },
        { status: 404 }
      );
    }

    // Return matches with related data
    const matches = bracket.match.map(match => {
      const round = bracket.round.find(r => r.id === match.round_id);
      const stage = bracket.stage.find(s => s.id === match.stage_id);
      
      // Get participant names
      const participant1 = bracket.participant.find(p => p.id === match.opponent1.id);
      const participant2 = bracket.participant.find(p => p.id === match.opponent2.id);

      return {
        ...match,
        round_number: round?.number,
        stage_name: stage?.name,
        opponent1_name: participant1?.name || 'TBD',
        opponent2_name: participant2?.name || 'TBD'
      };
    });

    return NextResponse.json({ matches });
  } catch (error) {
    console.error("Error fetching matches:", error);
    return NextResponse.json(
      { error: "Failed to fetch matches" },
      { status: 500 }
    );
  }
}

// Update match results
export async function PUT(request, { params }) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = params;
    const { matchId, winner, score } = await request.json();

    // Convert string ID to ObjectId
    const tournamentId = mongoose.Types.ObjectId.createFromHexString(id);

    const bracket = await Bracket.findOne({
      'stage.tournament_id': tournamentId
    });

    if (!bracket) {
      return NextResponse.json(
        { error: "Bracket not found" },
        { status: 404 }
      );
    }

    const matchIndex = bracket.match.findIndex(m => m.id === matchId);
    if (matchIndex === -1) {
      return NextResponse.json(
        { error: "Match not found" },
        { status: 404 }
      );
    }

    // Update match status and result
    bracket.match[matchIndex].status = winner ? 3 : 1; // 3 for completed, 1 for in progress
    // Add more match update logic here as needed

    await bracket.save();
    return NextResponse.json({ message: "Match updated successfully" });
  } catch (error) {
    console.error("Error updating match:", error);
    return NextResponse.json(
      { error: "Failed to update match" },
      { status: 500 }
    );
  }
} 