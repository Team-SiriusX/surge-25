import { getSessionCookie } from "better-auth/cookies";
import { NextRequest, NextResponse } from "next/server";
import {
  authRoutes,
  DEFAULT_LOGIN_REDIRECT,
  publicRoutes,
  SIGN_IN_PAGE_PATH,
} from "./routes";

/**
 * Checks if a pathname matches a route pattern with wildcard support
 * @param pathname - The current pathname to check
 * @param pattern - The route pattern (can include wildcards like /finder/*)
 * @returns boolean indicating if the pathname matches the pattern
 */
function matchesRoute(pathname: string, pattern: string): boolean {
  // Exact match
  if (pathname === pattern) {
    return true;
  }

  // Wildcard match - convert pattern to regex
  if (pattern.includes("*")) {
    const regexPattern = pattern
      .replace(/\*/g, ".*") // Replace * with .*
      .replace(/\//g, "\\/"); // Escape forward slashes
    const regex = new RegExp(`^${regexPattern}$`);
    return regex.test(pathname);
  }

  return false;
}

/**
 * Checks if pathname matches any route in the array
 */
function matchesRoutes(pathname: string, routes: string[]): boolean {
  return routes.some((route) => matchesRoute(pathname, route));
}

export async function middleware(request: NextRequest) {
  const { nextUrl } = request;

  const sessionCookie = getSessionCookie(request);
  const session = !!sessionCookie;

  const pathname = nextUrl.pathname;

  const isAuthRoute = matchesRoutes(pathname, authRoutes);
  const isPublicRoute = matchesRoutes(pathname, publicRoutes);

  const isApiRoute =
    pathname.startsWith("/api/") || pathname.startsWith("/trpc/");

  if (isApiRoute) {
    return NextResponse.next();
  }

  if (isAuthRoute) {
    if (session) {
      return NextResponse.redirect(
        new URL(DEFAULT_LOGIN_REDIRECT, request.url)
      );
    }
    return NextResponse.next();
  }

  if (isPublicRoute) {
    return NextResponse.next();
  }

  if (!session) {
    return NextResponse.redirect(new URL(SIGN_IN_PAGE_PATH, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|public|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest|mp4|mov|avi|mkv|mp3|wav)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
