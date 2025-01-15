"use client";

import { useState, useEffect } from "react";
import { InMemoryDatabase } from "brackets-memory-db";
import { BracketsManager } from "brackets-manager";
import { useRouter } from "next/navigation";

import "brackets-viewer/dist/brackets-viewer.min.js";
import "brackets-viewer/dist/brackets-viewer.min.css";
import "./styles.css";

export default function Bracket({
  teams,
  tournament_name,
  format,
  consolationFinal,
  grandFinalType,
}) {
  const storage = new InMemoryDatabase();
  const manager = new BracketsManager(storage);

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
        clear: true,
        onMatchClick: (match) => {
          console.log("Match clicked", match);
        },
      },
    );
  }

  useEffect(() => {
    rendering();
  }, [rendering]);

  useEffect(() => {
    rerendering();
  }, [stageData, rerendering]);

  return (
    <>
      <div className="brackets-viewer custom"></div>
    </>
  );
}
