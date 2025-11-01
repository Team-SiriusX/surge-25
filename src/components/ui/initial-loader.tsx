"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import Image from "next/image";

export default function InitialLoader() {
  const loaderRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const circle1Ref = useRef<HTMLDivElement>(null);
  const circle2Ref = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loader = loaderRef.current;
    const logo = logoRef.current;
    const circle1 = circle1Ref.current;
    const circle2 = circle2Ref.current;
    const text = textRef.current;
    const progress = progressRef.current;

    if (!loader || !logo || !circle1 || !circle2 || !text || !progress) return;

    // Create master timeline
    const tl = gsap.timeline({
      onComplete: () => {
        // Slide up and fade out
        gsap.to(loader, {
          y: -window.innerHeight,
          opacity: 0,
          duration: 0.8,
          ease: "power2.inOut",
          onComplete: () => setIsLoading(false),
        });
      },
    });

    // Initial setup
    gsap.set([logo, circle1, circle2, text, progress], { opacity: 0 });
    gsap.set(progress, { scaleX: 0, transformOrigin: "left" });

    // Sophisticated animation sequence
    tl
      // Logo entrance
      .to(logo, {
        opacity: 1,
        scale: 1,
        rotation: 360,
        duration: 1,
        ease: "back.out(1.5)",
      })
      // Circles appear
      .to(
        [circle1, circle2],
        {
          opacity: 1,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
        },
        "-=0.5"
      )
      // Text appears
      .to(
        text,
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power2.out",
        },
        "-=0.3"
      )
      // Progress bar fills
      .to(
        progress,
        {
          opacity: 1,
          scaleX: 1,
          duration: 1.5,
          ease: "power2.inOut",
        },
        "-=0.2"
      );

    // Continuous animations
    gsap.to(circle1, {
      rotation: 360,
      duration: 3,
      ease: "linear",
      repeat: -1,
    });

    gsap.to(circle2, {
      rotation: -360,
      duration: 4,
      ease: "linear",
      repeat: -1,
    });

    gsap.to(logo, {
      y: -5,
      duration: 1.5,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    });

    // Cleanup
    return () => {
      tl.kill();
    };
  }, []);

  if (!isLoading) return null;

  return (
    <div
      ref={loaderRef}
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-black"
    >
      {/* Ambient effects - matching landing page */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-400/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      {/* Grid pattern - matching landing page */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

      {/* Loader content */}
      <div className="relative flex flex-col items-center gap-12">
        {/* Animated circles and logo */}
        <div className="relative w-40 h-40">
          {/* Outer circle */}
          <div
            ref={circle1Ref}
            className="absolute inset-0 border-[3px] border-neutral-800 border-t-blue-500 rounded-full"
            style={{ opacity: 0, transform: "scale(0.8)" }}
          />
          
          {/* Inner circle */}
          <div
            ref={circle2Ref}
            className="absolute inset-4 border-[2px] border-neutral-800 border-b-blue-400 rounded-full"
            style={{ opacity: 0, transform: "scale(0.8)" }}
          />
          
          {/* Logo */}
          <div
            ref={logoRef}
            className="absolute inset-0 flex items-center justify-center"
            style={{ opacity: 0, transform: "scale(0)" }}
          >
            <div className="w-20 h-20 flex items-center justify-center rounded-2xl bg-neutral-900/80 backdrop-blur-xl border border-neutral-800 shadow-2xl">
              <Image
                src="/logo.svg"
                alt="Loading"
                width={48}
                height={48}
                className="drop-shadow-lg brightness-90"
                priority
              />
            </div>
          </div>
        </div>

        {/* Text and progress */}
        <div className="flex flex-col items-center gap-6 min-w-[300px]">
          <div
            ref={textRef}
            className="flex flex-col items-center gap-2"
            style={{ opacity: 0, transform: "translateY(20px)" }}
          >
            <h1 className="text-3xl font-bold bg-gradient-to-r from-neutral-50 to-neutral-400 bg-clip-text text-transparent">
              Uni Connect
            </h1>
            <p className="text-sm text-neutral-500">Campus Marketplace</p>
          </div>

          {/* Progress bar */}
          <div className="w-full h-1 bg-neutral-900 border border-neutral-800 rounded-full overflow-hidden">
            <div
              ref={progressRef}
              className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full"
              style={{ opacity: 0 }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
