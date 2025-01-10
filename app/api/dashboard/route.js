import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import dbConnect from "../../../lib/dbConnect";
import { authOptions } from "../../../lib/authOptions";
import { TeamModel } from "../../../model/Team";
import Tournament from "../../../model/Tournament";
import Bracket from "../../../model/Bracket";

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({
        participatedTournaments: [],
        upcomingTournaments: [],
        userTeams: [],
        userBrackets: [],
      });
    }

    await dbConnect();

    const userId = session.user._id;

    const [
      participatedTournaments,
      upcomingTournaments,
      userTeams,
      userBrackets,
    ] = await Promise.all([
      // Fetch tournaments where the user is a participant
      Tournament.find({ participants: userId })
        .select(
          "_id tournamentName gameType tournamentDates status participants",
        )
        .lean(),

      // Fetch upcoming tournaments
      Tournament.find({ "tournamentDates.startDate": { $gte: new Date() } })
        .select("_id tournamentName gameType tournamentDates")
        .limit(5)
        .lean(),

      // Fetch user's teams
      TeamModel.find({ players: userId })
        .select("_id teamname")
        .lean()
        .then((teams) =>
          teams.map((team) => ({
            ...team,
            players: team.players || [],
          })),
        ),

      // Fetch brackets created by the user
      Bracket.find({ createdBy: userId })
        .select("_id tournamentName rounds format teams")
        .lean(),
    ]);

    console.log("participatedTournaments", participatedTournaments);
    console.log("upcomingTournaments", upcomingTournaments);
    console.log("userTeams", userTeams);
    console.log("userBrackets", userBrackets);

    return NextResponse.json({
      participatedTournaments,
      upcomingTournaments,
      userTeams,
      userBrackets,
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
