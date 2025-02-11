import { Statistics } from "./Statistics";
import pilot from "../assets/pilot.png";
export const About = () => {
  return (
 

  <section id="about" className="relative  overflow-hidden py-12">
  {/* Container for content width */}


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
  
</section>
  );
};
