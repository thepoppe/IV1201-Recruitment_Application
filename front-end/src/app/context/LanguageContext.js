"use client";
import { createContext, useContext } from "react";

// Create Language Context
const LanguageContext = createContext();

// Language Provider Component
export function LanguageProvider({ dict, lang, children }) {
  return (
    <LanguageContext.Provider value={{ dict, lang }}>
      {children}
    </LanguageContext.Provider>
  );
}

// Hook to Use Context in Any Component
export function useLanguage() {
  return useContext(LanguageContext);
}
