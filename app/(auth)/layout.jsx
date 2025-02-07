// "use client";

import React from "react";
import { motion } from "motion/react";
import { AuroraBackground } from "../../@/components/ui/aurora-background";

export default function AuthLayout({ children }) {
  return (
    <div>
      {/* <AuroraBackground> */}
      <div className="flex border h-[90vh] -mt-8 w-[98%] mx-auto rounded-2xl  border-zinc-200/20 ">
        <div className="w-1/2 relative p-2 flex items-center justify-center max-md:hidden">
          {/* <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.3,
                duration: 0.8,
                ease: "easeInOut",
              }}
              className="relative flex flex-col gap-4 items-center justify-center px-4"
            > */}
          <div className="text-4xl md:text-4xl lg:text-6xl font-semibold max-w-7xl mx-auto text-center relative z-20 pb-2 bg-clip-text text-transparent bg-gradient-to-b from-neutral-800 via-neutral-700 to-neutral-700 dark:from-neutral-800 dark:via-white dark:to-white">
            Welcome to Sanity
          </div>
          {/* </motion.div> */}
        </div>
        <div className="w-1/2 max-md:w-full relative p-2 flex items-center justify-center">
          {children}
        </div>
      </div>

      {/* </AuroraBackground> */}
    </div>
  );
}
