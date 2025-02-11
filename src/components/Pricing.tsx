import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check } from "lucide-react";


const plans = [
  {
    name: "Starter",
    price: "$29",
    description: "Perfect for individuals and content creators just getting started.",
    features: [
      "Schedule up to 30 posts per month",
      "Basic analytics dashboard",
      "Connect 3 social media accounts",
      "AI post suggestions",
      "24/7 email support",
      "7-day post history"
    ],
  },
  {
    name: "Professional",
    price: "$79",
    description: "Ideal for growing businesses and professional influencers.",
    features: [
      "Schedule unlimited posts",
      "Advanced analytics & reporting",
      "Connect 10 social media accounts",
      "AI content generation",
      "Priority support",
      "30-day post history",
      "Custom posting schedule",
      "Competitor analysis"
    ],
  },
  {
    name: "Enterprise",
    price: "$199",
    description: "For large teams and agencies managing multiple brands.",
    features: [
      "Everything in Professional",
      "Unlimited social accounts",
      "Team collaboration tools",
      "White-label reports",
      "API access",
      "Dedicated account manager",
      "Custom integrations",
      "90-day post history"
    ],
  },
];

export const Pricing = () => {
  return (
    <section
      id="pricing"
      className="container  sm:py-24"
    >
       
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Simple, Transparent Pricing</h2>
        <p className="mt-6 text-lg leading-8 text-muted-foreground">
          Choose the perfect plan for your social media automation needs. All plans include our core automation features.
        </p>
      </div>
      
      <div className="grid lg:grid-cols-3 gap-8 mt-16">
        {plans.map((plan) => (
          <Card key={plan.name} className="flex flex-col">
            <CardHeader>
              <CardTitle className="text-xl">{plan.name}</CardTitle>
              <div className="mt-4">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <CardDescription className="mt-4">{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-primary" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full">{plan.name === "Enterprise" ? "Contact Sales" : "Get Started"}</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
};
