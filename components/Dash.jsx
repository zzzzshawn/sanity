"use client";

import Image from "next/image";
import { ContainerScroll } from "../@/components/ui/container-scroll-animation";

export default function Dashboard() {
  return (
    <div className="flex flex-col overflow-hidden">
      <ContainerScroll>
        <Image
          src={`/hero.jpg`}
          alt="hero"
          height={720}
          width={1400}
          className="mx-auto rounded-2xl object-cover h-full object-left-top"
          draggable={false}
        />
      </ContainerScroll>
    </div>
  );
}
