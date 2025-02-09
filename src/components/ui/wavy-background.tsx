// "use client";
// import { cn } from "@/lib/utils";
// import React, { useEffect, useRef, useState } from "react";
// import { createNoise3D } from "simplex-noise";

// export const WavyBackground = ({
//   children,
//   className,
//   containerClassName,
//   colors,
//   waveWidth,
//   backgroundFill,
//   blur = 10,
//   speed = "fast",
//   waveOpacity = 0.5,
//   ...props
// }: {
//   children?: any;
//   className?: string;
//   containerClassName?: string;
//   colors?: string[];
//   waveWidth?: number;
//   backgroundFill?: string;
//   blur?: number;
//   speed?: "slow" | "fast";
//   waveOpacity?: number;
//   [key: string]: any;
// }) => {
//   const noise = createNoise3D();
//   let w: number,
//     h: number,
//     nt: number,
//     i: number,
//     x: number,
//     ctx: any,
//     canvas: any;
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const getSpeed = () => {
//     switch (speed) {
//       case "slow":
//         return 0.001;
//       case "fast":
//         return 0.002;
//       default:
//         return 0.001;
//     }
//   };

//   const init = () => {
//     canvas = canvasRef.current;
//     ctx = canvas.getContext("2d");
//     w = ctx.canvas.width = window.innerWidth;
//     h = ctx.canvas.height = window.innerHeight;
//     ctx.filter = `blur(${blur}px)`;
//     nt = 0;
//     window.onresize = function () {
//       w = ctx.canvas.width = window.innerWidth;
//       h = ctx.canvas.height = window.innerHeight;
//       ctx.filter = `blur(${blur}px)`;
//     };
//     render();
//   };

//   const waveColors = colors ?? [
//     "#38bdf8",
//     "#818cf8",
//     "#c084fc",
//     "#e879f9",
//     "#22d3ee",
//   ];
//   const drawWave = (n: number) => {
//     nt += getSpeed();
//     for (i = 0; i < n; i++) {
//       ctx.beginPath();
//       ctx.lineWidth = waveWidth || 50;
//       ctx.strokeStyle = waveColors[i % waveColors.length];
//       for (x = 0; x < w; x += 5) {
//         var y = noise(x / 800, 0.3 * i, nt) * 100;
//         ctx.lineTo(x, y + h * 0.5); // adjust for height, currently at 50% of the container
//       }
//       ctx.stroke();
//       ctx.closePath();
//     }
//   };

//   let animationId: number;
//   const render = () => {
//     ctx.fillStyle = backgroundFill || "black";
//     ctx.globalAlpha = waveOpacity || 0.5;
//     ctx.fillRect(0, 0, w, h);
//     drawWave(5);
//     animationId = requestAnimationFrame(render);
//   };

//   useEffect(() => {
//     init();
//     return () => {
//       cancelAnimationFrame(animationId);
//     };
//   }, []);

//   const [isSafari, setIsSafari] = useState(false);
//   useEffect(() => {
//     // I'm sorry but i have got to support it on safari.
//     setIsSafari(
//       typeof window !== "undefined" &&
//         navigator.userAgent.includes("Safari") &&
//         !navigator.userAgent.includes("Chrome")
//     );
//   }, []);

//   return (
//     <div
//       className={cn(
//         "h-screen flex flex-col items-center justify-center",
//         containerClassName
//       )}
//     >
//       <canvas
//         className="absolute inset-0 z-0"
//         ref={canvasRef}
//         id="canvas"
//         style={{
//           ...(isSafari ? { filter: `blur(${blur}px)` } : {}),
//         }}
//       ></canvas>
//       <div className={cn("relative z-10", className)} {...props}>
//         {children}
//       </div>
//     </div>
//   );
// };

import { cn } from "@/lib/utils";
import React, { useEffect, useRef, useState } from "react";
import { createNoise3D } from "simplex-noise";

interface WavyBackgroundProps {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  colors?: string[];
  waveWidth?: number;
  backgroundFill?: string;
  blur?: number;
  speed?: "slow" | "fast";
  waveOpacity?: number;
  [key: string]: any;
}

export const WavyBackground: React.FC<WavyBackgroundProps> = ({
  children,
  className,
  containerClassName,
  colors,
  waveWidth = 50,
  backgroundFill = "transparent",
  blur = 10,
  speed = "fast",
  waveOpacity = 0.5,
  ...props
}) => {
  const noise = createNoise3D();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isSafari, setIsSafari] = useState<boolean>(false);

  useEffect(() => {
    setIsSafari(
      typeof window !== "undefined" &&
        navigator.userAgent.includes("Safari") &&
        !navigator.userAgent.includes("Chrome")
    );
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const waveColors = colors ?? [
      "#38bdf8",
      "#818cf8",
      "#c084fc",
      "#e879f9",
      "#22d3ee",
    ];

    const setCanvasSize = () => {
      const container = canvas.parentElement;
      if (!container) return;
      
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;
      ctx.filter = `blur(${blur}px)`;
    };

    const drawWave = () => {
      const speedFactor = speed === "fast" ? 0.002 : 0.001;
      time += speedFactor;

      ctx.fillStyle = backgroundFill;
      ctx.globalAlpha = waveOpacity;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.lineWidth = waveWidth;
        ctx.strokeStyle = waveColors[i % waveColors.length];

        for (let x = 0; x < canvas.width; x += 5) {
          const y = noise(x / 800, 0.3 * i, time) * 100;
          if (x === 0) {
            ctx.moveTo(x, y + canvas.height * 0.5);
          } else {
            ctx.lineTo(x, y + canvas.height * 0.5);
          }
        }
        
        ctx.stroke();
        ctx.closePath();
      }

      animationId = requestAnimationFrame(drawWave);
    };

    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);
    drawWave();

    return () => {
      window.removeEventListener('resize', setCanvasSize);
      cancelAnimationFrame(animationId);
    };
  }, [blur, backgroundFill, colors, speed, waveOpacity, waveWidth, noise]);

  return (
    <div className={cn("relative min-h-[500px] w-full", containerClassName)}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{
          ...(isSafari ? { filter: `blur(${blur}px)` } : {}),
        }}
      />
      <div className={cn("relative z-10", className)} {...props}>
        {children}
      </div>
    </div>
  );
};