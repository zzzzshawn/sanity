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

const teamSchema = z.object({
  teams: z.array(z.string().min(1)).min(4, "At least 4 teams are required"),
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

  const bracketForm = useForm({
    resolver: zodResolver(bracketSchema),
    defaultValues: {
      tournament_name: "",
      format: "single_elimination",
      consolationFinal: false,
      grandFinalType: "simple",
    },
  });

  const teamForm = useForm({
    resolver: zodResolver(teamSchema),
    defaultValues: {
      teams: ["", "", "", ""],
    },
  });

  async function onBracketSubmit(values) {
    setBracketInfo(values);
    setBracketCreated(true);
  }

  async function onTeamSubmit(values) {
    if (
      values.teams.length < 2 ||
      (values.teams.length & (values.teams.length - 1)) !== 0
    ) {
      toast.error("Number of teams must be a power of 2 (e.g. 4, 8, 16, etc.)");
      return;
    }

    const res = { ...bracketInfo, ...values };
    setInfo(res);

    console.log("Bracket Info", JSON.stringify(info, null, 2));

    setShowBrackets(true);

    await rendering();
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

  async function rerendering() {
    if (!isBracketsViewerReady || !stageData) return;

    try {
      const bracketsViewerNode = document.querySelector(".brackets-viewer");
      bracketsViewerNode?.replaceChildren();

      try {
        window.bracketsViewer.onMatchClicked = async (match) => {
          console.log("A match was clicked", match);

          await manager.update.match({
            id: match.id,
            opponent1: { score: 5 },
            opponent2: { score: 7, result: "win" },
          });
          const tourneyData2 = await manager.get.currentMatches(0);
          const tourneyData = await manager.get.stageData(0);
          setStageData(tourneyData);
          console.log("A tourney", tourneyData2);
        };
      } catch (error) {}

      if (stageData.participant) {
        window.bracketsViewer.setParticipantImages(
          stageData.participant.map((participant) => ({
            participantId: participant.id,
            imageUrl: "https://github.githubassets.com/pinned-octocat.svg",
          })),
        );
      }

      window.bracketsViewer.render(
        {
          stages: stageData.stage,
          matches: stageData.match,
          matchGames: stageData.match_game,
          participants: stageData.participant,
        },
        {
          customRoundName: (info, t) => {
            if (info.fractionOfFinal === 1 / 2) {
              return "Semi Finals";
            }
            if (info.fractionOfFinal === 1 / 4) {
              return "Quarter Finals";
            }
            if (info.finalType === "grand-final") {
              return `Grand Final`;
            }
          },
        },
      );
    } catch (error) {
      console.error("Error during rerendering:", error);
    }
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
          <Form {...teamForm}>
            <form
              onSubmit={teamForm.handleSubmit(onTeamSubmit)}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold mb-4">Enter Team Names</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Please enter at least 4 team names.
              </p>
              {teamForm.watch("teams").map((_, index) => (
                <FormField
                  key={index}
                  control={teamForm.control}
                  name={`teams.${index}`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">
                        Team {index + 1}
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder={`Team ${index + 1} Name`}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  teamForm.setValue("teams", [...teamForm.watch("teams"), ""])
                }
                arial-label="add-another-team-btn"
              >
                Add Another Team
              </Button>
              <div>
                <Button
                  type="submit"
                  disabled={teamForm.formState.isSubmitting}
                  arial-label="submit-team-btn"
                >
                  Submit Teams
                </Button>
              </div>
            </form>
          </Form>
        )}
      </div>
      {showBrackets ? (
        <div className="mt-8 w-[80%] mx-auto">
          <div className="brackets-viewer custom"></div>
        </div>
      ) : null}
    </div>
  );
}
