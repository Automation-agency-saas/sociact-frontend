import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

export const Newsletter = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus("");

    const formData = {
      name,
      email,
      message,
    };

    try {
      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbyOV8MCIKrCtYcJiMA8t_AwcjYszo_IkTeDHsjAYqxn90RpImmc-LRpYjXWIiE7DfV3/exec",
        {
          // redirect: "follow",
          method: "POST",
          body: JSON.stringify(formData),
          headers: {
            "Content-Type": "text/plain;charset=utf-8",
          },
        }
      );

      // For Google Apps Script, we need to handle the response differently
      if (response.ok) {
        setStatus("Message sent successfully!");
        // Clear form
        setName("");
        setEmail("");
        setMessage("");
      } else {
        setStatus("Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error("Submission error:", error);
      setStatus("Error sending message. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="w-full px-4">
      <div className="relative isolate overflow-hidden w-[85%] mx-auto py-16">
        <h2 className="mx-auto max-w-3xl text-center text-3xl font-bold tracking-tight text-foreground dark:text-white sm:text-4xl">
          Get in Touch With Us
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-lg leading-8 text-muted-foreground dark:text-white/80">
          Have questions about our services? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
        </p>
        
        <form className="mx-auto mt-10 w-[90%] max-w-3xl flex flex-col gap-6" onSubmit={handleSubmit}>
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              placeholder="Your Name"
              className="min-w-0 flex-auto bg-white/10 border-white/20 text-white placeholder:text-white/70 focus:border-primary shadow-sm"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isSubmitting}
            />
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="Your Email"
              className="min-w-0 flex-auto bg-white/10 border-white/20 text-white  placeholder:text-white/70 focus:border-primary shadow-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
            />
          </div>
          <Textarea
            id="message"
            name="message"
            required
            placeholder="Your Message"
            className="min-h-[150px] bg-white/10 border-white/20 text-white placeholder:text-white/70 focus:border-primary shadow-sm"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={isSubmitting}
          />
          <Button 
            type="submit" 
            className="w-full sm:w-auto sm:self-center px-8 bg-primary hover:bg-primary/90 text-primary-foreground"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending..." : "Send Message"}
          </Button>
        </form>
        
        {status && (
          <p className={`mt-4 text-center ${status.includes("success") ? "text-green-500" : "text-red-500"}`}>
            {status}
          </p>
        )}
      </div>
    </section>
  );
};