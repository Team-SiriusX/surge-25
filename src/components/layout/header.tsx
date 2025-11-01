"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Navbar,
  NavBody,
  NavItems,
  NavbarLogo,
  NavbarButton,
  MobileNav,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";

const navItems = [
  { name: "Home", link: "/" },
  { name: "About", link: "/about" },
  { name: "Projects", link: "/projects" },
  { name: "Sample", link: "/sample" },
  { name: "Contact", link: "/contact" },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  return (
    <Navbar>
      {/* Desktop Navigation */}
      <NavBody>
        <NavbarLogo />
        <NavItems items={navItems} />
        <div className="flex items-center gap-3">
          <NavbarButton
            variant="secondary"
            onClick={() => router.push("/auth/sign-in")}
          >
            Login
          </NavbarButton>
          <NavbarButton
            variant="primary"
            onClick={() => router.push("/auth/sign-up")}
          >
            Sign up
          </NavbarButton>
        </div>
      </NavBody>

      {/* Mobile Navigation */}
      <MobileNav>
        <MobileNavHeader>
          <NavbarLogo />
          <MobileNavToggle isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />
        </MobileNavHeader>

        <MobileNavMenu isOpen={isOpen} onClose={() => setIsOpen(false)}>
          {navItems.map((item, idx) => (
            <Link
              key={`mobile-nav-${idx}`}
              href={item.link}
              className="text-sm font-medium text-neutral-300 transition-colors hover:text-white"
              onClick={() => setIsOpen(false)}
            >
              {item.name}
            </Link>
          ))}
          <div className="mt-2 flex flex-col gap-2 border-t border-neutral-800 pt-4">
            <NavbarButton
              variant="secondary"
              onClick={() => {
                setIsOpen(false);
                router.push("/auth/sign-in");
              }}
              className="w-full"
            >
              Login
            </NavbarButton>
            <NavbarButton
              variant="primary"
              onClick={() => {
                setIsOpen(false);
                router.push("/auth/sign-up");
              }}
              className="w-full"
            >
              Sign up
            </NavbarButton>
          </div>
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  );
}
