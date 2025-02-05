import "./globals.css";
import { Inter } from "next/font/google";
import Navigation from "@/components/Navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Amusement Park - Join Our Team",
  description: "Apply to work at the most exciting amusement park",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navigation />
        <main className="h-[calc(100vh-5rem)] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 bg-gray-50">
          {children}
        </main>
      </body>
    </html>
  );
}
