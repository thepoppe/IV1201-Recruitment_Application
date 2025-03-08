"use client";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";

/**
 * Array of supported languages with their metadata
 * 
 * @const {Array<Object>} languages
 * @property {string} code - Language code (e.g., "en", "sv")
 * @property {string} label - Display name of the language
 * @property {string} flag - Path to the flag image
 */
const languages = [
  { code: "en", label: "English", flag: "/flags/us.svg" },
  { code: "sv", label: "Svenska", flag: "/flags/se.svg" },
];

/**
 * LanguageSwitcher component provides a dropdown interface for changing the application language.
 * 
 * This client-side component renders a button showing the current language with its flag,
 * which opens a dropdown menu of available languages when clicked. Selecting a language
 * updates the URL path to reflect the new language while preserving the current route.
 * 
 * The component handles:
 * - Displaying the current language with its flag
 * - Toggling the dropdown menu
 * - Changing the application language while preserving the current path
 * - Navigation to the same page in the new language
 * 
 * @component
 * @returns {JSX.Element} The rendered LanguageSwitcher component
 */
export default function LanguageSwitcher() {
  const { lang } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  /**
   * Handles language change selection from the dropdown
   *
   * Updates the URL to use the new language code while preserving
   * the current path, then navigates to the new URL.
   *
   * @function
   * @param {string} newLang - The language code to switch to
   * @returns {void}
   */
  const handleLanguageChange = (newLang) => {
    if (newLang === lang) return;

    // Preserve the current path, but switch the language
    const newPath = pathname.replace(`/${lang}`, `/${newLang}`);
    setIsOpen(false);
    router.push(newPath);
  };

  return (
    <div className="relative inline-block text-left">
      {/* Toggle Dropdown */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-gray-200 px-3 py-2 rounded-md hover:bg-gray-300"
      >
        <Image
          src={languages.find((l) => l.code === lang)?.flag}
          alt="Flag"
          width={20}
          height={20}
          className="rounded-full"
        />
        <span>{languages.find((l) => l.code === lang)?.label}</span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute mt-2 w-32 bg-white border rounded-md shadow-lg">
          {languages.map((l) => (
            <button
              key={l.code}
              onClick={() => handleLanguageChange(l.code)}
              className="flex items-center w-full px-3 py-2 hover:bg-gray-100"
            >
              <Image
                src={l.flag}
                alt={`${l.label} Flag`}
                width={20}
                height={20}
                className="mr-2 rounded-full"
              />
              {l.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
