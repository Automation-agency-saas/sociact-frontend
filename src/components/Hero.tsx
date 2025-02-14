
import { Section } from "./ui/section";
import { HeroParallax } from "./ui/hero-parallax";
export const Hero = () => {


  const products = [
    {
      title: "Youtube Script Generator",
      link: "/auth/sign-up?redirect=/youtube/script-generator",
      thumbnail:
        "https://res.cloudinary.com/dvuohzc5b/image/upload/v1738858669/ttuucrk3khby891ayw8r.png",
    },
   
    {
      title: "Youtube Idea Generator",
      link: "/auth/sign-up?redirect=/youtube/idea-generator",
      thumbnail:
      "https://res.cloudinary.com/dvuohzc5b/image/upload/v1738858670/b1rvszglsbaq0p3ax1ei.png"

    },
    {
      title: "Youtube SEO Optimizer",
      link: "/auth/sign-up?redirect=/youtube/seo-optimizer",
      thumbnail:
      "https://res.cloudinary.com/dvuohzc5b/image/upload/v1738858671/uapkkbafwhmxdcfqy1bc.png"

    },
    {
      title: "Youtube Thumbnail Generator",
      link: "/auth/sign-up?redirect=/youtube/thumbnail-generator",
      thumbnail:
      "https://res.cloudinary.com/dvuohzc5b/image/upload/v1738858692/ickrevf0vx2wb1h2wk2f.png"
    },
   
  ];

  return (
   
    <Section className="fade-bottom overflow-hidden pb-0 sm:pb-0 md:pb-0">

      <HeroParallax products={products} />
 
    </Section>
    
  );
};
