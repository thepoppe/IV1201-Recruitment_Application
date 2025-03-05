"use client";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useUser } from "@/contexts/UserContext";

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
