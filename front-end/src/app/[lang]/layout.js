import "../globals.css";
import { Inter } from "next/font/google";
import Navigation from "@/components/Navigation";
import { getDictionary } from "./dictionaries";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Amusement Park - Join Our Team",
  description: "Apply to work at the most exciting amusement park",
};

export async function generateStaticParams() {
  return [{ lang: "en" }, { lang: "sv" }];
}

export default async function RootLayout({ children, params }) {
  const { lang } = await params; // Get the language from dynamic route
  const t = await getDictionary(lang); // Load translations

  return (
    <html lang={lang}>
      <body className={inter.className}>
        {/* Fixed Navigation */}
        <div className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
          <Navigation t={t} lang={lang} />
        </div>

        {/* Main Content with Padding to Avoid Overlap */}
        <main className="pt-[5rem] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
