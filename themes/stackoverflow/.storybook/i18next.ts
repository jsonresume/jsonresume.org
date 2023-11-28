import { initReactI18next } from "react-i18next";
import i18n from "i18next";
import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import translations from "../src/translations.json";
i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(Backend)
  .init({
    fallbackLng: "en",
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
    supportedLngs: ["en", "de"],
    resources: translations,
  });

export default i18n;
