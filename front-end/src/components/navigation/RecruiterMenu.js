"use client";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useUser } from "@/contexts/UserContext";

/**
 * RecruiterMenu component that displays navigation options for authenticated recruiter users.
 * 
 * This client-side component renders in the navigation bar when a user with recruiter role
 * is logged in. It provides:
 * - A personalized welcome message with the user's name
 * - A link to the user's profile page
 * - A special link to the admin area (styled distinctively)
 * - A logout button to end the user session
 * 
 * The component handles localization for all text elements and link paths.
 * 
 * @component
 * @returns {JSX.Element} The rendered RecruiterMenu component with profile, admin area links and logout button
 */
export default function RecruiterMenu() {
  const { dict, lang } = useLanguage();
  const { user, logout } = useUser();

  return (
    <div className="flex items-center gap-4">
      <span className="text-gray-600">
        {dict.navigation.welcome}: {user.name}
      </span>
      <Link href={`/${lang}/profile`}>
        <Button variant="text">{dict.navigation.profile}</Button>
      </Link>
      <Link href={`/${lang}/admin`}>
        <Button variant="secondary" className="bg-yellow-600 hover:bg-yellow-700">{dict.navigation.admin_area}</Button>
      </Link>
      <Button onClick={logout}>{dict.navigation.logout}</Button>
    </div>
  );
}
