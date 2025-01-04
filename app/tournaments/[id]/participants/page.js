"use client";

import { useParams } from "next/navigation";
import ParticipantsSection from "../../../../components/ParticipantsSection";

const ParticipantsPage = () => {
  const params = useParams();
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
          <ParticipantsSection id={params.id} />
        </div>
      </div>
    </div>
  );
};

export default ParticipantsPage;
