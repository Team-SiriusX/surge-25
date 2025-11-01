"use client";

import { useEffect, useState, useTransition, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import PageLoader from "@/components/ui/page-loader";

export function LoaderProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Show loader immediately on route change
    startTransition(() => {
      setIsLoading(true);
    });

    // Keep loader visible for minimum time, then wait for page to fully load
    const minDisplayTime = 600; // Minimum loader display time
    const startTime = Date.now();

    // Clear any existing timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // Wait for page to be fully loaded and interactive
    const checkPageReady = () => {
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, minDisplayTime - elapsedTime);

      timerRef.current = setTimeout(() => {
        // Additional check to ensure DOM is ready
        if (document.readyState === 'complete') {
          setIsLoading(false);
        } else {
          // Wait a bit more if page isn't ready
          window.addEventListener('load', () => {
            setTimeout(() => setIsLoading(false), 100);
          }, { once: true });
        }
      }, remainingTime);
    };

    // Start checking if page is ready
    if (document.readyState === 'complete') {
      checkPageReady();
    } else {
      window.addEventListener('load', checkPageReady, { once: true });
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      window.removeEventListener('load', checkPageReady);
    };
  }, [pathname, searchParams]);

  return (
    <>
      {isLoading && <PageLoader />}
      {children}
    </>
  );
}
