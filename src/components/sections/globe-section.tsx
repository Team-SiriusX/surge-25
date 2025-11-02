"use client";
import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const World = dynamic(
  () => import("@/components/ui/globe").then((m) => m.World),
  {
    ssr: false,
  }
);

export function GlobeSection() {
  const highlight1Ref = useRef<HTMLSpanElement>(null);
  const highlight2Ref = useRef<HTMLSpanElement>(null);
  const highlight3Ref = useRef<HTMLSpanElement>(null);
  const highlight4Ref = useRef<HTMLSpanElement>(null);
  const highlight5Ref = useRef<HTMLSpanElement>(null);
  const highlight6Ref = useRef<HTMLSpanElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const highlights = [
        highlight1Ref.current,
        highlight2Ref.current,
        highlight3Ref.current,
        highlight4Ref.current,
        highlight5Ref.current,
        highlight6Ref.current,
      ];

      highlights.forEach((highlight, index) => {
        if (highlight) {
          gsap.fromTo(
            highlight,
            {
              scaleX: 0,
              transformOrigin: "left center",
            },
            {
              scaleX: 1,
              duration: 1,
              ease: "power2.out",
              scrollTrigger: {
                trigger: highlight,
                start: "top 85%",
                end: "top 60%",
                scrub: 1,
              },
            }
          );
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const globeConfig = {
    pointSize: 4,
    globeColor: "#062056",
    showAtmosphere: true,
    atmosphereColor: "#FFFFFF",
    atmosphereAltitude: 0.1,
    emissive: "#062056",
    emissiveIntensity: 0.1,
    shininess: 0.9,
    polygonColor: "rgba(255,255,255,0.7)",
    ambientLight: "#38bdf8",
    directionalLeftLight: "#ffffff",
    directionalTopLight: "#ffffff",
    pointLight: "#ffffff",
    arcTime: 1000,
    arcLength: 0.9,
    rings: 1,
    maxRings: 3,
    initialPosition: { lat: 22.3193, lng: 114.1694 },
    autoRotate: true,
    autoRotateSpeed: 0.5,
  };

  const colors = ["#06b6d4", "#3b82f6", "#6366f1"];

  const sampleArcs = [
    {
      order: 1,
      startLat: -19.885592,
      startLng: -43.951191,
      endLat: -22.9068,
      endLng: -43.1729,
      arcAlt: 0.1,
      color: colors[Math.floor(Math.random() * colors.length)],
    },
    {
      order: 1,
      startLat: 28.6139,
      startLng: 77.209,
      endLat: 3.139,
      endLng: 101.6869,
      arcAlt: 0.2,
      color: colors[Math.floor(Math.random() * colors.length)],
    },
    {
      order: 1,
      startLat: -19.885592,
      startLng: -43.951191,
      endLat: -1.303396,
      endLng: 36.852443,
      arcAlt: 0.5,
      color: colors[Math.floor(Math.random() * colors.length)],
    },
    {
      order: 2,
      startLat: 1.3521,
      startLng: 103.8198,
      endLat: 35.6762,
      endLng: 139.6503,
      arcAlt: 0.2,
      color: colors[Math.floor(Math.random() * colors.length)],
    },
    {
      order: 2,
      startLat: 51.5072,
      startLng: -0.1276,
      endLat: 3.139,
      endLng: 101.6869,
      arcAlt: 0.3,
      color: colors[Math.floor(Math.random() * colors.length)],
    },
    {
      order: 2,
      startLat: -15.785493,
      startLng: -47.909029,
      endLat: 36.162809,
      endLng: -115.119411,
      arcAlt: 0.3,
      color: colors[Math.floor(Math.random() * colors.length)],
    },
    {
      order: 3,
      startLat: -33.8688,
      startLng: 151.2093,
      endLat: 22.3193,
      endLng: 114.1694,
      arcAlt: 0.3,
      color: colors[Math.floor(Math.random() * colors.length)],
    },
    {
      order: 3,
      startLat: 21.3099,
      startLng: -157.8581,
      endLat: 40.7128,
      endLng: -74.006,
      arcAlt: 0.3,
      color: colors[Math.floor(Math.random() * colors.length)],
    },
    {
      order: 3,
      startLat: -6.2088,
      startLng: 106.8456,
      endLat: 51.5072,
      endLng: -0.1276,
      arcAlt: 0.3,
      color: colors[Math.floor(Math.random() * colors.length)],
    },
    {
      order: 4,
      startLat: 11.986597,
      startLng: 8.571831,
      endLat: -15.595412,
      endLng: -56.05918,
      arcAlt: 0.5,
      color: colors[Math.floor(Math.random() * colors.length)],
    },
    {
      order: 4,
      startLat: -34.6037,
      startLng: -58.3816,
      endLat: 22.3193,
      endLng: 114.1694,
      arcAlt: 0.7,
      color: colors[Math.floor(Math.random() * colors.length)],
    },
    {
      order: 4,
      startLat: 51.5072,
      startLng: -0.1276,
      endLat: 48.8566,
      endLng: 2.3522,
      arcAlt: 0.1,
      color: colors[Math.floor(Math.random() * colors.length)],
    },
    {
      order: 5,
      startLat: 14.5995,
      startLng: 120.9842,
      endLat: 51.5072,
      endLng: -0.1276,
      arcAlt: 0.3,
      color: colors[Math.floor(Math.random() * colors.length)],
    },
    {
      order: 5,
      startLat: 1.3521,
      startLng: 103.8198,
      endLat: -33.8688,
      endLng: 151.2093,
      arcAlt: 0.2,
      color: colors[Math.floor(Math.random() * colors.length)],
    },
    {
      order: 5,
      startLat: 34.0522,
      startLng: -118.2437,
      endLat: 48.8566,
      endLng: 2.3522,
      arcAlt: 0.2,
      color: colors[Math.floor(Math.random() * colors.length)],
    },
  ];

  return (
    <section ref={sectionRef} className="relative w-full overflow-hidden bg-black py-12 sm:py-16 md:py-24 lg:py-32">
      {/* Grid Background */}
      <div className="pointer-events-none absolute inset-0 select-none [background-image:linear-gradient(to_right,#171717_1px,transparent_1px),linear-gradient(to_bottom,#171717_1px,transparent_1px)] [background-size:20px_20px] sm:[background-size:30px_30px] md:[background-size:40px_40px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-6 sm:gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Content Side */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="order-2 lg:order-1"
          >
            <div className="space-y-4 sm:space-y-6 md:space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
                  Connect with Students{" "}
                  <span className="relative inline-block">
                    <span className="relative z-10 text-white mix-blend-lighten">Worldwide</span>
                    <span 
                      ref={highlight1Ref}
                      className="absolute bottom-0.5 left-0 z-0 h-2.5 w-full bg-blue-500/80 sm:bottom-1 sm:h-3 md:bottom-1.5 md:h-4 lg:h-5"
                      style={{ 
                        boxShadow: "0 0 20px rgba(59, 130, 246, 0.5)",
                        transformOrigin: "left center",
                      }}
                    />
                  </span>
                </h2>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
                className="max-w-xl text-sm leading-relaxed text-neutral-400 sm:text-base md:text-lg lg:text-xl"
              >
                Join a{" "}
                <span className="relative inline-block">
                  <span className="relative z-10 font-medium text-white mix-blend-lighten">global network</span>
                  <span 
                    ref={highlight2Ref}
                    className="absolute bottom-0.5 left-0 z-0 h-2.5 w-full bg-blue-500/70"
                    style={{ transformOrigin: "left center" }}
                  />
                </span>{" "}
                of talented students collaborating on projects, internships, and{" "}
                <span className="relative inline-block">
                  <span className="relative z-10 font-medium text-white mix-blend-lighten">startup opportunities</span>
                  <span 
                    ref={highlight3Ref}
                    className="absolute bottom-0.5 left-0 z-0 h-2.5 w-full bg-blue-500/70"
                    style={{ transformOrigin: "left center" }}
                  />
                </span>
                . UniConnect bridges the gap between ambition and opportunity.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
                className="flex flex-col gap-2 pt-2 text-sm text-neutral-400 sm:gap-3 sm:text-base md:text-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                  <span>
                    <span className="relative inline-block font-medium text-white">
                      <span className="relative z-10 mix-blend-lighten">Global Reach</span>
                      <span 
                        ref={highlight4Ref}
                        className="absolute bottom-0.5 left-0 z-0 h-2.5 w-full bg-blue-500/60"
                        style={{ transformOrigin: "left center" }}
                      />
                    </span>{" "}
                    — Connect with students from universities across the world
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                  <span>
                    <span className="relative inline-block font-medium text-white">
                      <span className="relative z-10 mix-blend-lighten">Real Opportunities</span>
                      <span 
                        ref={highlight5Ref}
                        className="absolute bottom-0.5 left-0 z-0 h-2.5 w-full bg-blue-500/60"
                        style={{ transformOrigin: "left center" }}
                      />
                    </span>{" "}
                    — Access internships, projects, and startup collaborations
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                  <span>
                    <span className="relative inline-block font-medium text-white">
                      <span className="relative z-10 mix-blend-lighten">Build Your Network</span>
                      <span 
                        ref={highlight6Ref}
                        className="absolute bottom-0.5 left-0 z-0 h-2.5 w-full bg-blue-500/60"
                        style={{ transformOrigin: "left center" }}
                      />
                    </span>{" "}
                    — Create meaningful connections that last beyond graduation
                  </span>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Globe Side */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="order-1 lg:order-2"
          >
            <div className="relative mx-auto h-[300px] w-full sm:h-[350px] md:h-[450px] lg:h-[550px] xl:h-[600px]">
              <div className="absolute inset-0 z-0">
                <World data={sampleArcs} globeConfig={globeConfig} />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black to-transparent" />
    </section>
  );
}
