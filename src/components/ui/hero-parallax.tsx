"use client";
import React from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  MotionValue,
} from "framer-motion";
import { Link } from "react-router-dom";
import { TypingAnimationDemo } from "../TypingAnimation";
import { AnimatedGradientTextDemo} from "../AnimatedText";
import { ShimmerButtonDemo } from "../ShinyButton";
import { BgGrid } from "../BgGrid";
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
    useTransform(scrollYProgress, [0, 0.2], [-700, 500]),
    springConfig
  );

  return (
    <div
      ref={ref}
      className="overflow-hidden antialiased relative flex flex-col self-auto [perspective:1000px] [transform-style:preserve-3d]"
    >
   
      <div className="absolute inset-0 z-0 " />
     
      <Header />
      <motion.div
        style={{
          rotateX,
          rotateZ,
          translateY,
          opacity,
        }}
        className="relative z-10 mt-20"
      >
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-20 mb-20">
          {firstRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateX}
              key={product.title}
            />
          ))}
        </motion.div>
        <motion.div className="flex flex-row space-x-20 mb-20">
          {secondRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateXReverse}
              key={product.title}
            />
          ))}
        </motion.div>
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-20">
          {thirdRow.map((product) => (
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
 
    <div className="flex items-center justify-center relative">
       <BgGrid>
      <div className="absolute top-0 left-0 w-[600px] h-[600px] -z-50">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(139,51,255,1)_0%,rgba(139,51,255,0.6)_40%,transparent_70%)]" />
      </div>
      <div className="max-w-7xl w-full px-4 sm:px-6 lg:px-8 mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
           
          <AnimatedGradientTextDemo text="Social Media Automation" />
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-4xl sm:text-5xl md:text-7xl font-bold dark:text-white tracking-tight"
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
            className="max-w-2xl text-base sm:text-lg md:text-xl dark:text-neutral-200 mx-auto"
          >
            Schedule posts, generate engaging content, and grow your audience across all platforms with our AI-powered automation tools.
          </motion.p>
          <div className="flex justify-center">
            
            <ShimmerButtonDemo text="Get Started"/>
          </div>
        
        </motion.div>
      </div>
      </BgGrid>
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
      }}
      key={product.title}
      className="group/product h-96 w-[30rem] relative flex-shrink-0"
    >
      <Link
        to={product.link}
        className="block group-hover/product:shadow-2xl"
      >
        <img
          src={product.thumbnail}
          height="600"
          width="600"
          className="object-cover object-left-top absolute h-full w-full inset-0"
          alt={product.title}
        />
      </Link>
      <div className="absolute inset-0 h-full w-full opacity-0 group-hover/product:opacity-80 bg-black pointer-events-none"></div>
      <h2 className="absolute bottom-4 left-4 opacity-0 group-hover/product:opacity-100 text-white">
        {product.title}
      </h2>
    </motion.div>
  );
};
