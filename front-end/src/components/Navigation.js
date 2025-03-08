"use client";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useUser } from "@/contexts/UserContext";
import UserMenu from "@/components/navigation/UserMenu";
import RecruiterMenu from "@/components/navigation/RecruiterMenu";
import GuestMenu from "@/components/navigation/GuestMenu";

/**
 * Navigation component that serves as the main navigation bar for the application.
 * 
 * This client-side component renders the application's top navigation bar with
 * conditional rendering of different menu types based on user authentication status
 * and role. It includes:
 * - A text logo that links to the home page
 * - A language switcher for internationalization
 * - Role-based navigation menus:
 *   - RecruiterMenu: For authenticated users with recruiter role
 *   - UserMenu: For authenticated standard users
 *   - GuestMenu: For unauthenticated visitors
 * 
 * The component adapts its UI based on authentication state and user roles,
 * while maintaining consistent branding and language selection options.
 * 
 * @component
 * @returns {JSX.Element} The rendered Navigation component
 */
export default function Navigation() {
  const { dict, lang } = useLanguage();
  const { user } = useUser();

  return (
    <nav className="border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0">
            {/* Text logo link to home */}
            <Link href={`/${lang}`} className="text-xl font-bold mr-4">
              {dict.navigation.logo}
            </Link>
            {/* Language Switcher */}
            <LanguageSwitcher />
          </div>

          {/* Render the correct menu based on user role */}
          {user ? (
            user.role === "recruiter" ? <RecruiterMenu /> : <UserMenu />
          ) : (
            <GuestMenu />
          )}
        </div>
      </div>
    </nav>
  );
}
