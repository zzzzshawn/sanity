import React from "react";
import { fetchTeamById } from "../../../actions/teams/teams.action";
import Image from "next/image";
import { Check, X } from "lucide-react";

const TeamDetails = async ({ params }) => {
  const id = params.id;

  const team = await fetchTeamById(id);

  return (
    <div className="w-full max-w-5xl mx-auto h-full  p-10">
      <div className="relative w-full items-start gap-2 grid md:grid-cols-3 md:grid-rows-3 md:h-[600px]">
        <svg
          className="pointer-events-none fixed isolate z-50 opacity-70 mix-blend-soft-light"
          width="100%"
          height="100%"
        >
          <filter id="noise">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.80"
              numOctaves="4"
              stitchTiles="stitch"
            />
          </filter>
          <rect width="100%" height="100%" filter="url(#noise)" />
        </svg>
        <div className="w-full p-10 h-full flex items-center justify-center gap-2 mx-auto border md:col-start-1 md:col-end-3 md:row-start-1 md:row-end-3  rounded-sm bg-gradient-to-br to-black via-purple-800/20 from-purple-600/40 border-zinc-200/20">
          <Image
            src={team.image || "https://via.placeholder.com/40"}
            alt=""
            width={100}
            height={100}
            className="size-20 rounded-full"
          />
          <p className="text-5xl font-bold underline underline-offset-4 uppercase">
            {team.teamname}
          </p>
        </div>
        <div className="md:col-start-3 md:col-end-4 md:row-start-1 md:row-end-2 h-full w-full border font-mono rounded-sm bg-gradient-to-br from-purple-600/30 via-purple-950/10 to-purple-600/30 flex flex-col justify-center p-5 border-zinc-200/20">
          <p className="text-xl">
            Leader: <b>Anon</b>
            {/* Put this field in team model if needed */}
          </p>
          <p className="text-xl capitalize">
            Game: <b>{team.game}</b>
          </p>
        </div>
        <div className="md:row-start-3 md:col-start-1 size-full border rounded-sm bg-gradient-to-b from-black via-purple-600/30 p-5 font-mono flex flex-col justify-center border-zinc-200/20">
          <p className="text-lg capitalize ">Role: {team.role}</p>
          <p className="text-lg capitalize ">Rank: {team.rank}</p>
          <p className="text-lg capitalize ">Server: {team.server}</p>
          <p className="text-lg capitalize ">Language: {team.language}</p>
        </div>

        <div className="md:row-start-3 md:col-start-2 size-full border rounded-sm font-mono p-5 flex gap-2 border-zinc-200/20 bg-gradient-to-r from-purple-600/30">
          <p>Players:</p>
          {team.players.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>

        <div className="md:row-start-2 max-sm:max-h-[400px]  md:row-end-4 md:col-start-3 size-full overflow-auto border rounded-sm bg-gradient-to-r from-black to-black via-purple-600/30 border-zinc-200/20 font-mono p-5 flex flex-col gap-5">
          <p className="text-xl">Requests</p>
          <div className="w-full h-[90%]I flex flex-col gap-2 overflow-auto">
            {["tron", "hype", "mortal", "anon", "idk", "bot", "scythe", "shadow", "hype", "mortal", "anon", "idk",].map((req) => (
              <div
                key={req}
                className="border border-zinc-200/20 backdrop-blur-lg backdrop-saturate-200 bg-zinc-800/20 w-full rounded-lg px-3 py-2 flex justify-between items-center"
              >
                <p>{req}</p>
                <div className=" flex items-center justify-center gap-2">
                  <button className="border border-zinc-200/20 rounded-full p-1"><X className="text-red-600 size-5"/></button>
                  <button className="border border-zinc-200/20 rounded-full p-1"><Check className="text-green-600 size-5" /> </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamDetails;
