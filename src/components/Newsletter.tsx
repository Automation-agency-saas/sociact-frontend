import { Button } from "./ui/button";
import { Input } from "./ui/input";

export const Newsletter = () => {
  return (
    <section id="newsletter" className="container py-24 sm:py-32">
      <div className="relative isolate overflow-hidden bg-muted/50 px-6 py-24 shadow-2xl rounded-3xl sm:px-24 xl:py-32">
        <h2 className="mx-auto max-w-2xl text-center text-3xl font-bold tracking-tight sm:text-4xl">
          Get Social Media Marketing Tips & Updates
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-center text-lg leading-8 text-muted-foreground">
          Subscribe to our newsletter for weekly insights on social media trends, automation strategies, and growth hacks.
        </p>
        <form className="mx-auto mt-10 flex max-w-md gap-x-4">
          <label htmlFor="email-address" className="sr-only">
            Email address
          </label>
          <Input
            id="email-address"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="Enter your email"
            className="min-w-0 flex-auto"
          />
          <Button type="submit">
            Subscribe
          </Button>
        </form>
      </div>
    </section>
  );
};
