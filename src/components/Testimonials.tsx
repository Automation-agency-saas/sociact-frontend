// import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Marquee } from "./magicui/marquee";
// interface TestimonialProps {
//   image: string;
//   name: string;
//   role: string;
//   comment: string;
// }

// const testimonials: TestimonialProps[] = [
//   {
//     image: "https://i.pravatar.cc/150?u=sarah",
//     name: "Sarah Johnson",
//     role: "Content Creator",
//     comment: "The video idea generator is a game-changer! I went from struggling for content ideas to having weeks of engaging videos planned. My channel grew by 150% in just 3 months.",
//   },
//   {
//     image: "https://i.pravatar.cc/150?u=mark",
//     name: "Mark Chen",
//     role: "Social Media Manager",
//     comment: "The automated comment management saved my team hours every day. We can now focus on strategy while maintaining meaningful engagement with our community.",
//   },
//   {
//     image: "https://i.pravatar.cc/150?u=lisa",
//     name: "Lisa Patel",
//     role: "YouTuber",
//     comment: "The thumbnail generator and SEO tools helped me increase my click-through rate by 40%. My videos are now reaching a much wider audience than ever before.",
//   },
//   {
//     image: "https://i.pravatar.cc/150?u=james",
//     name: "James Wilson",
//     role: "Digital Marketing Agency",
//     comment: "Managing multiple client accounts is so much easier now. The analytics provide deep insights that help us make data-driven decisions for our clients' growth.",
//   },
//   {
//     image: "https://i.pravatar.cc/150?u=emma",
//     name: "Emma Rodriguez",
//     role: "Lifestyle Influencer",
//     comment: "The script generator helps me create more engaging content in half the time. My engagement rates have doubled since I started using these tools.",
//   },
//   {
//     image: "https://i.pravatar.cc/150?u=alex",
//     name: "Alex Thompson",
//     role: "Tech Reviewer",
//     comment: "From ideation to publishing, this platform streamlines my entire workflow. It's like having a full production team in your pocket. Absolutely worth every penny!",
//   },
// ];

// export const Testimonials = () => {
//   return (
//     <section id="testimonials" className="container py-24 sm:py-32">
//       <div className="text-center mb-12">
//         <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
//           Loved by Content Creators
//           <span className="bg-gradient-to-r from-[#F596D3] to-[#D247BF] text-transparent bg-clip-text">
//             {" "}Worldwide{" "}
//           </span>
//         </h2>
//         <p className="text-lg text-muted-foreground">
//           Join thousands of creators who have transformed their social media presence with our tools
//         </p>
//       </div>

//       <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
//         {testimonials.map((testimonial) => (
//           <Card
//             key={testimonial.name}
//             className="bg-card hover:shadow-lg transition-shadow"
//           >
//             <CardHeader className="flex flex-row items-center gap-4 pb-2">
//               <Avatar>
//                 <AvatarImage alt={testimonial.name} src={testimonial.image} />
//                 <AvatarFallback>{testimonial.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
//               </Avatar>

//               <div className="flex flex-col">
//                 <CardTitle className="text-lg">{testimonial.name}</CardTitle>
//                 <CardDescription>{testimonial.role}</CardDescription>
//               </div>
//             </CardHeader>

//             <CardContent>
//               <p className="text-muted-foreground">{testimonial.comment}</p>
//             </CardContent>
//           </Card>
//         ))}
//       </div>
//     </section>
//   );
// };

import { cn } from "@/lib/utils";
import { Marquee } from "@/components/magicui/marquee";
// {
  //     image: "https://i.pravatar.cc/150?u=sarah",
  //     name: "Sarah Johnson",
  //     role: "Content Creator",
  //     comment: "The video idea generator is a game-changer! I went from struggling for content ideas to having weeks of engaging videos planned. My channel grew by 150% in just 3 months.",
  //   },
  //   {
  //     image: "https://i.pravatar.cc/150?u=mark",
  //     name: "Mark Chen",
  //     role: "Social Media Manager",
  //     comment: "The automated comment management saved my team hours every day. We can now focus on strategy while maintaining meaningful engagement with our community.",
  //   },
  //   {
  //     image: "https://i.pravatar.cc/150?u=lisa",
  //     name: "Lisa Patel",
  //     role: "YouTuber",
  //     comment: "The thumbnail generator and SEO tools helped me increase my click-through rate by 40%. My videos are now reaching a much wider audience than ever before.",
  //   },
  //   {
  //     image: "https://i.pravatar.cc/150?u=james",
  //     name: "James Wilson",
  //     role: "Digital Marketing Agency",
  //     comment: "Managing multiple client accounts is so much easier now. The analytics provide deep insights that help us make data-driven decisions for our clients' growth.",
  //   },
  //   {
  //     image: "https://i.pravatar.cc/150?u=emma",
  //     name: "Emma Rodriguez",
  //     role: "Lifestyle Influencer",
  //     comment: "The script generator helps me create more engaging content in half the time. My engagement rates have doubled since I started using these tools.",
  //   },
  //   {
  //     image: "https://i.pravatar.cc/150?u=alex",
  //     name: "Alex Thompson",
  //     role: "Tech Reviewer",
  //     comment: "From ideation to publishing, this platform streamlines my entire workflow. It's like having a full production team in your pocket. Absolutely worth every penny!",
  //   },
const reviews = [
  {
    name: "Sarah Johnson",
    role: "@Content Creator",
    body: "The video idea generator is a game-changer! I went from struggling for content ideas to having weeks of engaging videos planned. My channel grew by 150% in just 3 months.",
    img: "https://i.pravatar.cc/150?u=sarah",
  },
  {
    name: "Mark Chen",
    role: "@Social Media Manager",
    body:  "The automated comment management saved my team hours every day. We can now focus on strategy while maintaining meaningful engagement with our community.",
    img: "https://i.pravatar.cc/150?u=mark",
  },
  {
    name: "Lisa Patel",
    role: "@YouTuber",
    body: "The thumbnail generator and SEO tools helped me increase my click-through rate by 40%. My videos are now reaching a much wider audience than ever before.",
    img: "https://i.pravatar.cc/150?u=lisa",
  },
  {
    name: "James Wilson",
    role: "@Digital Marketing Agency",
    body: "The automated comment management saved my team hours every day. We can now focus on strategy while maintaining meaningful engagement with our community.",
    img: "https://i.pravatar.cc/150?u=james",
  },
  {
    name: "Emma Rodriguez",
    role: "@Lifestyle Influencer",
    body: "The script generator helps me create more engaging content in half the time. My engagement rates have doubled since I started using these tools.",
    img: "https://i.pravatar.cc/150?u=emma",
  },
  {
    name: "Alex Thompson",
    role: "@Tech Reviewer",
    body: "From ideation to publishing, this platform streamlines my entire workflow. It's like having a full production team in your pocket. Absolutely worth every penny!",
    img: "https://i.pravatar.cc/150?u=alex",
  },
];

const firstRow = reviews.slice(0, reviews.length);
// const secondRow = reviews.slice(reviews.length / 2);

const ReviewCard = ({
  img,
  name,
  role,
  body,
}: {
  img: string;
  name: string;
  role: string;
  body: string;
}) => {
  return (
    <figure
      className={cn(
        "relative w-64 cursor-pointer overflow-hidden rounded-xl border p-4",
        // light styles
        "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
        // dark styles
        "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]",
      )}
    >
      <div className="flex flex-row items-center gap-2">
        <img className="rounded-full" width="32" height="32" alt="" src={img} />
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium dark:text-white">
            {name}
          </figcaption>
          <p className="text-xs font-medium dark:text-white/40">{role}</p>
        </div>
      </div>
      <blockquote className="mt-2 text-sm">{body}</blockquote>
    </figure>
  );
};

export function Testimonials() {
  return (
    <section id="testimonials" className="relative">

 
    <div className="relative">
      {/* Heading */}
      <div className="text-center mb-16 pt-20">
        <h2 className="text-4xl md:text-5xl font-bold">
          What our <span className="text-[#8B33FF]">Customers</span> Say
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          What Our Early Adopters Say About Us
        </p>
      </div>

      <div className="relative flex h-[250px] w-full flex-col items-center justify-center overflow-hidden">
        <Marquee pauseOnHover className="[--duration:20s]">
          {firstRow.map((review) => (
            <ReviewCard key={review.role} {...review} />
          ))}
        </Marquee>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-black dark:from-background"></div>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-black dark:from-background"></div>
      </div>
    </div>
    </section>
  );
}
