"use client";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { useLanguage } from "@/contexts/LanguageContext";

/**
 * GuestMenu component that displays navigation options for unauthenticated users.
 * 
 * This client-side component renders in the navigation bar when no user is logged in.
 * It provides links to the login and account creation pages, with proper localization
 * for link paths and button text. The component uses different button styles to
 * visually distinguish between the primary action (create account) and the secondary
 * action (login).
 * 
 * @component
 * @returns {JSX.Element} The rendered GuestMenu component with login and create account buttons
 */
export default function GuestMenu() {
  const { dict, lang } = useLanguage();

  return (
    <div className="flex items-center gap-4">
      <Link href={`/${lang}/login`}>
        <Button variant="text">{dict.navigation.login}</Button>
      </Link>
      <Link href={`/${lang}/create-account`}>
        <Button variant="primary">{dict.navigation.create_account}</Button>
      </Link>
    </div>
  );
}
