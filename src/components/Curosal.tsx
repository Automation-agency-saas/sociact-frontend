import { Splide, SplideSlide } from '@splidejs/react-splide';
import { AutoScroll } from '@splidejs/splide-extension-auto-scroll';
import '@splidejs/react-splide/css';

function AutoScrollCarousel() {
  const options = {
    type: 'loop',
    gap: '2rem',
    drag: 'free',
    arrows: false,
    pagination: false,
    perPage: 4,
    autoScroll: {
      speed: 1,
      pauseOnHover: true,
      pauseOnFocus: false,
      rewind: false,
    },
    breakpoints: {
      1440: { perPage: 4 },
      1024: { perPage: 3 },
      768: { perPage: 2 },
      640: { perPage: 1 }
    },
  };

  const tools = [
    "IdeaForge",
    "ReelSpark",
    "ThreadMind",
    "ProMind",
    "ScriptCraft",
    "CaptionCraft",
    "ThreadCraft",
    "ProCraft",
    "SeoPro",
    "CommentPro-Instagram",
    "CommentPro-Facebook",
    "ThumbnailPro",
    "ThumbnailGen"
  ];

  return (
    <div className="w-full bg-gradient-to-b from-background to-background/80 py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-secondary">
            Unleash Your Social Media Potential
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover our powerful suite of AI-powered tools designed to elevate your social media presence
          </p>
        </div>

        <Splide options={options} extensions={{ AutoScroll }}>
          {tools.map((tool, index) => (
            <SplideSlide key={index}>
              <div className="group relative">
                <div className="relative z-10 h-40 rounded-2xl bg-black/5 backdrop-blur-sm 
                              flex items-center justify-center p-6
                              transform transition-all duration-500 hover:scale-105
                              hover:bg-gradient-to-r hover:from-primary/10 hover:via-purple-500/10 hover:to-secondary/10">
                  <h3 className="text-2xl font-semibold text-center
                               bg-gradient-to-r from-primary via-purple-500 to-secondary 
                               bg-clip-text text-transparent
                               transform transition-all duration-300">
                    {tool}
                  </h3>
                </div>
                
                {/* Ambient light effect */}
                <div className="absolute inset-0 -z-10 bg-gradient-to-r from-primary/20 via-purple-500/20 to-secondary/20 
                              opacity-0 group-hover:opacity-100 blur-2xl transition-all duration-500 rounded-3xl">
                </div>
              </div>
            </SplideSlide>
          ))}
        </Splide>
      </div>
    </div>
  );
}

export default AutoScrollCarousel;