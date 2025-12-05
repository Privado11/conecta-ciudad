import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import esErrors from "./locales/es/error.json";
import enErrors from "./locales/en/error.json";
import esFields from "./locales/es/fields.json";
import enFields from "./locales/en/fields.json";

// Combinar todas las traducciones
const es = {
  errors: esErrors.errors,
  fields: esFields.fields,
};

const en = {
  errors: enErrors.errors,
  fields: enFields.fields,
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      es: {
        translation: es,
      },
      en: {
        translation: en,
      },
    },

    fallbackLng: "es",

    supportedLngs: ["es", "en"],

    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },

    interpolation: {
      escapeValue: false,
      prefix: "{{",
      suffix: "}}",
    },

    debug: import.meta.env.DEV,

    defaultNS: "translation",

    returnEmptyString: false,
    returnNull: false,
  });

export default i18n;
