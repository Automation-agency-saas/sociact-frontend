import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { RetroGrid } from "@/components/magicui/retro-grid";
const faqs = [
  {
    question: "What social media platforms do you support?",
    answer:
      "We support all major social media platforms including Instagram, Twitter, LinkedIn, Facebook, TikTok, and Pinterest. We're constantly adding support for new platforms based on user demand.",
  },
  {
    question: "How does the AI content generation work?",
    answer:
      "Our AI analyzes your brand voice, past successful posts, and industry trends to suggest engaging content ideas. It can help with captions, hashtags, and even image recommendations while maintaining your unique style.",
  },
  {
    question: "Is there a limit to how many posts I can schedule?",
    answer:
      "The post limit depends on your plan. Starter allows 30 posts/month, Professional offers unlimited posts, and Enterprise includes unlimited posts across unlimited accounts.",
  },
  {
    question: "Can I manage multiple brands or clients?",
    answer:
      "Yes! Our Professional and Enterprise plans are designed for managing multiple brands. You can organize accounts by client, set different team permissions, and generate white-label reports.",
  },
  {
    question: "How do you determine the best posting times?",
    answer:
      "Our AI analyzes your audience's activity patterns, engagement history, and platform-specific trends to recommend optimal posting times for maximum reach and engagement.",
  },
  {
    question: "What kind of analytics do you provide?",
    answer:
      "We provide comprehensive analytics including engagement rates, follower growth, best-performing content types, audience demographics, and competitor analysis. Enterprise users get access to custom reports and API integration.",
  },
];

export const FAQ = () => {
  return (
    <section id="faq" className="container py-24 sm:py-32">
      <div className="relative flex flex-col overflow-hidden">
        <div className="text-center ">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Got questions? We've got answers! Here are some common questions
            about our social media automation platform.
          </p>
        </div>

        <div className="mx-auto w-full max-w-3xl divide-y divide-muted">
          {faqs.map((faq, index) => (
            <Accordion key={index} type="single" collapsible>
              <AccordionItem value={`item-${index}`}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            </Accordion>
          ))}
        </div>

        <h3 className="font-medium mt-4 py-4">
          Still have questions?{" "}
          <a
            rel="noreferrer noopener"
            href="#"
            className="text-primary transition-all border-primary hover:border-b-2"
          >
            Contact us
          </a>
        </h3>
        <RetroGrid />
      </div>
    </section>
  );
};

// "use client";

// export function FAQ() {
//   return (

//   );
// }
