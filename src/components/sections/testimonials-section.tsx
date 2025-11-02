"use client";

import React from "react";
import {
  ThreeDScrollTriggerContainer,
  ThreeDScrollTriggerRow,
} from "@/components/ui/three-d-scroll-trigger";

// Testimonial data for CampusConnect
const testimonials = [
  {
    name: "Ahmed Ali",
    role: "Computer Science Senior",
    university: "LUMS",
    quote: "CampusConnect helped me find the perfect team for my capstone project. We built an AI startup that's now funded!",
    avatar: "https://i.pravatar.cc/150?img=25",
  },
  {
    name: "Fatima Khan",
    role: "Business Major",
    university: "NUST",
    quote: "Found an amazing internship through CampusConnect. The smart matching algorithm connected me with opportunities I never knew existed.",
    avatar: "https://i.pravatar.cc/150?img=45",
  },
  {
    name: "Hassan Raza",
    role: "Design Student",
    university: "FAST-NUCES",
    quote: "As a designer, finding tech collaborators was always hard. CampusConnect made it seamless. Built 3 projects in one semester!",
    avatar: "https://i.pravatar.cc/150?img=36",
  },
  {
    name: "Ayesha Malik",
    role: "Engineering Student",
    university: "UET Lahore",
    quote: "Joined a hackathon team through CampusConnect and we won first place. Now we're turning it into a real company!",
    avatar: "https://i.pravatar.cc/150?img=51",
  },
  {
    name: "Bilal Ahmed",
    role: "Data Science Major",
    university: "GIKI",
    quote: "CampusConnect's real-time messaging made collaborating with teammates across campus so much easier. Game changer for group projects!",
    avatar: "https://i.pravatar.cc/150?img=11",
  },
  {
    name: "Sara Yousaf",
    role: "MBA Candidate",
    university: "IBA Karachi",
    quote: "The platform helped me discover talented developers for my startup idea. We've raised seed funding and launched successfully!",
    avatar: "https://i.pravatar.cc/150?img=33",
  },
  {
    name: "Usman Tariq",
    role: "Marketing Student",
    university: "COMSATS",
    quote: "Found freelance opportunities that actually paid well. CampusConnect understands what students need to earn while learning.",
    avatar: "https://i.pravatar.cc/150?img=28",
  },
  {
    name: "Zainab Hassan",
    role: "Mechanical Engineering",
    university: "NED University",
    quote: "Connected with a research team doing groundbreaking work in robotics. CampusConnect opened doors I didn't know existed!",
    avatar: "https://i.pravatar.cc/150?img=12",
  },
];

// Minimal Testimonial Card Component
function TestimonialCard({
  name,
  role,
  university,
  quote,
  avatar,
}: {
  name: string;
  role: string;
  university: string;
  quote: string;
  avatar: string;
}) {
  return (
    <div className="group relative mx-2 w-[280px] rounded-xl border border-neutral-800 bg-neutral-950/50 p-4 backdrop-blur-sm transition-all duration-500 hover:border-blue-500/50 sm:mx-3 sm:w-[320px] sm:p-5 md:mx-4 md:w-[380px] md:p-6">
      <div className="mb-3 flex items-start gap-2 sm:mb-4 sm:gap-3">
        <img
          src={avatar}
          alt={name}
          className="h-8 w-8 rounded-full ring-1 ring-neutral-800 transition-all duration-300 group-hover:ring-blue-500/50 sm:h-9 sm:w-9 md:h-10 md:w-10"
        />
        <div className="flex-1">
          <h4 className="text-xs font-medium text-white sm:text-sm">{name}</h4>
          <p className="text-[10px] text-neutral-500 sm:text-xs">{role}</p>
          <p className="text-[10px] text-blue-500 sm:text-xs">{university}</p>
        </div>
      </div>
      <p className="text-xs leading-relaxed text-neutral-400 sm:text-sm">
        {quote}
      </p>
    </div>
  );
}

export function TestimonialsSection() {
  // Split testimonials into 3 rows
  const row1 = testimonials.slice(0, 3);
  const row2 = testimonials.slice(3, 6);
  const row3 = testimonials.slice(6, 8);

  return (
    <section className="relative w-full overflow-hidden bg-black py-16 sm:py-20 md:py-28 lg:py-32">
      
      {/* Minimal Header */}
      <div className="relative z-10 mx-auto mb-12 max-w-3xl px-4 text-center sm:mb-16 md:mb-20">
        <h2 className="mb-2 text-2xl font-bold text-white sm:text-3xl md:mb-3 md:text-4xl lg:text-5xl">
          Trusted by Students
        </h2>
        <p className="text-sm text-neutral-500 sm:text-base">
          Join thousands building their future
        </p>
      </div>

      {/* Scrolling testimonials - Minimal spacing */}
      <ThreeDScrollTriggerContainer className="space-y-3 sm:space-y-4">
        {/* Row 1 - Moving right */}
        <ThreeDScrollTriggerRow baseVelocity={2.5} direction={1}>
          {row1.map((testimonial, idx) => (
            <TestimonialCard key={`row1-${idx}`} {...testimonial} />
          ))}
        </ThreeDScrollTriggerRow>

        {/* Row 2 - Moving left */}
        <ThreeDScrollTriggerRow baseVelocity={2.5} direction={-1}>
          {row2.map((testimonial, idx) => (
            <TestimonialCard key={`row2-${idx}`} {...testimonial} />
          ))}
        </ThreeDScrollTriggerRow>

        {/* Row 3 - Moving right */}
        <ThreeDScrollTriggerRow baseVelocity={2.5} direction={1}>
          {row3.map((testimonial, idx) => (
            <TestimonialCard key={`row3-${idx}`} {...testimonial} />
          ))}
        </ThreeDScrollTriggerRow>
      </ThreeDScrollTriggerContainer>
    </section>
  );
}
