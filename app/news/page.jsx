import React from "react";
import News from "../../components/News";
import { Cover } from "../../@/components/ui/cover";

const page = async () => {
  return (
    <div className="flex flex-col justify-center items-center ">
      <div className="min-h-[240px] w-full flex flex-col justify-center items-center px-4  pb-10">
        <h1 className="text-4xl md:text-4xl lg:text-6xl font-semibold max-w-7xl mx-auto text-center mt-6 relative z-20 pt-6 bg-clip-text text-transparent bg-gradient-to-b from-neutral-800 via-neutral-700 to-neutral-700 dark:from-neutral-800 dark:via-white dark:to-white">
          Discover the Hottest News <br />
          <span className="bg-clip-text bg-gradient-to-r from-[#4F46E5] to-[#E114E5] pb-4">
            Lightning Fast
          </span>
        </h1>
      </div>
      <News />
    </div>
  );
};

export default page;
