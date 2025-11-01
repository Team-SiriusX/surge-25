"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import Image from "next/image";

export default function PageLoader() {
  const loaderRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loader = loaderRef.current;
    const logo = logoRef.current;
    const circle = circleRef.current;
    const text = textRef.current;

    if (!loader || !logo || !circle || !text) return;

    // Set initial visibility immediately
    gsap.set([circle, logo, text], { opacity: 1 });

    // Start continuous animations immediately - will run until unmount
    const rotationAnim = gsap.to(circle, {
      rotation: "+=360",
      duration: 1.5,
      ease: "linear",
      repeat: -1,
      repeatRefresh: true,
    });

    const pulseAnim = gsap.to(logo, {
      scale: 1.08,
      duration: 1,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    });

    // Smooth entrance animation (doesn't block continuous animations)
    gsap.fromTo(
      loader,
      { opacity: 0 },
      { opacity: 1, duration: 0.2, ease: "power2.out" }
    );

    return () => {
      rotationAnim.kill();
      pulseAnim.kill();
      gsap.killTweensOf([loader, logo, circle, text]);
    };
  }, []);

  return (
    <div
      ref={loaderRef}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-sm"
    >
      {/* Optimized ambient effect - single glow, no animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      {/* Loader content - simplified */}
      <div className="relative flex flex-col items-center gap-6">
        {/* Animated circle - smaller for efficiency */}
        <div className="relative w-24 h-24">
          <div
            ref={circleRef}
            className="absolute inset-0 border-4 border-neutral-800 border-t-blue-500 rounded-full"
          />
          
          {/* Logo - optimized size */}
          <div
            ref={logoRef}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-neutral-900/80 backdrop-blur-xl border border-neutral-800">
              <Image
                src="/logo.svg"
                alt="Loading"
                width={32}
                height={32}
                className="drop-shadow-lg brightness-90"
                priority
              />
            </div>
          </div>
        </div>

        {/* Simplified loading text */}
        <div ref={textRef} className="flex items-center gap-2">
          <span className="text-sm font-medium text-neutral-400">Loading</span>
          <div className="flex gap-1">
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
        </div>
      </div>
    </div>
  );
}
