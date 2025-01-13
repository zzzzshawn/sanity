"use client";

import Image from "next/image";

export default function Dashboard() {
  return (
    <div className="container mx-auto px-4 py-20">
      <Image
        src="/hero.jpg"
        height={1000}
        width={1200}
        className="rounded-2xl shadow-2xl mx-auto w-11/12 md:w-3/4"
        alt="Sanity Esports Hero"
        priority
      />
    </div>
  );
}
