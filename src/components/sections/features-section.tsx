"use client";

import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import FeatureCarousel from "@/components/ui/feature-carousel";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
    Briefcase,
    Users,
    MessageSquare,
    Target,
    BookOpen,
    Rocket,
    Trophy,
    UserCheck,
    Search,
    BarChart3,
    Bell,
    Star,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export function FeaturesSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const carouselRef = useRef<HTMLDivElement>(null);
    const ctaRef = useRef<HTMLDivElement>(null);
    const highlightRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        if (!sectionRef.current) return;

        const ctx = gsap.context(() => {
            // Header animation
            if (headerRef.current) {
                gsap.from(headerRef.current.children, {
                    y: 40,
                    opacity: 0,
                    duration: 0.6,
                    stagger: 0.1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: headerRef.current,
                        start: "top 80%",
                        end: "top 50%",
                        toggleActions: "play none none none",
                    },
                });
            }

            // Highlight bar animation
            if (highlightRef.current) {
                gsap.fromTo(
                    highlightRef.current,
                    {
                        scaleX: 0,
                        transformOrigin: "left center",
                    },
                    {
                        scaleX: 1,
                        duration: 0.8,
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: highlightRef.current,
                            start: "top 80%",
                            end: "top 55%",
                            scrub: 0.5,
                        },
                    }
                );
            }

            // Carousel fade-in and scale
            if (carouselRef.current) {
                gsap.from(carouselRef.current, {
                    scale: 0.95,
                    opacity: 0,
                    duration: 0.8,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: carouselRef.current,
                        start: "top 75%",
                        end: "top 45%",
                        toggleActions: "play none none none",
                    },
                });
            }

            // CTA animation
            if (ctaRef.current) {
                gsap.from(ctaRef.current, {
                    y: 20,
                    opacity: 0,
                    duration: 0.6,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: ctaRef.current,
                        start: "top 85%",
                        end: "top 65%",
                        toggleActions: "play none none none",
                    },
                });
            }
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    const features = [
        {
            id: 1,
            name: "Dual Role System",
            icon: UserCheck,
            details: "Switch between Talent Finder and Seeker seamlessly",
        },
        {
            id: 2,
            name: "Job Posting",
            icon: Briefcase,
            details: "Create opportunities for projects, startups, and part-time work",
        },
        {
            id: 3,
            name: "Smart Matching",
            icon: Target,
            details: "AI-powered match scores between profiles and opportunities",
        },
        {
            id: 4,
            name: "Real-time Chat",
            icon: MessageSquare,
            details: "Connect instantly with seekers and finders via messaging",
        },
        {
            id: 5,
            name: "Academic Projects",
            icon: BookOpen,
            details: "Collaborate on research and coursework with peers",
        },
        {
            id: 6,
            name: "Startup Collaboration",
            icon: Rocket,
            details: "Find co-founders and team members for your venture",
        },
        {
            id: 7,
            name: "Competition Teams",
            icon: Trophy,
            details: "Form teams for hackathons and contests",
        },
        {
            id: 8,
            name: "Advanced Search",
            icon: Search,
            details: "Filter by skills, type, and tags to find perfect matches",
        },
        {
            id: 9,
            name: "Analytics Dashboard",
            icon: BarChart3,
            details: "Track views, applications, and engagement metrics",
        },
        {
            id: 10,
            name: "Team Discovery",
            icon: Users,
            details: "Build diverse teams across different disciplines",
        },
        {
            id: 11,
            name: "Push Notifications",
            icon: Bell,
            details: "Stay updated on applications and new opportunities",
        },
        {
            id: 12,
            name: "Saved Opportunities",
            icon: Star,
            details: "Bookmark and track interesting job postings",
        },
    ];

    return (
        <section ref={sectionRef} className="relative w-full overflow-hidden bg-black py-20 md:py-32">
            {/* Grid Background */}
            <div className="pointer-events-none absolute inset-0 select-none [background-image:linear-gradient(to_right,#171717_1px,transparent_1px),linear-gradient(to_bottom,#171717_1px,transparent_1px)] [background-size:40px_40px]" />

            {/* Content */}
            <div className="relative z-10">
                {/* Section Header */}
                <div
                    ref={headerRef}
                    className="mx-auto max-w-3xl px-4 text-center mb-16"
                >
                    <h2 className="text-3xl font-bold text-white sm:text-4xl md:text-5xl lg:text-6xl">
                        Explore{" "}
                        <span className="relative inline-block">
                            <span className="relative z-10 text-white">Features</span>
                            <span 
                                ref={highlightRef}
                                className="absolute bottom-2 left-0 z-0 h-3 w-full bg-blue-500/60"
                                style={{ transformOrigin: "left center" }}
                            />
                        </span>
                    </h2>
                    <p className="mt-4 text-lg text-neutral-400 sm:text-xl">
                        Discover the powerful tools that make CampusConnect the ultimate
                        platform for university talent discovery and collaboration.
                    </p>
                </div>

                {/* Feature Carousel */}
                <div ref={carouselRef}>
                    <FeatureCarousel
                        items={features}
                        scrollSpeedMs={2000}
                        visibleItemCount={9}
                    />
                </div>

                {/* Call to Action */}
                <div
                    ref={ctaRef}
                    className="mx-auto mt-16 max-w-2xl px-4 text-center"
                >
                    <p className="text-base text-neutral-400 sm:text-lg">
                        Whether you're looking to{" "}
                        <span className="font-semibold text-white">hire talent</span> or{" "}
                        <span className="font-semibold text-white">find opportunities</span>,
                        CampusConnect bridges the gap between ambition and achievement.
                    </p>
                </div>
            </div>

            {/* Bottom gradient fade */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black to-transparent" />
        </section>
    );
}
