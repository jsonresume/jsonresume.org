import i18n from "i18next";
export type Language = "en" | "de";
import translations from "./translations.json";

export const createI18N = (language: Language) => {
  i18n.init({
    resources: translations,
    lng: language as string, // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
    // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
    // if you're using a language detector, do not define the lng option

    interpolation: {
      escapeValue: false, // react already safes from xss
    },
    fallbackLng: "en",
  });
  return i18n;
};
