import "../globals.css";
import { Inter } from "next/font/google";
import Navigation from "@/components/Navigation";
import { getDictionary } from "./dictionaries";
import { LanguageProvider } from "@/app/context/LanguageContext";

const inter = Inter({ subsets: ["latin"] });

export async function generateStaticParams() {
  return [{ lang: "en" }, { lang: "sv" }];
}

export default async function RootLayout({ children, params }) {
  const { lang } = await params; // Get the language from dynamic route
  const dict = await getDictionary(lang);

  return (
    <html lang={lang}>
      <body className={inter.className}>
        <LanguageProvider dict={dict} lang={lang}>
          {/* Fixed Navigation */}
          <div className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
            <Navigation />
          </div>

          {/* Main Content */}
          <main className="pt-[5rem] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-screen">
            {children}
          </main>
        </LanguageProvider>
      </body>
    </html>
  );
}
