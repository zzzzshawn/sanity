"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Bracket from "../Bracket";

import NewBracket from "../../../components/NewBracket";

import { PacmanLoader } from "react-spinners";

const BracketTemplate = () => {
  const [bracket, setBracket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchBracket = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/brackets/" + id);
        if (!response.ok) {
          throw new Error("Failed to fetch brackets");
        }
        const data = await response.json();
        setBracket(data);
      } catch (error) {
        console.error("Error fetching brackets:", error);
        setError("Failed to load brackets. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBracket();
  }, [id]);

  if (loading) {
    return (
      <div className="flex w-full h-screen justify-center items-center">
        <PacmanLoader color="white" />
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  // Destructure the bracket data once it's loaded
  const { tournament_name, format, consolationFinal, grandFinalType, teams } =
    bracket;
  console.log(bracket);

  return (
    <section className="px-5 xl:px-[10%] mt-[7.6875rem] ">
      <header aria-labelledby="tournament_heading flex flex-col gap-5">
        <h2 className="font-black text-3xl" id="tournament_heading">
          {tournament_name}
        </h2>
        <p className="text-xl">{teams.length} Teams </p>
        <span className="text-xl text-gray-400">
          {format === "single_elimination"
            ? "Single Elimination"
            : format === "double_elimination"
              ? "Double Elimination"
              : "Invalid Format"}
        </span>
      </header>
      <Bracket
        teams={teams}
        tournament_name={tournament_name}
        format={format}
        consolationFinal={consolationFinal}
        grandFinalType={grandFinalType}
      />
    </section>
  );
};

export default BracketTemplate;
