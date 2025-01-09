import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../lib/authOptions";
import { NextResponse } from "next/server";
import dbConnect from "../../../lib/dbConnect";

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

    const testData = {
      participatedTournaments: [
        {
          _id: "T1",
          tournamentName: "Tournament 1",
          game: "BGMI",
          startDate: new Date(),
          status: "ongoing",
        },
        {
          _id: "T2",
          tournamentName: "Valo Tournament",
          game: "Valorent",
          startDate: new Date(),
          status: "completed",
        },
      ],
      upcomingTournaments: [
        {
          _id: "UT1",
          tournamentName: "Tournament 3",
          game: "Valorent",
          registrationEndDate: new Date(Date.now()),
        },
        {
          _id: "UT2",
          tournamentName: "Tournament 4",
          game: "Apex Legends",
          registrationEndDate: new Date(Date.now() + 7 * 1000 * 86400),
        },
      ],
      userTeams: [
        {
          _id: "team 1",
          teamName: "Team 1",
          members: ["pro", "exp", "a32"],
        },
        {
          _id: "team 2",
          teamName: "Team 2",
          members: ["dragon", "vince", "strange"],
        },
      ],
      userBrackets: [
        {
          _id: "B1",
          name: "bgmi bracket",
          rounds: 3,
          teams: 9,
        },
        {
          _id: "B2",
          name: "valorent bracket",
          rounds: 4,
          teams: 15,
        },
      ],
    };
    return NextResponse.json(testData);

    /*
      const [participatedTournaments, upcomingTournaments, userTeams, userBrackets] = await Promise.all([
        Tournament.find({ "teamsRegistered.members": session.user.email }).lean(),
        Tournament.find({ registrationEndDate: { $gt: new Date() } }).limit(5).lean(),
        Team.find({ members: session.user.email }).lean(),
        Bracket.find({ createdBy: session.user.email }).lean()
      ]);
  
      return NextResponse.json({
        participatedTournaments,
        upcomingTournaments,
        userTeams,
        userBrackets
      });
      */
  } catch (error) {
    console.log("API Error:", error);
    return NextResponse.json(
      /*{
        participatedTournaments: [],
        upcomingTournaments: [],
        userTeams: [],
        userBrackets: []
      }*/
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
