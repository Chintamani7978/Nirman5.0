"use client";
import React from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

export const HeroParallax = ({
  products,
  headerContent // This is the prop we added earlier for your Tree Animation
}) => {
  const firstRow = products.slice(0, 5);
  const secondRow = products.slice(5, 10);
  const thirdRow = products.slice(10, 15);
  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const springConfig = { stiffness: 300, damping: 30, bounce: 10 };

  // Horizontal movement (Side to side) - Kept original
  const translateX = useSpring(useTransform(scrollYProgress, [0, 1], [0, 1000]), springConfig);
  const translateXReverse = useSpring(useTransform(scrollYProgress, [0, 1], [0, -1000]), springConfig);
  
  // Rotation & Opacity - Slowed down slightly (0.4 instead of 0.2) so it feels smoother
  const rotateX = useSpring(useTransform(scrollYProgress, [0, 0.6], [15, 0]), springConfig);
  const opacity = useSpring(useTransform(scrollYProgress, [0, 0.6], [0.2, 1]), springConfig);
  const rotateZ = useSpring(useTransform(scrollYProgress, [0, 0.6], [20, 0]), springConfig);
  
  // *** THE FIX FOR THE BLANK GAP ***
  // Old: [-700, 500] -> Pushed cards too far down.
  // New: [-700, 50]  -> Brings cards up from behind header, but settles them near the top.
  const translateY = useSpring(useTransform(scrollYProgress, [0, 1], [-700, 30]), springConfig);

  return (
    <div
      ref={ref}
      // Reduced height from 300vh/250vh to 210vh so there isn't too much empty space
      className="h-[210vh] py-40 overflow-hidden antialiased relative flex flex-col self-auto [perspective:1000px] [transform-style:preserve-3d]"
    >
      
      {/* Header Container */}
      <div className="max-w-7xl relative mx-auto py-20 md:py-40 px-4 w-full left-0 top-0 flex flex-col items-center justify-center z-50">
        {headerContent}
      </div>

      {/* Animated Cards Container */}
      <motion.div
        style={{
          rotateX,
          rotateZ,
          translateY,
          opacity,
        }}
        className=""
      >
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-20 mb-20">
          {firstRow.map((product) => (
            <ProductCard product={product} translate={translateX} key={product.title} />
          ))}
        </motion.div>
        <motion.div className="flex flex-row mb-20 space-x-20 ">
          {secondRow.map((product) => (
            <ProductCard product={product} translate={translateXReverse} key={product.title} />
          ))}
        </motion.div>
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-20">
          {thirdRow.map((product) => (
            <ProductCard product={product} translate={translateX} key={product.title} />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export const ProductCard = ({
  product,
  translate
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
      className="group/product h-96 w-[30rem] relative shrink-0"
    >
      <a href={product.link} className="block group-hover/product:shadow-2xl ">
        <img
          src={product.thumbnail}
          height="600"
          width="600"
          className="object-cover object-left-top absolute h-full w-full inset-0"
          alt={product.title}
        />
      </a>
      <div className="absolute inset-0 h-full w-full opacity-0 group-hover/product:opacity-80 bg-black pointer-events-none"></div>
      <h2 className="absolute bottom-4 left-4 opacity-0 group-hover/product:opacity-100 text-white">
        {product.title}
      </h2>
    </motion.div>
  );
};