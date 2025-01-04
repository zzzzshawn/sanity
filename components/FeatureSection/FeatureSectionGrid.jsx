import { cn } from "../../@/lib/utils";
import Image from "next/image";
import createGlobe from "cobe";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { IconBrandDiscordFilled } from "@tabler/icons-react";
import { SkeletonTwo } from "../SkeletonTwo";

export default function FeaturesSectionGrid() {
  const features = [
    {
      title: "Create Tournaments Effortlessly",
      description:
        "Organize and manage your own esports tournaments with ease using our intuitive interface.",
      skeleton: <SkeletonOne />,
      className: "col-span-1 lg:col-span-4 border-b lg:border-r",
    },
    {
      title: "Most Games Included",
      description:
        "Join tournaments and play across a wide range of popular games.",
      skeleton: <SkeletonTwo />,
      className: "border-b col-span-1 lg:col-span-2",
    },
    {
      title: "Join Our Discord Community",
      description:
        "Connect with fellow gamers, stay updated and participate in exclusive events by joining our Discord community.",
      skeleton: <SkeletonThree />,
      className: "col-span-1 lg:col-span-3 lg:border-r ",
    },
    {
      title: "Global Esports Community",
      description:
        "Connect and compete with players from around the world on our global platform.",
      skeleton: <SkeletonFour />,
      className: "col-span-1 lg:col-span-3 border-b lg:border-none relative",
    },
  ];

  return (
    <div className="relative z-20 pt-5 pb-5 lg:py-20 max-w-6xl mx-auto">
      <div className="px-8">
        <h4 className="text-3xl lg:text-5xl lg:leading-tight max-w-5xl mx-auto text-center tracking-tight font-medium text-white">
          Unlike any other Esports platform
        </h4>

        <p className="text-sm lg:text-base  max-w-2xl  my-4 mx-auto text-neutral-500 text-center font-normal">
          Sanity Gaming covers every single aspect of esports community. Which a
          gamer desires we aim to connect organizers with players.
        </p>
      </div>

      <div className="relative ">
        <div className="grid grid-cols-1 lg:grid-cols-6 mt-12 border rounded-md">
          {features.map((feature) => (
            <FeatureCard key={feature.title} className={feature.className}>
              <FeatureTitle className="text-white">
                {feature.title}
              </FeatureTitle>
              <FeatureDescription>{feature.description}</FeatureDescription>
              <div className=" h-full w-full ">{feature.skeleton}</div>
            </FeatureCard>
          ))}
        </div>
      </div>
    </div>
  );
}

const FeatureCard = ({ children, className }) => {
  return (
    <div className={cn(`p-4 sm:p-8 relative overflow-hidden`, className)}>
      {children}
    </div>
  );
};

const FeatureTitle = ({ children }) => {
  return (
    <p className=" max-w-5xl mx-auto text-left tracking-tight text-black text-xl md:text-2xl md:leading-snug">
      {children}
    </p>
  );
};

const FeatureDescription = ({ children }) => {
  return (
    <p
      className={cn(
        "text-sm md:text-base  max-w-4xl text-left mx-auto",
        "text-neutral-500 text-center font-normal",
        "text-left max-w-sm mx-0 md:text-sm my-2",
      )}
    >
      {children}
    </p>
  );
};

export const SkeletonOne = () => {
  return (
    <div className="relative flex py-8 px-2 gap-10 h-full">
      <div className="w-full   p-5  mx-auto shadow-2xl group h-full">
        <div className="flex  relative flex-1 w-full flex-col space-y-2  ">
          {/* TODO */}
          <Image
            src="/hero.jpg"
            alt="header"
            width={1000}
            height={1000}
            className="full rounded-sm "
            draggable="false"
          />
          <div className="absolute bottom-0 z-40 inset-x-0 h-1/2 bg-gradient-to-t from-black via-black/80 to-transparent w-full pointer-events-none " />
          <div className="absolute top-0 z-40 inset-x-0 h-60 bg-gradient-to-b from-black via-transparent to-transparent w-full pointer-events-none" />
        </div>
      </div>
    </div>
  );
};

export const SkeletonThree = () => {
  const [showLogo, setShowLogo] = useState(false);

  return (
    <Link
      href="https://discord.com/invite/AB2vCdyw"
      target="__blank"
      className="relative flex gap-10  h-full group/image border-b"
      aria-label="discord-btn"
    >
      <div className="w-full  mx-auto bg-transparent group h-full">
        <div
          className="flex flex-1 w-full h-full flex-col space-y-2 relative"
          onMouseEnter={() => setShowLogo(true)}
          onMouseLeave={() => setShowLogo(false)}
        >
          {/* TODO */}
          {showLogo ? (
            <IconBrandDiscordFilled className="h-20 w-20 mx-auto top-1/4 absolute z-10 inset-0 text-white" />
          ) : (
            ""
          )}
          <Image
            src="/discord-bg.png"
            alt="header"
            width={800}
            height={800}
            className="mt-2 object-cover object-center rounded-sm blur-none group-hover/image:blur-md transition-all duration-200"
            draggable="false"
          />
        </div>
      </div>
    </Link>
  );
};

export const SkeletonFour = () => {
  return (
    <div className="h-60 md:h-60  flex flex-col items-center absolute w-full right-0 bg-transparent mt-10">
      {/* <Globe className="absolute -right-10 md:-right-20 -bottom-80 md:-bottom-72" /> */}
      <Image
        src="/assets/globe.png"
        alt=""
        width={500}
        height={500}
        className="w-full "
      />
    </div>
  );
};
