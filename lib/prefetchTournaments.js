import { cache } from "react";
import dbConnect from "./dbConnect";
import Tournament from "../model/Tournament";
import Organizer from "../model/Organizer";
import Games from "../model/Games";

export const prefetchTournaments = cache(async () => {
  await dbConnect();
  try {
    const tournaments = await Tournament.find()
      .select(
        "tournamentName tournamentDates gameType prize slots registeredNumber gameId organizerId",
      )
      .populate("gameId", "gameBannerPhoto")
      .populate("organizerId", "orgName bannerPhoto")
      .lean();
    return { tournaments };
  } catch (error) {
    console.error("Error prefetching tournaments:", error);
    return { tournaments: [] };
  }
});
