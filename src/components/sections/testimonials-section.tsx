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
    <div className="group relative mx-4 w-[380px] rounded-xl border border-neutral-800 bg-neutral-950/50 p-6 backdrop-blur-sm transition-all duration-500 hover:border-blue-500/50">
      <div className="mb-4 flex items-start gap-3">
        <img
          src={avatar}
          alt={name}
          className="h-10 w-10 rounded-full ring-1 ring-neutral-800 transition-all duration-300 group-hover:ring-blue-500/50"
        />
        <div className="flex-1">
          <h4 className="text-sm font-medium text-white">{name}</h4>
          <p className="text-xs text-neutral-500">{role}</p>
          <p className="text-xs text-blue-500">{university}</p>
        </div>
      </div>
      <p className="text-sm leading-relaxed text-neutral-400">
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
    <section className="relative w-full overflow-hidden bg-black py-32">
      
      {/* Minimal Header */}
      <div className="relative z-10 mx-auto mb-20 max-w-3xl px-4 text-center">
        <h2 className="mb-3 text-4xl font-bold text-white md:text-5xl">
          Trusted by Students
        </h2>
        <p className="text-base text-neutral-500">
          Join thousands building their future
        </p>
      </div>

      {/* Scrolling testimonials - Minimal spacing */}
      <ThreeDScrollTriggerContainer className="space-y-4">
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
