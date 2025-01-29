import { Card,  CardHeader, CardTitle, CardContent } from "./ui/card";

const services = [
  {
    title: "AI Video Idea Generation",
    description: "Never run out of content ideas. Our AI analyzes trending topics and your audience preferences to generate viral-worthy video concepts tailored to your niche.",
    icon: "🎥"
  },
  {
    title: "Smart Script Generator",
    description: "Transform ideas into engaging scripts. Our AI crafts compelling narratives, hooks, and calls-to-action optimized for social media engagement.",
    icon: "📝"
  },
  {
    title: "Comments Automation",
    description: "Engage with your audience automatically. Smart responses to comments and DMs, while maintaining authentic conversations and building community.",
    icon: "💬"
  },
  {
    title: "SEO Optimization",
    description: "Maximize your content's reach. Get AI-powered recommendations for titles, tags, and descriptions to rank higher on social platforms and search engines.",
    icon: "🎯"
  },
  {
    title: "Thumbnail Generator",
    description: "Create eye-catching thumbnails that drive clicks. Our AI analyzes top-performing thumbnails in your niche to generate high-converting designs.",
    icon: "🖼️"
  },
  {
    title: "Analytics & Insights",
    description: "Track your growth with detailed analytics. Monitor engagement, identify top-performing content, and get AI-powered recommendations for improvement.",
    icon: "📊"
  }
];

export const Services = () => {
  return (
    <section id="services" className="container py-24 sm:py-32">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
          Powerful Tools for Content Creators
        </h2>
        <p className="text-lg text-muted-foreground mb-8">
          Everything you need to create, manage, and grow your social media presence
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service) => (
          <Card key={service.title} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="text-4xl mb-4">{service.icon}</div>
              <CardTitle className="text-xl">{service.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{service.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};
