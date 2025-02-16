import { TypingAnimationDemo } from "../TypingAnimation";
import { AnimatedGradientTextDemo } from "../AnimatedText";
import { ShimmerButtonDemo } from "../ShinyButton";
import React from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  MotionValue,
} from "framer-motion";
import { Link } from "react-router-dom";
export const HeroParallax = ({
  products,
}: {
  products: {
    title: string;
    link: string;
    thumbnail: string;
  }[];
}) => {

  const firstRow = products.slice(0, 5);
  const secondRow = products.slice(5, 10);
  const thirdRow = products.slice(10, 15);
  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const springConfig = { stiffness: 300, damping: 30, bounce: 100 };

  const translateX = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, 1000]),
    springConfig
  );
  const translateXReverse = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, -1000]),
    springConfig
  );
  const rotateX = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [15, 0]),
    springConfig
  );
  const opacity = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [0.2, 1]),
    springConfig
  );
  const rotateZ = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [20, 0]),
    springConfig
  );
  const translateY = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [-700, 90]),
    springConfig
  );
  return (
    <div
      ref={ref}
      className="min-h-[100vh] overflow-hidden antialiased relative flex flex-col self-auto [perspective:1000px] [transform-style:preserve-3d]"
    >
      <Header />

      <motion.div
        style={{
          rotateX,
          rotateZ,
          translateY,
          opacity,
        }}
        className="mt-20 z-0"
      >
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-20">
          {firstRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateX}
              key={product.title}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export const Header = () => {
  return (
    <div className="flex items-center justify-center relative min-h-[80vh] py-20">
      {/* Enhanced glow effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1200px] h-[600px] -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,51,255,0.3)_0%,rgba(139,51,255,0.2)_40%,transparent_70%)] blur-[60px]" />
      </div>

      <div className="max-w-7xl w-full px-4 sm:px-6 lg:px-8 mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          <AnimatedGradientTextDemo text="Beta Version is Live now " />
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-4xl sm:text-6xl md:text-8xl font-bold text-white tracking-tight drop-shadow-lg"
          >
            Transform Your <br className="hidden sm:block" />
            <span className="text-primary">
              <TypingAnimationDemo text="Social Media" />
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="max-w-2xl text-base sm:text-lg md:text-xl text-neutral-200 mx-auto font-medium drop-shadow-lg"
          >
            Schedule posts, generate engaging content, and grow your audience
            across all platforms with our AI-powered automation tools.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex justify-center pt-4"
          >
            <Link to="/auth/sign-up">
              <ShimmerButtonDemo text="Get Started" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export const ProductCard = ({
  product,
  translate,
}: {
  product: {
    title: string;
    link: string;
    thumbnail: string;
  };
  translate: MotionValue<number>;
}) => {
  return (
    <motion.div
      style={{
        x: translate,
      }}
      whileHover={{
        y: -20,
        transition: { duration: 0.3 },
      }}
      key={product.title}
      className="group/product h-96 w-[30rem] relative flex-shrink-0 rounded-xl overflow-hidden"
    >
      <Link 
        to={product.link} 
        className="block group-hover/product:shadow-2xl transition-all duration-300"
      >
        <img
          src={product.thumbnail}
          height="600"
          width="600"
          className="object-cover object-left-top absolute h-full w-full inset-0 transition-transform duration-300 group-hover/product:scale-105"
          alt={product.title}
        />
      </Link>
      <div className="absolute inset-0 h-full w-full opacity-0 group-hover/product:opacity-90 bg-gradient-to-t from-black/80 to-black/40 transition-opacity duration-300"></div>
      <h2 className="absolute bottom-6 left-6 opacity-0 group-hover/product:opacity-100 text-white font-semibold text-xl transition-opacity duration-300">
        {product.title}
      </h2>
    </motion.div>
  );
};
