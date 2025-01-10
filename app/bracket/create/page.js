"use client";

import { useState } from "react";
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
import { FaArrowLeftLong } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import Bracket from "../Bracket";

const bracketSchema = z.object({
  tournament_name: z.string().min(1),
  format: z.enum(["single_elimination", "double_elimination"]),
  consolationFinal: z.boolean().default(false),
  grandFinalType: z.enum(["simple", "double"]),
});

export default function Page() {
  const [bracketCreated, setBracketCreated] = useState(false);
  const [bracketInfo, setBracketInfo] = useState(null);
  const [showBrackets, setShowBrackets] = useState(false);
  const [info, setInfo] = useState(null);
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

  async function sendBrackets(values) {
    try {
      const response = await fetch("/api/brackets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tournament_name: values.tournament_name,
          format: values.format,
          consolationFinal: values.consolationFinal,
          grandFinalType: values.grandFinalType,
          teams: values.teams,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Bracket created successfully!");
        console.log("Created Bracket ID:", result.id);
      } else {
        toast.error(result.error || "Failed to create bracket.");
      }
    } catch (error) {
      console.error("Error creating bracket:", error);
      toast.error("An unexpected error occurred.");
    }
  }

  function onTeamSubmit(values) {
    if (values < 4) {
      toast.error("Number of teams must be greater than 4");
      return;
    }

    const teams = Array.from({ length: values }, (_, i) => `Team${i + 1}`);

    const res = { ...bracketInfo, teams };
    setInfo(res);

    sendBrackets({
      tournament_name: res.tournament_name,
      format: res.format,
      consolationFinal: res.consolationFinal,
      grandFinalType: res.grandFinalType,
      teams: res.teams,
    });

    // console.log("Bracket Info", JSON.stringify(info, null, 2));

    if (!showBrackets) {
      setShowBrackets(true);
    }

    toast.success("Bracket created successfully");
  }

  return (
    <div>
      <div className="bg-card border p-6 rounded-md max-w-[80%] mx-auto">
        <div className="text-center flex items-center justify-center border-b pb-6 mb-4">
          <Button
            variant="ghost"
            onClick={() => {
              if (bracketCreated) {
                setBracketCreated(false);
                setShowBrackets(false);
              } else {
                router.push("/bracket");
              }
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
          <Bracket
            teams={info.teams}
            tournament_name={info.tournament_name}
            format={info.format}
            consolationFinal={info.consolationFinal}
            grandFinalType={info.grandFinalType}
          />
        </div>
      ) : null}
    </div>
  );
}
