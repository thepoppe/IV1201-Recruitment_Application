"use client";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useUser } from "@/contexts/UserContext";
import UserMenu from "@/components/navigation/UserMenu";
import RecruiterMenu from "@/components/navigation/RecruiterMenu";
import GuestMenu from "@/components/navigation/GuestMenu";

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
