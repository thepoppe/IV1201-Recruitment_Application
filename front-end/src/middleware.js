import { NextResponse } from "next/server";

export function middleware(request) {
  const { pathname } = new URL(request.url);

  // Redirect `/` to `/en`
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/en", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/"], // Apply middleware to `/`
};
