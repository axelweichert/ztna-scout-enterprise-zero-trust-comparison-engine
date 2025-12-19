import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
const resources = {
  en: {
    translation: {
      home: {
        hero: {
          badge: "B2B Analysis Engine",
          title1: "Enterprise Security",
          title2: "Comparison Redefined",
          description: "Stop guessing. Compare 13+ ZTNA providers with deterministic TCO projections and BSI compliance scoring.",
          cta_primary: "Start Free Analysis",
          cta_secondary: "View Sample PDF"
        },
        steps: {
          title: "The ZTNA Scout Methodology",
          subtitle: "How we deliver precision analytics for your security stack.",
          step1: { title: "Define Scope", desc: "Identify user count, legacy architecture, and specific security requirements." },
          step2: { title: "Market Sweep", desc: "Our engine maps your data against current list prices and feature matrixes." },
          step3: { title: "Strategy Report", desc: "Receive a professional PDF export with TCO projections and Scout scores." }
        },
        faq: {
          title: "Strategic Insights",
          q1: "Is the data up to date?",
          a1: "Our research team verifies pricing and feature matrixes quarterly. Last update: May 2024.",
          q2: "Why Cloudflare focused?",
          a2: "As a premier security architecture firm, we believe Cloudflare offers the most robust BSI-qualified ZTNA platform today.",
          q3: "Are the prices final?",
          a3: "Prices are market list estimates. Custom enterprise agreements often lead to additional discounts.",
          q4: "Is my data safe?",
          a4: "We are strictly GDPR compliant. Data is stored on encrypted Cloudflare infrastructure and deleted on request."
        }
      },
      form: {
        steps: { company: "Entity", requirements: "Architecture", legal: "Compliance" },
        labels: { companyName: "Entity Name", contactPerson: "Liaison Name", workEmail: "Corporate Email", seats: "Deployment Scale", vpnStatus: "Legacy State" },
        buttons: { continue: "Proceed", back: "Return", submit: "Verify & Generate", generating: "Processing Analysis..." },
        options: { vpn_active: "Active Legacy VPN", vpn_replacing: "Ongoing Migration", vpn_none: "SDP / Cloud Native" },
        legal: {
          processing: "I consent to the processing of my corporate data for the purpose of this analysis (Required).",
          contact: "I consent to professional follow-up by a certified security architect (Required).",
          marketing: "I would like to receive quarterly security landscape updates (Optional)."
        },
        submitted: {
          title: "Verification Sent",
          desc: "To ensure data integrity, please check your corporate inbox and click the verification link to unlock your report."
        }
      }
    }
  },
  de: {
    translation: {
      home: {
        hero: {
          badge: "B2B Analyse Engine",
          title1: "Enterprise Security",
          title2: "Vergleich neu gedacht",
          description: "Schluss mit Schätzungen. Vergleichen Sie 13+ ZTNA-Anbieter mit deterministischen TCO-Projektionen.",
          cta_primary: "Analyse starten",
          cta_secondary: "Beispiel-PDF ansehen"
        },
        steps: {
          title: "Die ZTNA Scout Methodik",
          subtitle: "So erstellen wir präzise Analysen für Ihren Security Stack.",
          step1: { title: "Anforderungen", desc: "Definition von Benutzeranzahl, Legacy-Architektur und Security-Needs." },
          step2: { title: "Markt-Abgleich", desc: "Unsere Engine gleicht Ihre Daten mit aktuellen Listenpreisen ab." },
          step3: { title: "Strategie-Bericht", desc: "Erhalt eines professionellen PDF-Exports mit TCO und Scout Score." }
        },
        faq: {
          title: "Strategische Einblicke",
          q1: "Sind die Daten aktuell?",
          a1: "Unser Research-Team prüft Preise und Features quartalsweise. Letztes Update: Mai 2024.",
          q2: "Warum Cloudflare?",
          a2: "Cloudflare bietet derzeit die am stärksten BSI-qualifizierte ZTNA-Plattform am Markt.",
          q3: "Sind die Preise fix?",
          a3: "Dies sind Markt-Listenpreise. Individuelle Enterprise-Rabatte sind oft möglich.",
          q4: "Datenschutz?",
          a4: "Wir sind DSGVO-konform. Daten werden auf verschlüsselter Cloudflare-Infrastruktur gespeichert."
        }
      },
      form: {
        steps: { company: "Unternehmen", requirements: "Infrastruktur", legal: "Compliance" },
        legal: {
          processing: "Ich stimme der Datenverarbeitung zum Zwecke der Analyse zu (Erforderlich).",
          contact: "Ich wünsche eine Kontaktaufnahme durch einen Security-Experten (Erforderlich).",
          marketing: "Ich möchte quartalsweise Sicherheits-Updates erhalten (Optional)."
        },
        submitted: {
          title: "E-Mail Bestätigung",
          desc: "Bitte prüfen Sie Ihr Postfach und klicken Sie auf den Bestätigungslink, um Ihren Bericht freizuschalten."
        }
      }
    }
  },
  fr: {
    translation: {
      home: {
        hero: {
          badge: "Moteur d'analyse B2B",
          title1: "Sécurité d'entreprise",
          title2: "Comparaison Redéfinie",
          description: "Comparez plus de 13 fournisseurs ZTNA avec des projections TCO déterministes.",
          cta_primary: "Lancer l'analyse",
          cta_secondary: "Exemple PDF"
        }
      }
    }
  }
};
i18n.use(LanguageDetector).use(initReactI18next).init({ resources, fallbackLng: 'en', interpolation: { escapeValue: false } });
export default i18n;