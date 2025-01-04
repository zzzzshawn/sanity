"use client";

import { useEffect } from "react";
import "brackets-viewer/dist/brackets-viewer.min.js";
import "brackets-viewer/dist/brackets-viewer.min.css";
import "./styles/bracket.css";

async function render(id) {
  // Fetching data from the API
  const data = await fetch(`/api/brackets/${id}`).then((res) => res.json());

  // Check if window is defined before accessing it
  if (typeof window !== "undefined") {
    window.bracketsViewer.setParticipantImages(
      data.participant.map((participant) => ({
        participantId: participant.id,
        imageUrl: "https://github.githubassets.com/pinned-octocat.svg",
      })),
    );

    window.bracketsViewer.render(
      {
        stages: data.stage,
        matches: data.match,
        matchGames: data.match_game,
        participants: data.participant,
      },
      { clear: true },
      {
        participantOriginPlacement: "before",
        separatedChildCountLabel: true,
        showSlotsOrigin: true,
        showLowerBracketSlotsOrigin: true,
        highlightParticipantOnHover: true,
      },
    );
  }
}

function Bracket({ id }) {
  useEffect(() => {
    // Ensure render is called only once when id changes
    render(id);

  }, [id]);
  
// Add id as a dependency

  return (
    <>
      <div className="brackets-viewer custom"></div>
    </>
  );
}

export default Bracket;
