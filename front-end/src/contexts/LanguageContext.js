"use client";
import { createContext, useContext } from "react";

/**
 * Context for managing language-related state throughout the application.
 * 
 * This context provides access to the current language code and translation
 * dictionary for all components in the application tree.
 * 
 * @type {React.Context}
 */
const LanguageContext = createContext();

/**
 * Provider component for the LanguageContext.
 * 
 * This component sets up the language context for the application, making
 * translations and the current language code available to all child components.
 * It should be placed high in the component tree, typically in the root layout.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.dict - Dictionary of translations for the current language
 * @param {string} props.lang - Current language code (e.g., "en", "sv")
 * @param {React.ReactNode} props.children - Child components to be wrapped
 * @returns {JSX.Element} The language provider with its children
 */
export function LanguageProvider({ dict, lang, children }) {
  return (
    <LanguageContext.Provider value={{ dict, lang }}>
      {children}
    </LanguageContext.Provider>
  );
}

/**
 * Custom hook for accessing the language context.
 * 
 * This hook provides components with access to the current language settings,
 * including the translation dictionary and language code. It must be used
 * within a component that is a descendant of LanguageProvider.
 * 
 * @function
 * @returns {Object} Language context object
 * @returns {Object} returns.dict - Dictionary of translations for the current language
 * @returns {string} returns.lang - Current language code
 * @throws {Error} If used outside of a LanguageProvider
 */
export function useLanguage() {
  return useContext(LanguageContext);
}
