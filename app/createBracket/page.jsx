"use client";

import { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../@/components/ui/select";
import { Input } from "../../@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { InMemoryDatabase } from "brackets-memory-db";
import { BracketsManager } from "brackets-manager";

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
    } else if ((values & (values - 1)) !== 0) {
      toast.error("Number of teams must be a power of 2 (e.g. 4, 8, 16, etc.)");
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

    try {
      await manager.create.stage({
        name: info.tournament_name,
        tournamentId: 0,
        type: info.format,
        seeding: info.teams,
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
  }

  async function rerendering() {
    if (!isBracketsViewerReady || !stageData) return;

    // window.bracketsViewer.onMatchClicked = async (match) => {
    //   try {
    //     await manager.update.match({
    //       id: match.id,
    //       opponent1: { score: 5 },
    //       opponent2: { score: 7, result: "win" },
    //     });
    //   } catch (error) {}
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
      {
        onMatchClick: (match) => console.log("A match was clicked", match),
        selector: "#example",
        participantOriginPlacement: "before",
        separatedChildCountLabel: true,
        showSlotsOrigin: true,
        showLowerBracketSlotsOrigin: true,
        highlightParticipantOnHover: true,
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
        <div className="text-center flex items-center justify-center border-b pb-4 mb-4">
          <h2 className="pb-2 scroll-m-20 text-3xl font-semibold tracking-tight absolute left-1/2 transform -translate-x-1/2">
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
            <h2 className="text-2xl font-bold">Enter Number of Teams</h2>
            <p className="text-sm text-muted-foreground mb-2">
              The number of teams must be a power of 2 (e.g., 4, 8, 16, etc.).
            </p>
            <Input
              type="text"
              id="number"
              value={teams}
              onChange={handleInputChange}
              placeholder="Enter Number of Teams"
            />
            {error && <p style={{ color: "red" }}>{error}</p>}
            <div className="flex justify-center mt-4">
              <Button
                type="submit"
                disabled={showBrackets}
                arial-label="submit-team-btn"
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
            Clear
          </Button>
          <div className="brackets-viewer custom"></div>
        </div>
      ) : null}
    </div>
  );
}
