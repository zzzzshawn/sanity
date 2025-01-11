import dbConnect from "../../../../lib/dbConnect";
import Bracket from "../../../../model/Bracket";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const { id } = await params;
  console.log("Fetching bracket with ID:", id);
  try {
    await dbConnect();

    const bracket = await Bracket.findById(id);

    if (!bracket) {
      return NextResponse.json({ error: "Bracket not found" }, { status: 404 });
    }

    return NextResponse.json(bracket);
  } catch (error) {
    console.error("Error fetching bracket:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 },
    );
  }
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  console.log("Deleting bracket with ID:", id);
  try {
    await dbConnect();

    const deletedBracket = await Bracket.findByIdAndDelete(id);

    if (!deletedBracket) {
      return NextResponse.json({ error: "Bracket not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Bracket deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting bracket:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 },
    );
  }
}
