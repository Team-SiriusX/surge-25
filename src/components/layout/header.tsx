"use client";

import { DynamicNavigation } from "@/components/ui/dynamic-navigation";
import { Home, Users, Briefcase, Mail, Sparkles } from "lucide-react";

const navigationLinks = [
  { 
    id: "home", 
    label: "Home", 
    href: "/", 
    icon: <Home size={16} /> 
  },
  { 
    id: "about", 
    label: "About", 
    href: "/about", 
    icon: <Users size={16} /> 
  },
  { 
    id: "projects", 
    label: "Projects", 
    href: "/projects", 
    icon: <Briefcase size={16} /> 
  },
  { 
    id: "sample", 
    label: "Sample", 
    href: "/sample", 
    icon: <Sparkles size={16} /> 
  },
  { 
    id: "contact", 
    label: "Contact", 
    href: "/contact", 
    icon: <Mail size={16} /> 
  },
];

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 px-4">
      <div className="w-full max-w-2xl">
        <DynamicNavigation
          links={navigationLinks}
          backgroundColor="rgba(255, 255, 255, 0.05)"
          textColor="#ffffff"
          highlightColor="rgba(255, 255, 255, 0.15)"
          glowIntensity={8}
          showLabelsOnMobile={false}
          enableRipple={true}
          onLinkClick={(id) => {
            console.log("Navigating to:", id);
          }}
        />
      </div>
    </header>
  );
}
