"use client";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { useUser } from "@/contexts/UserContext";
import Button from "@/components/ui/Button";

/**
 * Home page component for the application landing page.
 * 
 * This client-side component renders the main landing page with different content
 * based on the user's authentication status and role. It displays:
 * - A welcome message and description for all visitors
 * - Different action buttons or messages depending on whether the user is:
 *   - Not logged in (shows application button)
 *   - Logged in as a regular user (shows role-specific message)
 *   - Logged in as a recruiter (shows recruiter-specific message)
 * 
 * @component
 * @returns {JSX.Element} The rendered Home page component
 */
export default function Home() {
  const { user } = useUser();
  const { dict, lang } = useLanguage();

  return (
    <div className="flex flex-col items-center justify-center text-center pt-[6rem]">
      <h1 className="text-4xl font-bold mb-6">{dict.home.title}</h1>
      <p className="max-w-lg text-lg mb-6">{dict.home.description} 🚀🎢</p>
      {!user && (
        <Link href={`/${lang}/apply`}>
          <Button variant="danger">{dict.home.apply}</Button>
        </Link>
      )}
    </div>
  );
}
