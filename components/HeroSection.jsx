"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { HeroHighlight } from "../@/components/ui/hero";

export default function HeroSection({}) {
  return (
    // <HeroHighlight>
    <motion.section
      className="flex flex-col lg:py-20"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.4 }}
    >
      {/* <Vortex> */}
      <div className="text-center max-w-4xl mx-auto space-y-6 pb-10">
        <div className="flex items-center  gap-2 w-fit mx-auto px-4 py-2  rounded-full text-sm font-medium border border-neutral-700">
          <h2 className="bg-gradient-to-r bg-clip-text text-transparent from-gray-600 via-gray-600 to-gray-600 dark:from-neutral-500 dark:via-white dark:to-white ">
            Discover new heights
          </h2>
        </div>

        <h1 className="text-4xl md:text-4xl lg:text-6xl font-semibold max-w-7xl mx-auto text-center relative z-20  bg-clip-text text-transparent bg-gradient-to-b from-neutral-700 via-neutral-700 to-neutral-700 dark:from-neutral-800 dark:via-slate-300 dark:to-slate-300 ">
          Compete like never before in the ultimate esports tournaments!{" "}
        </h1>

        <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-slate-200">
          Sanity is a suite of powerful tools for organizers, agencies, studios
          and publishers to manage and showcase their tournaments.
        </p>

        <div className="flex items-center justify-center gap-4 pt-4">
          <Link href="#feature-section" passHref>
            <button className="p-[2px] relative">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
              <div className="px-8 py-2  bg-black rounded-[6px]  relative group transition duration-200 text-white hover:bg-transparent">
                Host a Tournament
              </div>
            </button>
          </Link>
          <Link href="#faq-section" passHref>
            <button className="relative inline-flex h-12 overflow-hidden rounded-full p-[2px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
              <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
              <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-4 py-1 text-sm font-medium text-white backdrop-blur-3xl">
                Learn More
              </span>
            </button>
          </Link>
        </div>
      </div>
      {/* </Vortex> */}
{/* 
      <div className="mt-20">
        
      </div> */}
    </motion.section>
// </HeroHighlight>
  );
}
