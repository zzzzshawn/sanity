"use client";

import { useState, useEffect } from "react";
import { InMemoryDatabase } from "brackets-memory-db";
import { BracketsManager } from "brackets-manager";
import { Button } from "../../components/ui/button";
import { useRouter } from "next/navigation";

import "brackets-viewer/dist/brackets-viewer.min.js";
import "brackets-viewer/dist/brackets-viewer.min.css";
import "./styles.css";

const storage = new InMemoryDatabase();
const manager = new BracketsManager(storage);

export default function Bracket({
  teams,
  tournament_name,
  format,
  consolationFinal,
  grandFinalType,
}) {
  const [stageData, setStageData] = useState(null);
  const router = useRouter();

  async function rendering() {
    if (!teams) return;

    const len = teams.length;
    const nearestPowerOf2 = Math.pow(2, Math.ceil(Math.log2(len)));
    const byesCount = nearestPowerOf2 - len;

    const paddedTeams = [
      ...teams,
      ...Array.from({ length: byesCount }, (_, i) => `Bye#${i + 1}`),
    ];

    try {
      await manager.create.stage({
        name: tournament_name,
        tournamentId: 0,
        type: format,
        seeding: paddedTeams,
        settings: {
          consolationFinal: consolationFinal,
          grandFinal: grandFinalType,
        },
      });

      const data = await manager.get.stageData(0);
      setStageData(data);
      console.log("Stage Data", stageData);
    } catch (error) {
      console.error("Error during rendering:", error);
    }
  }

  async function rerendering() {
    if (typeof window === "undefined" || !stageData) return;

    // const bracketsViewerNode = document.querySelector(".brackets-viewer");
    // bracketsViewerNode?.replaceChildren();

    // window.bracketsViewer.onMatchClicked = async (match) => {
    //   console.log("Match clicked", match);
    //   try {
    //     await manager.update.match({
    //       id: match.id,
    //       opponent1: { score: 5 },
    //       opponent2: { score: 7, result: "win" },
    //     });
    //   } catch (error) {
    //     console.error("Error during match update:", error);
    //   }
    //   const tourneyData2 = await manager.get.currentMatches(0);
    //   const tourneyData = await manager.get.stageData(0);
    //   setStageData(tourneyData);
    // };

    window.bracketsViewer.setParticipantImages(
      stageData.participant.map((participant) => ({
        participantId: participant.id,
        imageUrl: "https://github.githubassets.com/pinned-octocat.svg",
      })),
    );

    await window.bracketsViewer.render(
      {
        stages: stageData.stage,
        matches: stageData.match,
        matchGames: stageData.match_game,
        participants: stageData.participant,
      },
      {
        customRoundName: (info, t) => {
          if (info.fractionOfFinal === 1 / 2) {
            if (info.groupType === "single-bracket") {
              return "Semi Finals";
            } else {
              return `${t(`abbreviations.${info.groupType}`)} Semi Finals`;
            }
          }
        },
      },
    );
  }

  useEffect(() => {
    rendering();
  }, []);

  useEffect(() => {
    rerendering();
  }, [stageData]);

  function removeBracket() {
    storage.reset();
    manager.reset;
    router.push("/bracket");
  }

  return (
    <>
      <Button onClick={removeBracket} className="mb-1">
        Clear
      </Button>
      <div className="brackets-viewer custom"></div>
    </>
  );
}
