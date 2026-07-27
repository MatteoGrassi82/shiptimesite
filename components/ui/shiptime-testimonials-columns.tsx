"use client";

import type React from "react";
import { motion } from "motion/react";
import { TestimonialsColumn, type Testimonial } from "@/components/ui/testimonials-columns-1";

const ds = {
  navy:   "#1C1E3D",
  muted:  "#6E728A",
  orange: "#EC5A26",
  border: "#E8E8E8",
  white:  "#FFFFFF",
};
const sans: React.CSSProperties = { fontFamily: "var(--font-manrope), system-ui, sans-serif" };

const testimonials: Testimonial[] = [
  {
    text: "We were logging into four carrier sites every morning. Now it's one screen and the cheapest label prints in seconds.",
    image: "https://randomuser.me/api/portraits/women/1.jpg",
    name: "Briana Patton",
    role: "Operations Manager, DTC brand",
  },
  {
    text: "We were paying retail without realizing it. ShipTime cut our shipping bill by nearly half in the first month.",
    image: "https://randomuser.me/api/portraits/men/2.jpg",
    name: "Bilal Ahmed",
    role: "Founder, Candle Co.",
  },
  {
    text: "Setup took an afternoon. Connected Shopify, imported orders, done — no IT project, no migration.",
    image: "https://randomuser.me/api/portraits/women/3.jpg",
    name: "Saman Malik",
    role: "E-commerce Manager",
  },
  {
    text: "The invoice audit caught overcharges I didn't even know we were paying. It pays for itself.",
    image: "https://randomuser.me/api/portraits/men/4.jpg",
    name: "Omar Raza",
    role: "Finance Lead",
  },
  {
    text: "Support actually picks up the phone — a real person who knows my account, not a chatbot.",
    image: "https://randomuser.me/api/portraits/women/5.jpg",
    name: "Zainab Hussain",
    role: "Owner, Electronics Retailer",
  },
  {
    text: "Branded tracking pages cut our 'where's my order?' emails way down. Customers love the experience.",
    image: "https://randomuser.me/api/portraits/women/6.jpg",
    name: "Aliza Khan",
    role: "Customer Experience Lead",
  },
  {
    text: "We ship parcel and LTL freight from the same dashboard now — one invoice, no separate broker.",
    image: "https://randomuser.me/api/portraits/men/7.jpg",
    name: "Farhan Siddiqui",
    role: "Logistics Manager",
  },
  {
    text: "Cross-border to the US used to be a headache. Now it's the same three clicks as shipping domestic.",
    image: "https://randomuser.me/api/portraits/women/8.jpg",
    name: "Sana Sheikh",
    role: "Fulfillment Lead",
  },
  {
    text: "Started as a side hustle shipping a few orders a week. ShipTime grew with us to hundreds a day.",
    image: "https://randomuser.me/api/portraits/men/9.jpg",
    name: "Hassan Ali",
    role: "Founder, Apparel",
  },
];

const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);

export default function ShipTimeTestimonialsColumns({ background = ds.white }: { background?: string }) {
  return (
    <section className="relative px-5 md:px-10 py-20 md:py-28" style={{ background }}>
      <div className="container z-10 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-center max-w-[560px] mx-auto text-center"
        >
          <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-[0.12em]" style={{ ...sans, background: "#F8FAFB", border: `1px solid ${ds.border}`, color: ds.navy }}>
            Testimonials
          </span>
          <h2 className="mt-5" style={{ ...sans, fontFamily: "var(--font-bricolage), var(--font-manrope), system-ui, sans-serif", fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.06, color: ds.navy, fontSize: "clamp(2rem, 4.6vw, 3.1rem)" }}>
            Loved by shippers across North America
          </h2>
          <p className="mt-5" style={{ ...sans, fontSize: 16.5, lineHeight: 1.6, color: ds.muted }}>
            From solo sellers to high-volume operations — here's what businesses shipping with ShipTime have to say.
          </p>
        </motion.div>

        <div className="flex justify-center gap-6 mt-12 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] max-h-[740px] overflow-hidden">
          <TestimonialsColumn testimonials={firstColumn} duration={15} />
          <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={19} />
          <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={17} />
        </div>
      </div>
    </section>
  );
}
