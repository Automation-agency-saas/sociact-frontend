import { Button } from "./ui/button";

export const Cta = () => {
  return (
    <section
      id="cta"
      className="bg-muted/50 py-16 my-24 sm:my-32"
    >
      <div className="container lg:grid lg:grid-cols-2 place-items-center">
        <div className="lg:col-start-1">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to revolutionize your social media strategy?
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
            Join thousands of creators and businesses who have transformed their social media presence with our automation tools. Start your free trial today.
          </p>
        </div>

        <div className="space-y-4 lg:col-start-2">
          <Button>
            Get Started Now
          </Button>
          <Button variant="outline">
            Schedule Demo
          </Button>
        </div>
      </div>
    </section>
  );
};
