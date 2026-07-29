"use client";
import React from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
  MotionValue,
} from "framer-motion";
import Image from "next/image";
import Link from "next/link";

// Aceternity "Hero Parallax" — three rows of cards that counter-scroll while the
// whole plane un-tilts. Vendored here with three additive changes, so it can
// carry ShipTime content instead of the demo's stock product shots:
//
//   1. `header` slot — the demo hard-coded "The Ultimate development studio".
//   2. `render` per item — a card can draw a real React tile instead of an
//      <Image>, which is what the Plus zone needs (conceptual art, no
//      screenshots or stock photos per the brand's negative list).
//   3. prefers-reduced-motion — the parallax flattens instead of animating,
//      matching the rest of the Plus motion layer.

export type ParallaxItem = {
  title: string;
  link: string;
  /** Remote/local image for the card face. Ignored when `render` is set. */
  thumbnail?: string;
  /** Draw the card face yourself (branded tile, chart, mock…). Wins over `thumbnail`. */
  render?: React.ReactNode;
};

export const HeroParallax = ({
  products,
  header,
  scrollSpan = "hero",
}: {
  products: ParallaxItem[];
  header?: React.ReactNode;
  /** "hero" = the original 300vh take-over. "section" = a shorter span so the
   *  wall can sit mid-page without swallowing the whole scroll. */
  scrollSpan?: "hero" | "section";
}) => {
  const firstRow = products.slice(0, 5);
  const secondRow = products.slice(5, 10);
  const thirdRow = products.slice(10, 15);
  const ref = React.useRef(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const springConfig = { stiffness: 300, damping: 30, bounce: 100 };

  const translateX = useSpring(useTransform(scrollYProgress, [0, 1], [0, 1000]), springConfig);
  const translateXReverse = useSpring(useTransform(scrollYProgress, [0, 1], [0, -1000]), springConfig);
  const rotateX = useSpring(useTransform(scrollYProgress, [0, 0.2], [15, 0]), springConfig);
  const opacity = useSpring(useTransform(scrollYProgress, [0, 0.2], [0.2, 1]), springConfig);
  const rotateZ = useSpring(useTransform(scrollYProgress, [0, 0.2], [20, 0]), springConfig);
  const translateY = useSpring(useTransform(scrollYProgress, [0, 0.2], [-700, 500]), springConfig);

  // Reduced motion: no tilt, no counter-scroll — the rows just sit and read.
  const planeStyle = reduced ? undefined : { rotateX, rotateZ, translateY, opacity };
  const rowA = reduced ? undefined : translateX;
  const rowB = reduced ? undefined : translateXReverse;

  return (
    <div
      ref={ref}
      className={
        reduced
          ? "overflow-hidden antialiased relative flex flex-col self-auto py-20"
          : `${scrollSpan === "hero" ? "h-[300vh] py-40" : "h-[190vh] py-20"} overflow-hidden antialiased relative flex flex-col self-auto [perspective:1000px] [transform-style:preserve-3d]`
      }
    >
      {header}
      <motion.div style={planeStyle}>
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-20 mb-20">
          {firstRow.map((product) => (
            <ProductCard product={product} translate={rowA} key={product.title} />
          ))}
        </motion.div>
        <motion.div className="flex flex-row mb-20 space-x-20">
          {secondRow.map((product) => (
            <ProductCard product={product} translate={rowB} key={product.title} />
          ))}
        </motion.div>
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-20">
          {thirdRow.map((product) => (
            <ProductCard product={product} translate={rowA} key={product.title} />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export const ProductCard = ({
  product,
  translate,
}: {
  product: ParallaxItem;
  translate?: MotionValue<number>;
}) => {
  return (
    <motion.div
      style={translate ? { x: translate } : undefined}
      whileHover={{ y: -20 }}
      key={product.title}
      className="group/product h-96 w-[30rem] relative flex-shrink-0"
    >
      <Link href={product.link} className="block h-full w-full group-hover/product:shadow-2xl">
        {product.render ? (
          product.render
        ) : (
          <Image
            src={product.thumbnail || ""}
            height="600"
            width="600"
            className="object-cover object-left-top absolute h-full w-full inset-0"
            alt={product.title}
          />
        )}
      </Link>
      {/* The demo's dark hover veil + caption only make sense over a photo; a
          rendered tile owns its own hover state. */}
      {!product.render && (
        <>
          <div className="absolute inset-0 h-full w-full opacity-0 group-hover/product:opacity-80 bg-black pointer-events-none" />
          <h2 className="absolute bottom-4 left-4 opacity-0 group-hover/product:opacity-100 text-white">
            {product.title}
          </h2>
        </>
      )}
    </motion.div>
  );
};
