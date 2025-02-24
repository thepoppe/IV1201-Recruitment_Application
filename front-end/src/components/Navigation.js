"use client";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import Button from "@/components/ui/Button";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useUser } from "@/contexts/UserContext";

export default function Navigation() {
  const { dict, lang } = useLanguage(); // Get `dict` and `lang` from context
  const { user, logout } = useUser();

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
          <div className="flex items-center gap-4">
            {user ? (
              <>
                {/* User is logged in */}
                <span className="text-gray-600">
                  {dict.navigation.welcome}: {user.name}
                </span>
                {/* Profile link */}
                <Link href={`/${lang}/profile`}>
                  <Button variant="text">{dict.navigation.profile}</Button>
                </Link>
                {/* Logout button */}
                <Button onClick={logout}>{dict.navigation.logout}</Button>
              </>
            ) : (
              <>
                {/* Login button */}
                <Link href={`/${lang}/login`}>
                  <Button variant="text">{dict.navigation.login}</Button>
                </Link>
                {/* Create Account button */}
                <Link href={`/${lang}/create-account`}>
                  <Button variant="primary">
                    {dict.navigation.create_account}
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
