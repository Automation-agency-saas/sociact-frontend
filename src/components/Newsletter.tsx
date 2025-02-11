import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { WavyBackground } from "@/components/ui/wavy-background";
import { Textarea } from "./ui/textarea";
export const Newsletter = () => {
  return (
    <section id="contact" className="w-full px-4">
     
      <div className="relative isolate overflow-hidden w-[85%] mx-auto  py-16">
        <h2 className="mx-auto max-w-3xl text-center text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Get in Touch With Us
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-lg leading-8 text-white">
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
              className="min-w-0 flex-auto bg-white/10 text-white placeholder:text-white/70"
            />
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="Your Email"
              className="min-w-0 flex-auto bg-white/10 text-white placeholder:text-white/70"
            />
          </div>
          <Textarea
            id="message"
            name="message"
            required
            placeholder="Your Message"
            className="min-h-[150px] bg-white/10 text-white placeholder:text-white/70"
          />
          <Button type="submit" className="w-full sm:w-auto sm:self-center px-8">
            Send Message
          </Button>
        </form>
      </div>
    </section>
  );
};
