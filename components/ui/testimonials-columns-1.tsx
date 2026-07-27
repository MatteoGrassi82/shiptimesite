"use client";

import React from "react";
import { motion } from "motion/react";

export type Testimonial = {
  text: string;
  image: string;
  name: string;
  role: string;
};

const NAVY = "#1C1E3D";
const MUTED = "#6E728A";
const BORDER = "#E8E8E8";
const sans = { fontFamily: "var(--font-manrope), system-ui, sans-serif" };

export const TestimonialsColumn = (props: {
  className?: string;
  testimonials: Testimonial[];
  duration?: number;
}) => {
  return (
    <div className={props.className}>
      <motion.div
        animate={{ translateY: "-50%" }}
        transition={{
          duration: props.duration || 10,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-6 pb-6"
      >
        {[...new Array(2).fill(0)].map((_, index) => (
          <React.Fragment key={index}>
            {props.testimonials.map(({ text, image, name, role }, i) => (
              <div
                className="p-8 rounded-3xl max-w-xs w-full"
                style={{ background: "#FFFFFF", border: `1px solid ${BORDER}`, boxShadow: "0 18px 44px -24px rgba(28,30,61,0.28)" }}
                key={i}
              >
                <p style={{ ...sans, fontSize: 15, lineHeight: 1.6, color: NAVY }}>{text}</p>
                <div className="flex items-center gap-2.5 mt-5">
                  <img
                    width={40}
                    height={40}
                    src={image}
                    alt={name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div className="flex flex-col">
                    <div style={{ ...sans, fontWeight: 700, letterSpacing: "-0.01em", lineHeight: 1.25, color: NAVY, fontSize: 14 }}>{name}</div>
                    <div style={{ ...sans, lineHeight: 1.25, color: MUTED, fontSize: 13 }}>{role}</div>
                  </div>
                </div>
              </div>
            ))}
          </React.Fragment>
        ))}
      </motion.div>
    </div>
  );
};
