import Link from "next/link";
import Button from "@/components/ui/Button";

export default function Navigation({ t, lang }) {
  return (
    <nav className="border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0">
            {/* Text logo link to home */}
            <Link href={`/${lang}`} className="text-xl font-bold">
              {t.navigation.logo}
            </Link>
          </div>
          <div className="flex gap-4">
            {/* Login button */}
            <Button variant="text">{t.navigation.login}</Button>
            {/* Create Account button */}
            <Link href={`/${lang}/create-account`}>
              <Button variant="primary">{t.navigation.create_account}</Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
