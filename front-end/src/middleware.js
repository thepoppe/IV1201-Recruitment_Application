import { NextResponse } from "next/server";

let locales = ["en", "sv"];

function getLocale(request) {
  const acceptLanguage = request.headers.get("accept-language");
  if (!acceptLanguage) return "en";

  const preferredLocale = acceptLanguage.split(",")[0].split("-")[0];
  return locales.includes(preferredLocale) ? preferredLocale : "en";
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

  // Protect /[lang]/profile - Redirect non-logged-in users to /[lang]/login
  if (!token && pathname === `/${currentLocale}/profile`) {
    console.log("Unauthorized: Redirecting to login");
    return NextResponse.redirect(
      new URL(`/${currentLocale}/login`, request.url)
    );
  }

  // Prevent logged-in users from accessing /[lang]/login and /[lang]/create-account
  if (
    token &&
    ["/login", "/create-account"].some(
      (route) => pathname === `/${currentLocale}${route}`
    )
  ) {
    console.log("Already logged in: Redirecting to profile");
    return NextResponse.redirect(
      new URL(`/${currentLocale}/profile`, request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/en/profile",
    "/sv/profile",
    "/en/login",
    "/sv/login",
    "/en/create-account",
    "/sv/create-account",
  ],
};
