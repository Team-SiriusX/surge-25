"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export function FooterSection() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { name: "Features", href: "#features" },
      { name: "How it Works", href: "#how-it-works" },
      { name: "Pricing", href: "#pricing" },
      { name: "Testimonials", href: "#testimonials" },
    ],
    company: [
      { name: "About", href: "/about" },
      { name: "Blog", href: "/blog" },
      { name: "Careers", href: "/careers" },
      { name: "Contact", href: "/contact" },
    ],
    legal: [
      { name: "Privacy", href: "/privacy" },
      { name: "Terms", href: "/terms" },
      { name: "Security", href: "/security" },
      { name: "Cookies", href: "/cookies" },
    ],
    social: [
      { name: "Twitter", href: "https://twitter.com" },
      { name: "LinkedIn", href: "https://linkedin.com" },
      { name: "GitHub", href: "https://github.com" },
      { name: "Discord", href: "https://discord.com" },
    ],
  };

  return (
    <footer className="relative w-full border-t border-neutral-800 bg-black">
      {/* Subtle glow effect at top */}
      <div className="absolute left-1/2 top-0 h-px w-1/2 -translate-x-1/2 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
      
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 md:py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 gap-6 sm:gap-8 md:grid-cols-5">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="group inline-block">
              <motion.h3 
                className="mb-2 text-lg font-bold text-white transition-colors duration-300 group-hover:text-blue-500 sm:mb-3 sm:text-xl"
                whileHover={{ scale: 1.02 }}
              >
                CampusConnect
              </motion.h3>
            </Link>
            <p className="text-xs text-neutral-500 sm:text-sm">
              Connecting students, building futures.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="mb-3 text-xs font-semibold text-white sm:mb-4 sm:text-sm">Product</h4>
            <ul className="space-y-1.5 sm:space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-xs text-neutral-500 transition-colors duration-300 hover:text-blue-500 sm:text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="mb-3 text-xs font-semibold text-white sm:mb-4 sm:text-sm">Company</h4>
            <ul className="space-y-1.5 sm:space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-xs text-neutral-500 transition-colors duration-300 hover:text-blue-500 sm:text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="mb-3 text-xs font-semibold text-white sm:mb-4 sm:text-sm">Legal</h4>
            <ul className="space-y-1.5 sm:space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-xs text-neutral-500 transition-colors duration-300 hover:text-blue-500 sm:text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="mb-3 text-xs font-semibold text-white sm:mb-4 sm:text-sm">Social</h4>
            <ul className="space-y-1.5 sm:space-y-2">
              {footerLinks.social.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-neutral-500 transition-colors duration-300 hover:text-blue-500 sm:text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-neutral-800 pt-6 sm:mt-10 sm:gap-4 sm:pt-8 md:mt-12 md:flex-row">
          <p className="text-xs text-neutral-600 sm:text-sm">
            © {currentYear} CampusConnect. All rights reserved.
          </p>
          
          <div className="flex items-center gap-4 sm:gap-6">
            <Link
              href="/privacy"
              className="text-xs text-neutral-600 transition-colors duration-300 hover:text-blue-500 sm:text-sm"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-xs text-neutral-600 transition-colors duration-300 hover:text-blue-500 sm:text-sm"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
