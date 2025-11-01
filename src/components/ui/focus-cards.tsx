"use client";

import Image from "next/image";
import React, { useState } from "react";
import { cn } from "@/lib/utils";

export type Card = {
  title: string;
  src: string;
  description?: string;
  href?: string;
};

export const FocusCards = ({ cards }: { cards: Card[] }) => {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 md:gap-8 max-w-7xl mx-auto w-full">
      {cards.map((card, index) => (
        <Card
          key={card.title}
          card={card}
          index={index}
          hovered={hovered}
          setHovered={setHovered}
        />
      ))}
    </div>
  );
};

const Card = ({
  card,
  index,
  hovered,
  setHovered,
}: {
  card: Card;
  index: number;
  hovered: number | null;
  setHovered: React.Dispatch<React.SetStateAction<number | null>>;
}) => {
  const handleClick = () => {
    if (card.href) {
      window.location.href = card.href;
    }
  };

  return (
    <div
      onMouseEnter={() => setHovered(index)}
      onMouseLeave={() => setHovered(null)}
      onClick={handleClick}
      className={cn(
        "rounded-2xl relative bg-neutral-900 dark:bg-neutral-900 overflow-hidden h-80 md:h-96 w-full transition-all duration-500 ease-out cursor-pointer border border-neutral-800 hover:border-primary/40",
        hovered !== null && hovered !== index && "blur-sm scale-[0.98] brightness-75"
      )}
    >
      <Image
        src={card.src}
        alt={card.title}
        fill
        className="object-cover absolute inset-0 transition-transform duration-500 ease-out"
        style={{
          transform: hovered === index ? "scale(1.05)" : "scale(1)",
        }}
      />
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/90 flex items-end transition-all duration-300",
          hovered === index && "bg-gradient-to-b from-black/30 via-black/50 to-black/95"
        )}
      >
        <div className="p-6 md:p-8 w-full space-y-2">
          <h3
            className={cn(
              "text-2xl md:text-3xl font-bold text-white transition-all duration-300",
              hovered === index && "translate-y-0 opacity-100",
              hovered !== null && hovered !== index && "translate-y-2 opacity-70"
            )}
          >
            {card.title}
          </h3>
          {card.description && (
            <p
              className={cn(
                "text-sm md:text-base text-neutral-300 transition-all duration-300",
                hovered === index ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              )}
            >
              {card.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
