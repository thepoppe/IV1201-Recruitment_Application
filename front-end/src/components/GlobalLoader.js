"use client";
import { ArrowPathIcon } from "@heroicons/react/24/solid";

/**
 * GlobalLoader component displays a full-screen loading indicator.
 * 
 * This client-side component renders a centered spinner with a loading message
 * that covers the entire viewport. It's used to indicate that the application
 * is currently fetching data or performing some other operation that requires
 * the user to wait.
 * 
 * The component uses:
 * - ArrowPathIcon from Heroicons with animation for the spinner
 * - Fixed positioning to cover the entire screen
 * - High z-index (9999) to ensure it's shown above all other elements
 * - White background to obscure underlying content during loading
 * 
 * @component
 * @returns {JSX.Element} The rendered GlobalLoader component
 */
export default function GlobalLoader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-[9999]">
      <div className="flex flex-col items-center">
        <ArrowPathIcon className="h-16 w-16 animate-spin text-gray-600" />
        <p className="mt-3 text-gray-700 font-semibold text-lg">Loading...</p>
      </div>
    </div>
  );
}
