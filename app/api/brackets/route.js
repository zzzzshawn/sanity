import dbConnect from "../../../lib/dbConnect";
import Bracket from "../../../model/Bracket";
import { TeamModel } from "../../../model/Team";
import { NextResponse } from "next/server";
import Tournament from "../../../model/Tournament";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../lib/authOptions";

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();

    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return new NextResponse(
        JSON.stringify({ success: false, message: "Unauthorized" }),
        { status: 401 },
      );
    }

    const { tournament_name, format, consolationFinal, grandFinalType, teams } =
      body;

    const userId = session.user._id;

    if (
      !tournament_name ||
      !format ||
      !grandFinalType ||
      typeof consolationFinal !== "boolean" ||
      !teams ||
      teams.length < 4
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid input: Ensure all fields are filled and at least 4 teams are provided.",
        },
        { status: 400 },
      );
    }

    console.log("UserId", session.user._id);

    const newBracket = new Bracket({
      tournament_name,
      format,
      consolationFinal,
      grandFinalType,
      teams,
      userId,
    });
    console.log(newBracket);

    await newBracket.save();

    return NextResponse.json(
      { message: "Bracket created successfully", id: newBracket._id },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating bracket:", error);
    return NextResponse.json(
      {
        error: "Error creating bracket",
        details: error.message,
      },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return new NextResponse(
        JSON.stringify({ success: false, message: "Unauthorized" }),
        { status: 401 },
      );
    }

    const brackets = await Bracket.find({ userId: session.user._id });

    return NextResponse.json(brackets, { status: 200 });
  } catch (error) {
    console.error("Error fetching brackets:", error);
    return new NextResponse(
      JSON.stringify({
        success: true,
        data: [],
        message: "Error fetching brackets",
      }),
      { status: 500 },
    );
  }
}
