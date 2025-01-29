import { Badge } from "./ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const features = [
  {
    title: "AI-Powered Content Creation",
    description: "Our advanced AI understands your niche and audience, generating trending video ideas, engaging scripts, and eye-catching thumbnails that drive views.",
    image: "/features/ai-content.png"
  },
  {
    title: "Smart Automation",
    description: "Automate your entire workflow from scheduling posts to engaging with comments. Our AI ensures your content goes live at the perfect time for maximum impact.",
    image: "/features/automation.png"
  },
  {
    title: "Cross-Platform Management",
    description: "Manage all your social media accounts from one dashboard. Post, monitor, and analyze your content across YouTube, Instagram, TikTok, and more.",
    image: "/features/cross-platform.png"
  }
];

const featureList = [
  "AI Video Ideas",
  "Script Generation",
  "Thumbnail Creation",
  "Comment Management",
  "Analytics Dashboard",
  "SEO Optimization",
  "Multi-Platform Support",
  "Engagement Tracking",
  "Content Calendar",
  "Performance Insights",
  "Audience Analytics",
  "Trend Detection"
];

export const Features = () => {
  return (
    <section id="features" className="container py-24 sm:py-32 space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
          Transform Your Social Media
          <span className="bg-gradient-to-r from-[#F596D3] to-[#D247BF] text-transparent bg-clip-text">
            {" "}Workflow{" "}
          </span>
        </h2>
        <p className="text-lg text-muted-foreground max-w-[900px] mx-auto">
          Our AI-powered platform streamlines your content creation process, from ideation to analytics. 
          Focus on creating while we handle the heavy lifting.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map(({ title, description, image }) => (
          <Card key={title} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-xl">{title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">{description}</p>
              <img
                src={image}
                alt={title}
                className="w-full h-48 object-cover rounded-lg"
              />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-wrap justify-center gap-4 pt-8">
        {featureList.map((feature) => (
          <Badge
            key={feature}
            variant="secondary"
            className="text-sm px-4 py-2 bg-muted/60"
          >
            {feature}
          </Badge>
        ))}
      </div>
    </section>
  );
};
