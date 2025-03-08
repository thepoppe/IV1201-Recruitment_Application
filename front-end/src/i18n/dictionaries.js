import "server-only";

/**
 * Dictionary loader configuration for supported languages.
 * 
 * This object maps language codes to dynamic import functions that load
 * the corresponding translation dictionary. Each import is lazy-loaded
 * to improve performance by only loading the required language.
 * 
 * @type {Object.<string, Function>}
 */
const dictionaries = {
  en: () => import("./dictionaries/en").then((module) => module.default),
  sv: () => import("./dictionaries/sv").then((module) => module.default),
};

/**
 * Retrieves the dictionary for the specified locale.
 * 
 * This server-only function loads the appropriate translation dictionary
 * based on the requested locale. If the requested locale is not supported,
 * it falls back to English as the default language.
 * 
 * @async
 * @function getDictionary
 * @param {string} locale - The language code to load (e.g., "en", "sv")
 * @returns {Promise<Object>} The translation dictionary for the requested locale
 */
export const getDictionary = async (locale) => {
  return dictionaries[locale] ? dictionaries[locale]() : dictionaries["en"]();
};
