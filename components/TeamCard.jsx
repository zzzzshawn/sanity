import Link from "next/link";
import React from "react";
import { MdLeaderboard } from "react-icons/md";
import { Button } from "./ui/button";
import { Separator } from "../@/components/ui/separator";

const TeamCard = ({ team }) => {

  return (
    <div className="p-4 bg-slate-800 text-white mb-4 rounded-md">
      <div className="border-b-4 border-b-stone-600">
        <div className="flex justify-between items-center mb-5">
          <Link href={`/teams/${team._id}`} className="flex items-center">
            <img
              src={team.image || "https://via.placeholder.com/40"}
              alt={`${team.name} logo`}
              className="w-10 h-10 rounded-full mr-4"
            />
            <h3 className="text-xl">{team.teamname}</h3>
          </Link>
          <button className="bg-transparent border-2 border-blue-800 px-4 py-2 rounded hidden md:block">
            Request to join
          </button>
        </div>
      </div>

      <div className="flex gap-4 flex-wrap">
        <div className="flex gap-2 items-center text-gray-400">
          <Gamepad2 />
          <p>{team.game}</p>
        </div>

        <div className="flex gap-2 items-center text-gray-400">
          <ShieldAlert />
          <p>{team.role}</p>
        </div>

        <div className="flex gap-2 items-center text-gray-400">
          <MdLeaderboard />
          <p>{team.rank}</p>
        </div>

        <div className="flex gap-2 items-center text-gray-400">
          <Router />
          <p>{team.rank}</p>
        </div>
      </div>

      <Separator className="bg-gray-400" />

      <div className="flex justify-between flex-wrap">
        <div className="flex gap-2 items-center text-gray-400">
          <Users />
          <span className="block">{team.players.join(" , ")}</span>
        </div>

        <div className="flex gap-2 items-center text-gray-400">
          <Languages />
          <span className="block">{team.language}</span>
        </div>
      </div>

      <div>
        <Button className="w-full" arial-label="request-to-join-btn">
          Request to Join
        </Button>
      </div>
    </div>
  );
};

export default TeamCard;
