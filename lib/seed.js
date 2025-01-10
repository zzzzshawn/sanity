const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
require("dotenv").config();

// Import Mongoose models
const GamesModel = require("../model/Games").default;
const UserModel = require("../model/User");
const OrganizerModel = require("../model/Organizer");
const TournamentModel = require("../model/Tournament");
const BracketModel = require("../model/Bracket");
const { TeamModel } = require("../model/Team");

async function connectToMongoDB() {
  try {
    await mongoose.connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
}

async function seedGames() {
  const gameData = [
    {
      name: "BGMI",
      category: "Battle Royale",
      profile: "Battlegrounds Mobile India",
      gameBannerPhoto:
        "https://media.battlexo.com/tournament/668292838ab430dcee21f257/banner/icon/29fd717a-2be9-4c19-8394-865ff112a15a.webp",
    },
    {
      name: "Call of Duty Mobile",
      category: "FPS",
      profile: "Mobile version of the popular Call of Duty franchise",
      gameBannerPhoto:
        "https://media.battlexo.com/tournament/668292838ab430dcee21f257/banner/icon/29fd717a-2be9-4c19-8394-865ff112a15a.webp",
    },
  ];

  for (const game of gameData) {
    try {
      const existingGame = await GamesModel.findOne({ name: game.name });
      if (!existingGame) {
        await GamesModel.create(game);
        console.log(`Game "${game.name}" inserted successfully`);
      } else {
        console.log(`Game "${game.name}" already exists`);
      }
    } catch (error) {
      console.error(`Error inserting game "${game.name}":`, error);
    }
  }
}

async function seedUsers() {
  const userData = [
    {
      username: "player1",
      name: "John Doe",
      email: "john@example.com",
      bio: "Passionate gamer",
      password: await bcrypt.hash("password123", 10),
      verifyCode: "123456",
      verifyCodeExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
    {
      username: "player2",
      name: "Jane Smith",
      email: "jane@example.com",
      bio: "Pro gamer",
      password: await bcrypt.hash("password456", 10),
      verifyCode: "654321",
      verifyCodeExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
  ];

  for (const user of userData) {
    try {
      const existingUser = await UserModel.findOne({ email: user.email });
      if (!existingUser) {
        await UserModel.create(user);
        console.log(`User "${user.username}" inserted successfully`);
      } else {
        console.log(`User "${user.username}" already exists`);
      }
    } catch (error) {
      console.error(`Error inserting user "${user.username}":`, error);
    }
  }
}

async function seedOrganizers() {
  const organizerData = [
    {
      orgName: "Epic Gaming",
      orgEmail: "epic@gaming.com",
      description: "Professional esports organization",
      bannerPhoto:
        "https://media.battlexo.com/tournament/668292838ab430dcee21f257/banner/icon/29fd717a-2be9-4c19-8394-865ff112a15a.webp",
    },
    {
      orgName: "Pro Tournaments",
      orgEmail: "info@protournaments.com",
      description: "Leading tournament organizer",
      bannerPhoto:
        "https://media.battlexo.com/tournament/668292838ab430dcee21f257/banner/icon/29fd717a-2be9-4c19-8394-865ff112a15a.webp",
    },
  ];

  for (const organizer of organizerData) {
    try {
      const existingOrganizer = await OrganizerModel.findOne({
        orgEmail: organizer.orgEmail,
      });
      if (!existingOrganizer) {
        await OrganizerModel.create(organizer);
        console.log(`Organizer "${organizer.orgName}" inserted successfully`);
      } else {
        console.log(`Organizer "${organizer.orgName}" already exists`);
      }
    } catch (error) {
      console.error(`Error inserting organizer "${organizer.orgName}":`, error);
    }
  }
}

async function seedTournaments() {
  const tournamentData = [
    {
      tournamentName: "BGMI Pro League",
      tournamentDates: {
        started: new Date("2024-08-01"),
        ended: new Date("2024-08-15"),
      },
      gameType: "SQUAD",
      teamSize: 4,
      slots: 16,
      prize: [
        { rank: 1, amount: 10000 },
        { rank: 2, amount: 5000 },
        { rank: 3, amount: 2500 },
      ],
      rules: "Standard BGMI rules apply",
      email: "info@protournaments.com", // Matches Organizer seed
      participantCount: 16,
    },
    {
      tournamentName: "CoD Mobile Championship",
      tournamentDates: {
        started: new Date("2024-09-01"),
        ended: new Date("2024-09-10"),
      },
      gameType: "SOLO",
      teamSize: 1,
      slots: 32,
      prize: [
        { rank: 1, amount: 5000 },
        { rank: 2, amount: 2500 },
        { rank: 3, amount: 1000 },
      ],
      rules: "Standard CoD Mobile rules apply",
      email: "epic@gaming.com", // Matches Organizer seed
      participantCount: 32,
    },
  ];

  for (const tournament of tournamentData) {
    try {
      const existingTournament = await TournamentModel.findOne({
        tournamentName: tournament.tournamentName,
      });
      if (!existingTournament) {
        const game = await GamesModel.findOne({
          name: tournament.tournamentName.includes("BGMI")
            ? "BGMI"
            : "Call of Duty Mobile",
        });
        const organizer = await OrganizerModel.findOne({
          orgEmail: tournament.email,
        });

        if (game && organizer) {
          await TournamentModel.create({
            ...tournament,
            gameId: game._id,
            organizerId: organizer._id,
          });
          console.log(
            `Tournament "${tournament.tournamentName}" inserted successfully`,
          );
        } else {
          console.log(
            `Failed to create tournament "${tournament.tournamentName}": Game or Organizer not found`,
          );
        }
      } else {
        console.log(`Tournament "${tournament.tournamentName}" already exists`);
      }
    } catch (error) {
      console.error(
        `Error inserting tournament "${tournament.tournamentName}":`,
        error,
      );
    }
  }
}

async function seedTeams() {
  // Update your seed data for teams to use valid references to `UserModel` by `_id`.
  const teamsData = [
    {
      image: "https://example.com/team1-image.jpg",
      teamname: "Squad Warriors",
      game: "BGMI",
      role: "SQUAD",
      rank: "Diamond",
      server: "Asia",
      language: "English",
      players: [],
      requests: [],
    },
    {
      image: "https://example.com/team2-image.jpg",
      teamname: "Sharp Shooters",
      game: "Call of Duty Mobile",
      role: "SOLO",
      rank: "Platinum",
      server: "North America",
      language: "English",
      players: [],
      requests: [],
    },
  ];
  for (const team of teamsData) {
    try {
      const existingTeam = await TeamModel.findOne({ teamname: team.teamname });
      if (!existingTeam) {
        // Retrieve user IDs to populate players and requests
        const users = await UserModel.find().limit(4); // Assuming you want to use the first 4 users as players
        if (users.length === 0) {
          console.error("No users found to populate players and requests");
          continue;
        }

        team.players = users.map((user) => user._id);
        team.requests = users.slice(0, 2).map((user) => user._id); // Example: first 2 users as requests

        await TeamModel.create(team);
        console.log(`Team "${team.teamname}" inserted successfully`);
      } else {
        console.log(`Team "${team.teamname}" already exists`);
      }
    } catch (error) {
      console.error(`Error inserting team "${team.teamname}":`, error);
    }
  }
}

async function seedBracket() {
  const bracketData = [
    {
      tournamentName: "BGMI Pro League",
      format: "single_elimination", // or "double_elimination"
      group: [{ id: 1, number: 1, stage_id: 1 }],
      match: [
        {
          child_count: 2,
          group_id: 1,
          id: 1,
          number: 1,
          opponent1: { id: 1, position: 1 },
          opponent2: { id: 2, position: 2 },
          round_id: 1,
          stage_id: 1,
          status: 1,
        },
      ],
      participant: [
        {
          name: "Squad Warriors",
        },
      ],
      round: [
        {
          group_id: 1,
          id: 1,
          number: 1,
          stage_id: 1,
        },
      ],
      stage: [
        {
          name: "Stage 1",
          number: 1,
          settings: {
            consolationFinal: true,
            grandFinalType: "Best of 3",
            matchesChildCount: 4,
            seedOrdering: ["A", "B", "C"],
            size: 8,
          },
          type: "knockout",
        },
      ],
      match_game: ["Game 1", "Game 2"],
    },
    {
      tournamentName: "CoD Mobile Championship",
      format: "double_elimination", // or "single_elimination"
      group: [{ id: 2, number: 2, stage_id: 2 }],
      match: [
        {
          child_count: 2,
          group_id: 2,
          id: 2,
          number: 2,
          opponent1: { id: 3, position: 3 },
          opponent2: { id: 4, position: 4 },
          round_id: 2,
          stage_id: 2,
          status: 1,
        },
      ],
      participant: [
        {
          name: "Sharp Shooters",
        },
      ],
      round: [
        {
          group_id: 2,
          id: 2,
          number: 2,
          stage_id: 2,
        },
      ],
      stage: [
        {
          name: "Stage 2",
          number: 2,
          settings: {
            consolationFinal: false,
            grandFinalType: "Best of 5",
            matchesChildCount: 8,
            seedOrdering: ["D", "E", "F"],
            size: 16,
          },
          type: "knockout",
        },
      ],
      match_game: ["Game 1", "Game 2", "Game 3"],
    },
  ];

  for (const bracket of bracketData) {
    try {
      const existingTournament = await TournamentModel.findOne({
        tournamentName: bracket.tournamentName,
      });

      if (!existingTournament) {
        console.error(`Tournament "${bracket.tournamentName}" not found`);
        continue;
      }

      // Assign the tournament's ObjectId
      const tournamentId = existingTournament._id;

      // Fetch the teams for the participants
      const teams = await TeamModel.find().limit(bracket.participant.length); // Adjust as needed
      if (teams.length < bracket.participant.length) {
        console.error("Not enough teams found to seed participants");
        continue;
      }

      // Replace participant names with valid ObjectIds
      const participants = bracket.participant.map((participant, index) => ({
        ...participant,
        id: teams[index]._id, // Use actual team ObjectIds
        tournament_id: tournamentId, // Use valid tournamentId
      }));

      // Replace the "tournamentId" string with the actual ObjectId in stage
      const stages = bracket.stage.map((stage) => ({
        ...stage,
        id: tournamentId, // Replace with actual tournament ObjectId
        tournament_id: tournamentId, // Same for tournament_id
      }));

      // Create the Bracket document
      await BracketModel.create({
        ...bracket,
        tournament: tournamentId, // Ensure the `tournament` field is populated correctly
        participant: participants,
        stage: stages,
      });

      console.log(
        `Bracket for tournament "${bracket.tournamentName}" inserted successfully`,
      );
    } catch (error) {
      console.error(
        `Error inserting bracket for tournament "${bracket.tournamentName}":`,
        error,
      );
    }
  }
}

async function main() {
  await connectToMongoDB();
  await seedGames();
  await seedUsers();
  await seedOrganizers();
  await seedTournaments();
  await seedTeams();
  await seedBracket();
  mongoose.disconnect();
  console.log("Seeding completed");
}

main().catch((error) => {
  console.error("Error during seeding:", error);
  process.exit(1);
});
