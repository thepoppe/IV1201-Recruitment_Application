import "../globals.css";
import { Inter } from "next/font/google";
import Navigation from "@/components/Navigation";
import { getDictionary } from "@/i18n/dictionaries";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { UserProvider } from "@/contexts/UserContext";

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
        <UserProvider>
          <LanguageProvider dict={dict} lang={lang}>
            {/* Fixed Navigation */}
            <div className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
              <Navigation />
            </div>

            {/* Main Content */}
            <main className="px-4 sm:px-6 lg:px-8 min-h-screen pt-[6rem]">
              <div className="flex justify-center max-w-7xl mx-auto py-6">
                {children}
              </div>
            </main>
          </LanguageProvider>
        </UserProvider>
      </body>
    </html>
  );
}
