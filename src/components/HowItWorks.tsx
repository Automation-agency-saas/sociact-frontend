import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const steps = [
  {
    title: "Connect Your Accounts",
    description: "Easily connect all your social media accounts in one place. We support Instagram, Twitter, LinkedIn, Facebook, and more.",
    icon: "🔗"
  },
  {
    title: "Plan Your Content",
    description: "Use our AI-powered content planner to create and schedule engaging posts. Our system suggests optimal posting times for maximum engagement.",
    icon: "📝"
  },
  {
    title: "Automate & Analyze",
    description: "Let our automation handle your posting schedule while you track performance with real-time analytics and insights.",
    icon: "📊"
  },
  {
    title: "Grow & Scale",
    description: "Watch your audience grow as you optimize your strategy based on AI-driven recommendations and engagement metrics.",
    icon: "📈"
  }
];

export const HowItWorks = () => {
  return (
    <section id="how-it-works" className="container py-24 sm:py-32">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">How It Works</h2>
        <p className="text-lg text-muted-foreground mb-8">
          Get started with social media automation in four simple steps
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {steps.map((step, index) => (
          <Card key={step.title} className="relative">
            <CardHeader>
              <div className="text-4xl mb-4">{step.icon}</div>
              <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                {index + 1}
              </div>
              <CardTitle className="text-xl">{step.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{step.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};
