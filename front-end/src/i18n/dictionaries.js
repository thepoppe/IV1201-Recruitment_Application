import "server-only";

const dictionaries = {
  en: () => import("./dictionaries/en").then((module) => module.default),
  sv: () => import("./dictionaries/sv").then((module) => module.default),
};

export const getDictionary = async (locale) => {
  return dictionaries[locale] ? dictionaries[locale]() : dictionaries["en"]();
};
