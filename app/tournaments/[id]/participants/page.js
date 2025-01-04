"use client";

import { parseParameter } from "next/dist/shared/lib/router/utils/route-regex";
import ParticipantsSection from "../../../../components/ParticipantsSection";

const ParticipantsPage = () => {
  const id = parseParameter(params.id);
  return (
    <div className="px-[5%] xl:px-[12%] min-h-[70vh] transition-all">
      {/* Participants */}
      <div className="mt-20 flex flex-col">
        {/* title */}
        <div className="flex justify-between items-center pb-[20px] border-b-[1px] border-tertiary">
          <h1 className="text-4xl font-semibold">Participants</h1>
        </div>
        {/* participants */}
        <div className="mt-10 flex flex-col gap-5">
          <ParticipantsSection id={id} />
        </div>
      </div>
    </div>
  );
};

export default ParticipantsPage;
