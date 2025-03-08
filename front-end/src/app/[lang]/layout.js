import "../globals.css";
import { Inter } from "next/font/google";
import Navigation from "@/components/Navigation";
import { getDictionary } from "@/i18n/dictionaries";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { UserProvider } from "@/contexts/UserContext";

/**
 * Inter font configuration with Latin subset
 * @const {Object} inter - Font object for the Inter typeface
 */
const inter = Inter({ subsets: ["latin"] });

/**
 * Generates static parameters for internationalization.
 * 
 * This function is used by Next.js to pre-render pages at build time
 * for each of the supported languages. It defines which language 
 * versions of the app should be generated.
 * 
 * @function generateStaticParams
 * @returns {Array<Object>} Array of lang parameter objects for static generation
 */
export async function generateStaticParams() {
  return [{ lang: "en" }, { lang: "sv" }];
}

/**
 * Root layout component that wraps all pages in the application.
 * 
 * This server-side component sets up the basic structure of the application
 * including the HTML document, body, context providers, and navigation.
 * It handles internationalization by loading the appropriate dictionary
 * based on the current language parameter.
 * 
 * @async
 * @component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components/pages to render within the layout
 * @param {Object} props.params - Route parameters
 * @param {string} props.params.lang - Language code from the URL
 * @returns {Promise<JSX.Element>} The rendered layout component
 */
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
