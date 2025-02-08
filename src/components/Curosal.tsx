

import { Splide, SplideSlide } from '@splidejs/react-splide';
import { AutoScroll } from '@splidejs/splide-extension-auto-scroll';
import '@splidejs/react-splide/css';

function AutoScrollCarousel() {
  const options = {
    type: 'loop',
    gap: '2rem',
    drag: 'free',
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
    height: '160px',
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
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      <Splide options={options} extensions={{ AutoScroll }} className="py-4">
        {tools.map((tool, index) => (
          <SplideSlide key={index}>
            <div className="group h-full px-6 py-4 rounded-xl transition-all duration-300 
                          hover:bg-gradient-to-r hover:from-primary/20 hover:to-secondary/20
                          border border-gray-700/10 hover:border-primary/30">
              <div className="flex items-center justify-center h-full">
                <h1 className="text-3xl sm:text-4xl font-bold text-center
                             bg-gradient-to-r from-primary via-purple-500 to-secondary 
                             bg-clip-text text-transparent
                             transform transition-all duration-300 group-hover:scale-105">
                  {tool}
                </h1>
              </div>
              
              {/* Hover glow effect */}
              <div className="absolute inset-0 -z-10 bg-gradient-to-r from-primary/10 to-secondary/10 
                            opacity-0 group-hover:opacity-100 blur-xl transition-all duration-300 rounded-xl">
              </div>
            </div>
          </SplideSlide>
        ))}
      </Splide>
    </div>
  );
}

export default AutoScrollCarousel;
  