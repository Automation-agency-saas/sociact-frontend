import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

export const Newsletter = () => {
  return (
    <section id="contact" className="w-full px-4">
      <div className="relative isolate overflow-hidden w-[85%] mx-auto py-16">
        <h2 className="mx-auto max-w-3xl text-center text-3xl font-bold tracking-tight text-foreground dark:text-white sm:text-4xl">
          Get in Touch With Us
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-lg leading-8 text-muted-foreground dark:text-white/80">
          Have questions about our services? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
        </p>
        
        <form className="mx-auto mt-10 w-[90%] max-w-3xl flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              placeholder="Your Name"
              className="min-w-0 flex-auto bg-white dark:bg-white/10 border-gray-200 dark:border-white/20 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-white/70 focus:border-primary shadow-sm"
            />
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="Your Email"
              className="min-w-0 flex-auto bg-white dark:bg-white/10 border-gray-200 dark:border-white/20 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-white/70 focus:border-primary shadow-sm"
            />
          </div>
          <Textarea
            id="message"
            name="message"
            required
            placeholder="Your Message"
            className="min-h-[150px] bg-white dark:bg-white/10 border-gray-200 dark:border-white/20 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-white/70 focus:border-primary shadow-sm"
          />
          <Button 
            type="submit" 
            className="w-full sm:w-auto sm:self-center px-8 bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Send Message
          </Button>
        </form>
      </div>
    </section>
  );
};
