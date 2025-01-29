import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface TestimonialProps {
  image: string;
  name: string;
  role: string;
  comment: string;
}

const testimonials: TestimonialProps[] = [
  {
    image: "https://i.pravatar.cc/150?u=sarah",
    name: "Sarah Johnson",
    role: "Content Creator",
    comment: "The video idea generator is a game-changer! I went from struggling for content ideas to having weeks of engaging videos planned. My channel grew by 150% in just 3 months.",
  },
  {
    image: "https://i.pravatar.cc/150?u=mark",
    name: "Mark Chen",
    role: "Social Media Manager",
    comment: "The automated comment management saved my team hours every day. We can now focus on strategy while maintaining meaningful engagement with our community.",
  },
  {
    image: "https://i.pravatar.cc/150?u=lisa",
    name: "Lisa Patel",
    role: "YouTuber",
    comment: "The thumbnail generator and SEO tools helped me increase my click-through rate by 40%. My videos are now reaching a much wider audience than ever before.",
  },
  {
    image: "https://i.pravatar.cc/150?u=james",
    name: "James Wilson",
    role: "Digital Marketing Agency",
    comment: "Managing multiple client accounts is so much easier now. The analytics provide deep insights that help us make data-driven decisions for our clients' growth.",
  },
  {
    image: "https://i.pravatar.cc/150?u=emma",
    name: "Emma Rodriguez",
    role: "Lifestyle Influencer",
    comment: "The script generator helps me create more engaging content in half the time. My engagement rates have doubled since I started using these tools.",
  },
  {
    image: "https://i.pravatar.cc/150?u=alex",
    name: "Alex Thompson",
    role: "Tech Reviewer",
    comment: "From ideation to publishing, this platform streamlines my entire workflow. It's like having a full production team in your pocket. Absolutely worth every penny!",
  },
];

export const Testimonials = () => {
  return (
    <section id="testimonials" className="container py-24 sm:py-32">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
          Loved by Content Creators
          <span className="bg-gradient-to-r from-[#F596D3] to-[#D247BF] text-transparent bg-clip-text">
            {" "}Worldwide{" "}
          </span>
        </h2>
        <p className="text-lg text-muted-foreground">
          Join thousands of creators who have transformed their social media presence with our tools
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {testimonials.map((testimonial) => (
          <Card
            key={testimonial.name}
            className="bg-card hover:shadow-lg transition-shadow"
          >
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
              <Avatar>
                <AvatarImage alt={testimonial.name} src={testimonial.image} />
                <AvatarFallback>{testimonial.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>

              <div className="flex flex-col">
                <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                <CardDescription>{testimonial.role}</CardDescription>
              </div>
            </CardHeader>

            <CardContent>
              <p className="text-muted-foreground">{testimonial.comment}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};
