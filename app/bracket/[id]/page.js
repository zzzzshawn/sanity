"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Bracket from "../Bracket";
import { toast } from "sonner";
import { PacmanLoader } from "react-spinners";
import { Button } from "../../../components/ui/button";
import { useRouter } from "next/navigation";

const BracketTemplate = () => {
  const [bracket, setBracket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const router = useRouter();

  useEffect(() => {
    const fetchBracket = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/brackets/${id}`, {
          method: "GET",
        });
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
        <PacmanLoader color="yellow" />
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

  const deleteBracket = async (id) => {
    try {
      const response = await fetch(`/api/brackets/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        const data = await response.json();
        toast.success("Bracket deleted successfully");
        console.log("Bracket deleted successfully:", data.message);
        router.push("/bracket");
      } else {
        const errorData = await response.json();
        toast.error("Failed to delete bracket");
        console.error("Error deleting bracket:", errorData.error);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };

  return (
    <section className="px-5 xl:px-[10%] mt-[7.6875rem] ">
      <header
        aria-labelledby="tournament_heading flex flex-col gap-5"
        className="flex justify-between items-center"
      >
        <div>
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
        </div>
        <Button
          className="bg-red-500 hover:bg-red-500/90"
          onClick={() => deleteBracket(id)}
        >
          Delete
        </Button>
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
