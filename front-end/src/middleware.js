import { NextResponse } from "next/server";

// Configuration - easy to modify
const locales = ["en", "sv"];
const defaultLocale = "en";
const protectedRoutes = ["/profile", "/apply"];
const authRoutes = ["/login", "/create-account"];

// Helper function to get locale from request
function getLocale(request) {
  const acceptLanguage = request.headers.get("accept-language");
  if (!acceptLanguage) return defaultLocale;

  const preferredLocale = acceptLanguage.split(",")[0].split("-")[0];
  return locales.includes(preferredLocale) ? preferredLocale : defaultLocale;
}

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;

  console.log("Middleware Triggered");
  console.log("Pathname:", pathname);
  console.log("Token Exists:", token);

  // Ensure pathname includes a locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (!pathnameHasLocale) {
    const locale = getLocale(request);
    request.nextUrl.pathname = `/${locale}${pathname}`;
    console.log("Redirecting to locale:", request.nextUrl.pathname);
    return NextResponse.redirect(request.nextUrl);
  }

  const currentLocale = pathname.split("/")[1]; // Extract locale from URL

  // Protect routes - Redirect non-logged-in users to login
  if (
    !token &&
    protectedRoutes.some((route) => pathname === `/${currentLocale}${route}`)
  ) {
    console.log("Unauthorized: Redirecting to login");
    return NextResponse.redirect(
      new URL(`/${currentLocale}/login`, request.url)
    );
  }

  // Prevent logged-in users from accessing auth routes
  if (
    token &&
    authRoutes.some((route) => pathname === `/${currentLocale}${route}`)
  ) {
    console.log("Already logged in: Redirecting to profile");
    return NextResponse.redirect(
      new URL(`/${currentLocale}/profile`, request.url)
    );
  }

  return NextResponse.next();
}

// Static matcher configuration that matches the original
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
  ],
};
