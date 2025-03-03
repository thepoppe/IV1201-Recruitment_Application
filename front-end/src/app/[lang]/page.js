"use client";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import Button from "@/components/ui/Button";

export default function Home() {
  const { dict, lang } = useLanguage();

  const handleClick = () => {
    alert("Application form is not available yet");
  };

  return (
    <div className="flex flex-col items-center justify-center text-center pt-[6rem]">
      <h1 className="text-4xl font-bold mb-6">{dict.home.title}</h1>
      <p className="max-w-lg text-lg mb-6">{dict.home.description} 🚀🎢</p>
      <Link href={`/${lang}/apply`}>
        <Button variant="danger">{dict.home.apply}</Button>
      </Link>
    </div>
  );
}
