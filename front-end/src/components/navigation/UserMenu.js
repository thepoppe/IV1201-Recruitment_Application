"use client";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useUser } from "@/contexts/UserContext";

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
