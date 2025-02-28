"use client";
import { ArrowPathIcon } from "@heroicons/react/24/solid";

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
