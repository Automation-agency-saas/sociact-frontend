import { Statistics } from "./Statistics";
import pilot from "../assets/pilot.png";
export const About = () => {
  return (
 
  //   <section id="about" className="container relative py-12 sm:py-16 overflow-hidden ">
  //   {/* Main left-side glow effect */}
  //   <div className="absolute left-1/4 -translate-x-1/2 top-1/2 -translate-y-1/2 w-[500px] h-[500px]">
  //       <div className="absolute inset-0 blur-[100px] bg-[radial-gradient(circle_at_center,rgba(139,51,255,0.35)_0%,rgba(139,51,255,0.15)_35%,transparent_70%)]" />
  //     </div>
      
  //     {/* Secondary overlapping glow for depth */}
  //     <div className="absolute left-1/4 -translate-x-1/3 top-1/2 -translate-y-1/3 w-[400px] h-[400px]">
  //       <div className="absolute inset-0 blur-[120px] bg-[radial-gradient(circle_at_center,rgba(245,150,211,0.2)_0%,rgba(210,71,191,0.15)_45%,transparent_70%)]" />
  //     </div>

  //     {/* Ambient color blend */}
  //     <div className="absolute inset-0">
  //       <div className="absolute inset-0 bg-gradient-to-r from-purple-500/[0.02] via-transparent to-transparent" />
  //     </div>

  //   <div className="relative max-w-3xl mx-auto text-center">
  //     <h2 className="text-3xl md:text-4xl font-bold mb-6">
  //       Empowering Creators with
  //       <span className="bg-gradient-to-r from-[#F596D3] to-[#D247BF] text-transparent bg-clip-text">
  //         {" "}AI-Powered{" "}
  //       </span>
  //       Tools
  //     </h2>
      
  //     <div className="space-y-4 px-4 sm:px-6">
  //       <p className="text-lg sm:text-xl text-muted-foreground">
  //         Founded by content creators for content creators, we understand the challenges of maintaining a strong social media presence. Our mission is to revolutionize content creation through AI automation, helping creators focus on what they do best - being creative.
  //       </p>
  //       <p className="text-lg sm:text-xl text-muted-foreground">
  //         Our suite of AI-powered tools handles everything from content ideation to engagement management, making it easier than ever to grow your audience and create impactful content that resonates.
  //       </p>
  //     </div>

  //     <div className="mt-8">
  //       <Statistics />
  //     </div>
  //   </div>
  // </section>
  <section id="about" className="relative -mb-px bg-background overflow-hidden">
  {/* Container for content width */}
  <div className="container relative py-12 sm:py-16">
    {/* Main glow effect with extended bounds */}
    {/* <div className="absolute left-1/4 -translate-x-1/2 top-1/2 -translate-y-1/2 w-[500px] h-[500px] -m-4">
      <div className="absolute inset-0 blur-[100px] bg-[radial-gradient(circle_at_center,rgba(139,51,255,0.35)_0%,rgba(139,51,255,0.15)_35%,transparent_70%)]" />
    </div> */}
    
    {/* Secondary glow with extended bounds */}
    {/* <div className="absolute left-1/4 -translate-x-1/3 top-1/2 -translate-y-1/3 w-[400px] h-[400px] -m-4">
      <div className="absolute inset-0 blur-[120px] bg-[radial-gradient(circle_at_center,rgba(245,150,211,0.2)_0%,rgba(210,71,191,0.15)_45%,transparent_70%)]" />
    </div> */}

    {/* Smooth transition gradient at bottom */}
    {/* <div className="absolute inset-x-0 -bottom-8 h-16 bg-gradient-to-b from-transparent to-background" /> */}

    {/* Ambient blend with adjusted bounds */}
    {/* <div className="absolute inset-0 -m-4">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/[0.02] via-transparent to-transparent" />
    </div> */}

    {/* Content with proper z-index */}
    <div className="relative z-10 max-w-3xl mx-auto text-center">
      <h2 className="text-3xl md:text-4xl font-bold mb-6">
        Empowering Creators with
        <span className="bg-gradient-to-r from-[#F596D3] to-[#D247BF] text-transparent bg-clip-text">
          {" "}AI-Powered{" "}
        </span>
        Tools
      </h2>
      
      <div className="space-y-4 px-4 sm:px-6">
        <p className="text-lg sm:text-xl text-muted-foreground">
          Founded by content creators for content creators, we understand the challenges of maintaining a strong social media presence. Our mission is to revolutionize content creation through AI automation, helping creators focus on what they do best - being creative.
        </p>
        <p className="text-lg sm:text-xl text-muted-foreground">
          Our suite of AI-powered tools handles everything from content ideation to engagement management, making it easier than ever to grow your audience and create impactful content that resonates.
        </p>
      </div>

      <div className="mt-8">
        <Statistics />
      </div>
    </div>
  </div>
</section>
  );
};
