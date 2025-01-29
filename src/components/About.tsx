import { Statistics } from "./Statistics";
import pilot from "../assets/pilot.png";
export const About = () => {
  return (
    <section
      id="about"
      className="container py-24 sm:py-32"
    >
      <div className="bg-muted/50 border rounded-lg py-12">
        <div className="px-6 flex flex-col-reverse md:flex-row gap-8 md:gap-12">
          <img
            src={pilot}
            alt="AI-powered social media automation"
            className="w-[300px] object-contain rounded-lg"
          />
          <div className="flex flex-col justify-between">
            <div className="pb-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                Empowering Creators with
                <span className="bg-gradient-to-r from-[#F596D3] to-[#D247BF] text-transparent bg-clip-text">
                  {" "}AI-Powered{" "}
                </span>
                Tools
              </h2>
              <p className="text-xl text-muted-foreground mt-4">
                Founded by content creators for content creators, we understand the challenges of maintaining a strong social media presence. Our mission is to revolutionize content creation through AI automation, helping creators focus on what they do best - being creative.
              </p>
              <p className="text-xl text-muted-foreground mt-4">
                Our suite of AI-powered tools handles everything from content ideation to engagement management, making it easier than ever to grow your audience and create impactful content that resonates.
              </p>
            </div>

            <Statistics />
          </div>
        </div>
      </div>
    </section>
  );
};
