"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, useMotionValueEvent, useScroll } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Menu, X } from "lucide-react";

interface NavItem {
  name: string;
  link: string;
}

export const Navbar = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 20);
  });

  return (
    <motion.nav
      animate={{
        paddingTop: isScrolled ? "0.75rem" : "1.5rem",
        paddingBottom: isScrolled ? "0.75rem" : "1.5rem",
        paddingLeft: isScrolled ? "2rem" : "1rem",
        paddingRight: isScrolled ? "2rem" : "1rem",
      }}
      transition={{
        duration: 0.3,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={cn("fixed top-0 left-0 right-0 z-50", className)}
    >
      <div className="mx-auto max-w-7xl">
        {children}
      </div>
    </motion.nav>
  );
};

export const NavBody = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 20);
  });

  return (
    <motion.div
      animate={{
        height: isScrolled ? "3.25rem" : "5rem",
        paddingLeft: isScrolled ? "2rem" : "2rem",
        paddingRight: isScrolled ? "2rem" : "2rem",
        borderRadius: isScrolled ? "0.75rem" : "1rem",
        marginLeft: isScrolled ? "1.5rem" : "0rem",
        marginRight: isScrolled ? "1.5rem" : "0rem",
      }}
      transition={{
        duration: 0.3,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={cn(
        "hidden md:flex items-center justify-between w-full border border-neutral-800 bg-black/40 shadow-2xl backdrop-blur-xl",
        className
      )}
    >
      {children}
    </motion.div>
  );
};

export const NavItems = ({ items, className }: { items: NavItem[]; className?: string }) => {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 20);
  });

  return (
    <motion.div
      animate={{
        gap: isScrolled ? "1.5rem" : "2.5rem",
      }}
      transition={{
        duration: 0.3,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={cn("flex items-center", className)}
    >
      {items.map((item, idx) => (
        <motion.div
          key={`nav-${idx}`}
          animate={{
            fontSize: isScrolled ? "0.875rem" : "1rem",
          }}
          transition={{
            duration: 0.3,
            ease: [0.25, 0.1, 0.25, 1],
          }}
        >
          <Link
            href={item.link}
            className="font-medium text-neutral-300 transition-colors hover:text-white"
          >
            {item.name}
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
};

export const NavbarLogo = ({ className }: { className?: string }) => {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 20);
  });

  return (
    <Link href="/" className={cn("flex items-center gap-3", className)}>
      <motion.div
        animate={{
          width: isScrolled ? "2.25rem" : "3rem",
          height: isScrolled ? "2.25rem" : "3rem",
        }}
        transition={{
          duration: 0.3,
          ease: [0.25, 0.1, 0.25, 1],
        }}
        className="flex items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/30"
      >
        <motion.span
          animate={{
            fontSize: isScrolled ? "1rem" : "1.5rem",
          }}
          transition={{
            duration: 0.3,
            ease: [0.25, 0.1, 0.25, 1],
          }}
          className="font-bold text-white"
        >
          U
        </motion.span>
      </motion.div>
      <motion.div
        animate={{
          opacity: isScrolled ? 0 : 1,
          width: isScrolled ? 0 : "auto",
          marginRight: isScrolled ? "-0.75rem" : 0,
        }}
        transition={{
          duration: 0.3,
          ease: [0.25, 0.1, 0.25, 1],
        }}
        className="flex flex-col overflow-hidden"
      >
        <motion.h1
          animate={{
            fontSize: isScrolled ? "1.125rem" : "1.5rem",
            lineHeight: isScrolled ? "1.5rem" : "2rem",
          }}
          transition={{
            duration: 0.3,
            ease: [0.25, 0.1, 0.25, 1],
          }}
          className="bg-gradient-to-r from-neutral-50 to-neutral-400 bg-clip-text font-bold text-transparent whitespace-nowrap"
        >
          Uni Connect
        </motion.h1>
        <motion.span
          animate={{
            fontSize: isScrolled ? "0.625rem" : "0.75rem",
            opacity: isScrolled ? 0 : 1,
          }}
          transition={{
            duration: 0.3,
            ease: [0.25, 0.1, 0.25, 1],
          }}
          className="text-neutral-500 whitespace-nowrap"
        >
          Campus Marketplace
        </motion.span>
      </motion.div>
    </Link>
  );
};

export const NavbarButton = ({
  children,
  variant = "primary",
  className,
  onClick,
}: {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
  onClick?: () => void;
}) => {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 20);
  });

  return (
    <motion.button
      onClick={onClick}
      animate={{
        height: isScrolled ? "2.25rem" : "2.75rem",
        paddingLeft: isScrolled ? "1rem" : "1.5rem",
        paddingRight: isScrolled ? "1rem" : "1.5rem",
        fontSize: isScrolled ? "0.875rem" : "1rem",
        borderRadius: isScrolled ? "0.5rem" : "0.625rem",
      }}
      transition={{
        duration: 0.3,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={cn(
        "font-medium transition-all flex items-center justify-center whitespace-nowrap",
        variant === "primary" && "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40",
        variant === "secondary" && "border border-neutral-700 bg-neutral-900/50 text-neutral-300 hover:bg-neutral-800/50 hover:text-white",
        className
      )}
    >
      {children}
    </motion.button>
  );
};

export const MobileNav = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return (
    <div className={cn("md:hidden", className)}>
      {children}
    </div>
  );
};

export const MobileNavHeader = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 20);
  });

  return (
    <motion.div 
      animate={{
        marginLeft: isScrolled ? "1rem" : "0rem",
        marginRight: isScrolled ? "1rem" : "0rem",
      }}
      transition={{
        duration: 0.3,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={cn(
        "flex items-center justify-between rounded-2xl border border-neutral-800 bg-black/40 px-4 py-3 shadow-2xl backdrop-blur-xl",
        className
      )}
    >
      {children}
    </motion.div>
  );
};

export const MobileNavToggle = ({
  isOpen,
  onClick,
  className,
}: {
  isOpen: boolean;
  onClick: () => void;
  className?: string;
}) => {
  return (
    <button
      onClick={onClick}
      className={cn("text-neutral-300 transition-colors hover:text-white", className)}
      aria-label="Toggle menu"
    >
      {isOpen ? <X size={24} /> : <Menu size={24} />}
    </button>
  );
};

export const MobileNavMenu = ({
  children,
  isOpen,
  onClose,
  className,
}: {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          className={cn(
            "mt-2 overflow-hidden rounded-2xl border border-neutral-800 bg-black/40 backdrop-blur-xl",
            className
          )}
        >
          <div className="flex flex-col gap-4 p-4">
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
