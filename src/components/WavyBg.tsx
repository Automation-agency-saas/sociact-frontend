// "use client";
// import React from "react";
// import { WavyBackground } from "@/components/ui/wavy-background";

// export function WavyBackgroundDemo() {
//   return (
//     <WavyBackground className="max-w-4xl mx-auto pb-40">
//       <p className="text-2xl md:text-4xl lg:text-7xl text-white font-bold inter-var text-center">
//         Hero waves are cool
//       </p>
//       <p className="text-base md:text-lg mt-4 text-white font-normal inter-var text-center">
//         Leverage the power of canvas to create a beautiful hero section
//       </p>
//     </WavyBackground>
//   );
// }
"use client";
import { WavyBackground } from "@/components/ui/wavy-background";

export  function WavyBackgroundDemo() {
  return (
    <section className="w-full mt-20">
      <WavyBackground
        className="max-w-4xl mx-auto px-4 py-16"
        containerClassName="min-h-[500px]"
        colors={["#38bdf8", "#818cf8", "#c084fc", "#e879f9", "#22d3ee"]}
        waveWidth={50}
        backgroundFill="black"
        blur={10}
        speed="fast"
        waveOpacity={0.5}
      >
        <p className="text-2xl md:text-4xl lg:text-7xl text-white font-bold text-center">
          Hero waves are cool
        </p>
        <p className="text-base md:text-lg mt-4 text-white font-normal text-center">
          Leverage the power of canvas to create a beautiful hero section
        </p>
      </WavyBackground>
    </section>
  );
}