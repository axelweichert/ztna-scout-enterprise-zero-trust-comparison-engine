import React, { createContext, useContext, useMemo, useState } from "react";

export type Lang = "de" | "en" | "fr";

type Dict = Record<string, string | Dict>;

const STRINGS: Record<Lang, Dict> = {
  de: {
    legal: {
      imprint: {
        title: "Impressum",
        provider_title: "Anbieter",
        contact_title: "Kontakt",
        register_title: "Registereintrag",
        vat_title: "USt-IdNr.",
        responsible_title: "Verantwortlich",
      },
      privacy: {
        title: "Datenschutzerklärung",
      },
    },
    common: {
      back: "Zurück",
      language: "Sprache",
    },
    footer: {
      line1: "von Busch GmbH – Alfred-Bozi-Straße 12 – 33602 Bielefeld",
      line2: "Ein Service der von Busch GmbH",
      line3: "Built with ♥ at Cloudflare",
      imprint: "Impressum",
      privacy: "Datenschutz",
    },
  },
  en: {
    legal: {
      imprint: {
        title: "Legal Notice",
        provider_title: "Provider",
        contact_title: "Contact",
        register_title: "Company Register",
        vat_title: "VAT ID",
        responsible_title: "Responsible",
      },
      privacy: {
        title: "Privacy Policy",
      },
    },
    common: {
      back: "Back",
      language: "Language",
    },
    footer: {
      line1: "von Busch GmbH – Alfred-Bozi-Straße 12 – 33602 Bielefeld",
      line2: "A service by von Busch GmbH",
      line3: "Built with ♥ at Cloudflare",
      imprint: "Legal Notice",
      privacy: "Privacy",
    },
  },
  fr: {
    legal: {
      imprint: {
        title: "Mentions légales",
        provider_title: "Éditeur",
        contact_title: "Contact",
        register_title: "Registre",
        vat_title: "TVA",
        responsible_title: "Responsable",
      },
      privacy: {
        title: "Politique de confidentialité",
      },
    },
    common: {
      back: "Retour",
      language: "Langue",
    },
    footer: {
      line1: "von Busch GmbH – Alfred-Bozi-Straße 12 – 33602 Bielefeld",
      line2: "Un service de von Busch GmbH",
      line3: "Built with ♥ at Cloudflare",
      imprint: "Mentions légales",
      privacy: "Confidentialité",
    },
  },
};

function getStoredLang(): Lang {
  const v = (typeof window !== "undefined" && window.localStorage.getItem("lang")) || "";
  if (v === "de" || v === "en" || v === "fr") return v;
  return "de";
}

function setStoredLang(lang: Lang) {
  if (typeof window !== "undefined") window.localStorage.setItem("lang", lang);
}

function getValue(dict: Dict, path: string): string | undefined {
  const parts = path.split(".");
  let cur: any = dict;
  for (const p of parts) {
    if (!cur || typeof cur !== "object") return undefined;
    cur = cur[p];
  }
  return typeof cur === "string" ? cur : undefined;
}

export type TFunction = (key: string) => string;

type I18nCtx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: TFunction;
};

const Ctx = createContext<I18nCtx | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, _setLang] = useState<Lang>(getStoredLang());

  const setLang = (l: Lang) => {
    _setLang(l);
    setStoredLang(l);
  };

  const t = useMemo<TFunction>(() => {
    return (key: string) => {
      const v = getValue(STRINGS[lang], key);
      return v ?? key;
    };
  }, [lang]);

  const value = useMemo(() => ({ lang, setLang, t }), [lang, t]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useI18n() {
  const ctx = useContext(Ctx);
  if (!ctx) {
    return { lang: "de" as Lang, setLang: (_: Lang) => {}, t: (k: string) => k };
  }
  return ctx;
}
