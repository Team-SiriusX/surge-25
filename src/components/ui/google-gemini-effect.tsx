"use client";
import { motion } from "framer-motion";
import React from "react";

export const GoogleGeminiEffect = ({
  pathLengths,
  title,
  description,
  className,
}: {
  pathLengths: any[];
  title?: string;
  description?: string;
  className?: string;
}) => {
  return (
    <div className={`sticky top-40 py-40 ${className}`}>
      <p className="text-lg md:text-7xl font-bold text-white text-center">
        {title || "Build with Aceternity UI"}
      </p>
      <p className="text-xs md:text-xl font-normal text-white max-w-4xl text-center mx-auto mt-8">
        {description ||
          "Scroll this component and see the bottom SVG come to life wow this works!"}
      </p>
      <div className="w-full h-[890px] md:h-[600px] flex items-center justify-center mt-20 md:mt-32">
        <svg
          width="1440"
          height="890"
          viewBox="0 0 1440 890"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute w-full"
        >
          <path
            d="M0 0C0 0 302.5 127.5 720 127.5C1137.5 127.5 1440 0 1440 0V890H0V0Z"
            fill="url(#gradient1)"
            strokeWidth="2"
          />
          <motion.path
            d="M0 0C0 0 302.5 127.5 720 127.5C1137.5 127.5 1440 0 1440 0"
            stroke="url(#gradient2)"
            strokeWidth="3"
            fill="none"
            style={{
              pathLength: pathLengths[0],
            }}
          />
          <motion.path
            d="M0 50C0 50 302.5 177.5 720 177.5C1137.5 177.5 1440 50 1440 50"
            stroke="url(#gradient2)"
            strokeWidth="3"
            fill="none"
            style={{
              pathLength: pathLengths[1],
            }}
          />
          <motion.path
            d="M0 100C0 100 302.5 227.5 720 227.5C1137.5 227.5 1440 100 1440 100"
            stroke="url(#gradient2)"
            strokeWidth="3"
            fill="none"
            style={{
              pathLength: pathLengths[2],
            }}
          />
          <motion.path
            d="M0 150C0 150 302.5 277.5 720 277.5C1137.5 277.5 1440 150 1440 150"
            stroke="url(#gradient2)"
            strokeWidth="3"
            fill="none"
            style={{
              pathLength: pathLengths[3],
            }}
          />
          <motion.path
            d="M0 200C0 200 302.5 327.5 720 327.5C1137.5 327.5 1440 200 1440 200"
            stroke="url(#gradient2)"
            strokeWidth="3"
            fill="none"
            style={{
              pathLength: pathLengths[4],
            }}
          />
          <defs>
            <linearGradient id="gradient1" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(0,0,0,0)" stopOpacity="0" />
              <stop offset="100%" stopColor="rgba(0,0,0,1)" stopOpacity="1" />
            </linearGradient>
            <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(59, 130, 246, 0)" stopOpacity="0" />
              <stop offset="30%" stopColor="rgba(59, 130, 246, 0.8)" stopOpacity="1" />
              <stop offset="50%" stopColor="rgba(96, 165, 250, 1)" stopOpacity="1" />
              <stop offset="70%" stopColor="rgba(59, 130, 246, 0.8)" stopOpacity="1" />
              <stop offset="100%" stopColor="rgba(59, 130, 246, 0)" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
};
