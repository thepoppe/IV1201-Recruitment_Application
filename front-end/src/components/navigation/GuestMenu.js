"use client";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { useLanguage } from "@/contexts/LanguageContext";

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
