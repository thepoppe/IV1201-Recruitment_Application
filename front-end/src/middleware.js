import { NextResponse } from "next/server";
import axios from "axios";

/**
 * Configuration constants for middleware behavior
 * @const {string[]} locales - Supported language codes
 * @const {string} defaultLocale - Fallback language code
 * @const {string[]} protectedRoutes - Routes that require authentication
 * @const {string[]} authRoutes - Authentication-related routes (login, signup)
 * @const {string[]} recruiterRoutes - Routes restricted to recruiter role
 */
const locales = ["en", "sv"];
const defaultLocale = "en";
const protectedRoutes = ["/profile", "/apply", "/admin"];
const authRoutes = ["/login", "/create-account"];
const recruiterRoutes = ["/admin"];

/**
 * Determines the appropriate locale from the request headers
 * 
 * Examines the Accept-Language header to determine the user's preferred language.
 * Falls back to the default locale if no matching locale is found.
 * 
 * @function getLocale
 * @param {Request} request - The incoming HTTP request
 * @returns {string} The determined locale code
 */
function getLocale(request) {
  const acceptLanguage = request.headers.get("accept-language");
  if (!acceptLanguage) return defaultLocale;

  const preferredLocale = acceptLanguage.split(",")[0].split("-")[0];
  return locales.includes(preferredLocale) ? preferredLocale : defaultLocale;
}

/**
 * Next.js middleware function for handling route protection, internationalization, and role-based access
 * 
 * This middleware performs several functions:
 * 1. Ensures all routes include a valid locale prefix
 * 2. Protects designated routes by requiring authentication
 * 3. Redirects authenticated users away from login/signup pages
 * 4. Enforces role-based access control for recruiter-only routes
 * 
 * @async
 * @function middleware
 * @param {Request} request - The incoming HTTP request
 * @returns {NextResponse} The appropriate response (redirect or continue)
 */
export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;

  // Ensure pathname includes a locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (!pathnameHasLocale) {
    const locale = getLocale(request);
    request.nextUrl.pathname = `/${locale}${pathname}`;
    return NextResponse.redirect(request.nextUrl);
  }

  const currentLocale = pathname.split("/")[1]; // Extract locale from URL

  // Protect routes - Redirect non-logged-in users to login
  if (
    !token &&
    protectedRoutes.some((route) => pathname === `/${currentLocale}${route}`)
  ) {
    return NextResponse.redirect(
      new URL(`/${currentLocale}/login`, request.url)
    );
  }

  // Prevent logged-in users from accessing auth routes
  if (
    token &&
    authRoutes.some((route) => pathname === `/${currentLocale}${route}`)
  ) {
    return NextResponse.redirect(
      new URL(`/${currentLocale}/profile`, request.url)
    );
  }

  // Restrict /admin to recruiters only
  if (token && recruiterRoutes.some((route) => pathname.startsWith(route))) {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/person/me`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const user = response.data.data;

      if (user.role.name !== "recruiter") {
        return NextResponse.redirect(new URL("/", request.url)); // Redirect unauthorized users
      }
    } catch (error) {
      console.error("Error verifying recruiter access:", error);
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

/**
 * Configuration object for Next.js middleware path matching
 * 
 * Defines which routes the middleware should run on. Includes:
 * - Root path
 * - Profile pages (with locale variations)
 * - Authentication pages (with locale variations)
 * - Application pages (with locale variations)
 * - Admin section and all nested routes
 * 
 * @const {Object} config
 * @property {string[]} matcher - Array of path patterns to match
 */
export const config = {
  matcher: [
    "/",
    "/en/profile",
    "/sv/profile",
    "/en/login",
    "/sv/login",
    "/en/create-account",
    "/sv/create-account",
    "/en/apply",
    "/sv/apply",
    "/admin/:path*",
    "/en/admin/:path*",
    "/sv/admin/:path*",
  ],
};
