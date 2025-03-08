"use client";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useUser } from "@/contexts/UserContext";

/**
 * UserMenu component that displays navigation options for authenticated regular users.
 * 
 * This client-side component renders in the navigation bar when a standard user 
 * (non-recruiter) is logged in. It provides:
 * - A personalized welcome message with the user's name
 * - A link to the user's profile page
 * - A context-aware action button that changes based on application status:
 *   - "View Application" if the user has already applied (links to profile)
 *   - "Apply for Position" if the user has not yet applied (links to application form)
 * - A logout button to end the user session
 * 
 * The component adapts its UI based on the user's application state and handles
 * localization for all text elements and link paths.
 * 
 * @component
 * @returns {JSX.Element} The rendered UserMenu component with contextual navigation options
 */
export default function UserMenu() {
  const { dict, lang } = useLanguage();
  const { user, application, logout } = useUser();

  return (
    <div className="flex items-center gap-4">
      <span className="text-gray-600">
        {dict.navigation.welcome}: {user.name}
      </span>
      <Link href={`/${lang}/profile`}>
        <Button variant="text">{dict.navigation.profile}</Button>
      </Link>

      {application ? (
        <Link href={`/${lang}/profile`}>
          <Button variant="secondary" className="bg-green-600 hover:bg-green-700">
            {dict.navigation.view_application}
          </Button>
        </Link>
      ) : (
        <Link href={`/${lang}/apply`}>
          <Button variant="primary" className="bg-red-600 hover:bg-red-700">{dict.navigation.apply_for_position}</Button>
        </Link>
      )}

      <Button onClick={logout}>{dict.navigation.logout}</Button>
    </div>
  );
}
