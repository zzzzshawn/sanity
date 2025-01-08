"use client";

import { useState, useEffect } from "react";
import { Button } from "../../../components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../@/components/ui/select";
import { Input } from "../../../@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { InMemoryDatabase } from "brackets-memory-db";
import { BracketsManager } from "brackets-manager";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useRouter } from "next/navigation";

import "brackets-viewer/dist/brackets-viewer.min.js";
import "brackets-viewer/dist/brackets-viewer.min.css";
import "./styles.css";

const bracketSchema = z.object({
  tournament_name: z.string().min(1),
  format: z.enum(["single_elimination", "double_elimination"]),
  consolationFinal: z.boolean().default(false),
  grandFinalType: z.enum(["simple", "double"]),
});

const storage = new InMemoryDatabase();
const manager = new BracketsManager(storage);

export default function Page() {
  const [bracketCreated, setBracketCreated] = useState(false);
  const [bracketInfo, setBracketInfo] = useState(null);
  const [showBrackets, setShowBrackets] = useState(false);
  const [stageData, setStageData] = useState(null);
  const [info, setInfo] = useState(null);
  const [isBracketsViewerReady, setIsBracketsViewerReady] = useState(false);
  const [teams, setTeams] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleInputChange = (e) => {
    setTeams(e.target.value);
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isNaN(teams) || teams === "") {
      setError("Please enter a valid number.");
    } else {
      onTeamSubmit(teams);
      setTeams("");
    }
  };

  const bracketForm = useForm({
    resolver: zodResolver(bracketSchema),
    defaultValues: {
      tournament_name: "",
      format: "single_elimination",
      consolationFinal: false,
      grandFinalType: "simple",
    },
  });

  function onBracketSubmit(values) {
    setBracketInfo(values);
    setBracketCreated(true);
  }

  function onTeamSubmit(values) {
    if (values < 4) {
      toast.error("Number of teams must be greater than 4");
      return;
    }

    const teams = Array.from({ length: values }, (_, i) => `Team${i + 1}`);

    const res = { ...bracketInfo, teams };
    setInfo(res);

    console.log("Bracket Info", JSON.stringify(info, null, 2));

    if (!showBrackets) {
      setShowBrackets(true);
    }

    toast.success("Bracket created successfully");
  }

  async function rendering() {
    if (!info) return;

    const teamArray = info.teams;
    const len = teamArray.length;
    const nearestPowerOf2 = Math.pow(2, Math.ceil(Math.log2(len)));
    const byesCount = nearestPowerOf2 - len;

    const paddedTeams = [
      ...teamArray,
      ...Array.from({ length: byesCount }, (_, i) => `Bye ${i + 1}`),
    ];

    try {
      await manager.create.stage({
        name: info.tournament_name,
        tournamentId: 0,
        type: info.format,
        seeding: paddedTeams,
        settings: {
          consolationFinal: info.consolationFinal,
          grandFinal: info.grandFinalType,
        },
      });

      const data = await manager.get.stageData(0);
      setStageData(data);
      console.log("Stage Data", stageData);
    } catch (error) {
      console.error("Error during rendering:", error);
    }
  }

  async function removeBracket() {
    storage.reset();
    manager.reset;
    setShowBrackets(false);
    setBracketCreated(false);
    bracketForm.reset({
      tournament_name: "",
      format: "single_elimination",
      consolationFinal: false,
      grandFinalType: "simple",
    });
  }

  async function rerendering() {
    if (!isBracketsViewerReady || !stageData) return;

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
    if (showBrackets) {
      rendering();
    }
  }, [showBrackets]);

  useEffect(() => {
    if (typeof window !== "undefined" && window.bracketsViewer) {
      setIsBracketsViewerReady(true);
    }
  }, []);

  useEffect(() => {
    if (isBracketsViewerReady && stageData) {
      rerendering();
    }
  }, [isBracketsViewerReady, stageData]);

  return (
    <div>
      <div className="bg-card border p-6 rounded-md max-w-[80%] mx-auto">
        <div className="text-center flex items-center justify-center border-b pb-6 mb-4">
          <Button
            variant="ghost"
            onClick={() => {
              bracketCreated
                ? setBracketCreated(false)
                : router.push("/bracket");
            }}
            className="mr-auto"
          >
            <FaArrowLeftLong className="size-5 m-0" />
          </Button>
          <h2 className="py-2 scroll-m-20 text-3xl font-semibold tracking-tight absolute left-1/2 transform -translate-x-1/2">
            Create Bracket
          </h2>
        </div>
        {!bracketCreated ? (
          <Form {...bracketForm}>
            <form
              onSubmit={bracketForm.handleSubmit(onBracketSubmit)}
              className="grid grid-cols-2 gap-8"
            >
              <FormField
                control={bracketForm.control}
                name="tournament_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Tournament Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Tournament Name" />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={bracketForm.control}
                name="format"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Format</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Format" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="single_elimination">
                          Single Elimination
                        </SelectItem>
                        <SelectItem value="double_elimination">
                          Double Elimination
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={bracketForm.control}
                name="consolationFinal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">
                      Consolation Final
                    </FormLabel>
                    <Select
                      onValueChange={(value) =>
                        field.onChange(value === "true")
                      }
                      defaultValue={field.value.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Consolation Final" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="true">Yes</SelectItem>
                        <SelectItem value="false">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={bracketForm.control}
                name="grandFinalType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">
                      Grand Final Type
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Grand Final Type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="simple">Simple</SelectItem>
                        <SelectItem value="double">Double</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <div className="col-span-2">
                <Button type="submit" arial-label="create-bracket-btn">
                  Create Bracket
                </Button>
              </div>
            </form>
          </Form>
        ) : (
          <form onSubmit={handleSubmit} className="lg:w-1/2 mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-center">
              Enter Number of Teams
            </h2>
            <div className="flex flex-col justify-center gap-4 md:flex-row lg:flex-row">
              <div>
                <Input
                  type="number"
                  id="number"
                  value={teams}
                  onChange={handleInputChange}
                  placeholder="Enter Number of Teams"
                  className="w-full custom"
                />
                {error && <p style={{ color: "red" }}>{error}</p>}
              </div>
              <Button
                type="submit"
                disabled={showBrackets}
                arial-label="submit-team-btn"
                className="w-full md:w-1/6 lg:w-1/6"
              >
                Submit
              </Button>
            </div>
          </form>
        )}
      </div>
      {showBrackets ? (
        <div className="mt-8 w-[80%] mx-auto">
          <Button onClick={removeBracket} className="mb-1">
            Create New Bracket
          </Button>
          <div className="brackets-viewer custom"></div>
        </div>
      ) : null}
    </div>
  );
}
