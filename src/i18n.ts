import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
const resources = {
  en: {
    translation: {
      hero: {
        title: "ZTNA Scout",
        subtitle: "Find the best Zero Trust solution for your enterprise."
      },
      form: {
        steps: {
          company: "Company",
          requirements: "Requirements",
          consent: "Consent"
        },
        labels: {
          companyName: "Company Name",
          contactPerson: "Contact Person",
          workEmail: "Work Email",
          seats: "Number of Users (Seats)",
          vpnStatus: "Current Network Security",
          consent: "I agree to receive the personalized ZTNA comparison and consent to be contacted by a security expert."
        },
        buttons: {
          continue: "Continue",
          back: "Back",
          submit: "Get My Comparison",
          generating: "Generating..."
        },
        options: {
          vpn_active: "Using Legacy VPN",
          vpn_replacing: "Replacing VPN",
          vpn_none: "Cloud Native / No VPN"
        }
      },
      results: {
        title: "Your ZTNA Comparison",
        subtitle: "Based on {{seats}} seats.",
        tco_title: "Estimated TCO (Year 1)",
        score: "Score",
        bsi_qualified: "BSI QUALIFIED",
        export_pdf: "Export PDF",
        disclaimer: "Prices are estimates based on market research. Final pricing may vary."
      }
    }
  },
  de: {
    translation: {
      hero: {
        title: "ZTNA Scout",
        subtitle: "Finden Sie die beste Zero Trust Lösung für Ihr Unternehmen."
      },
      form: {
        steps: {
          company: "Unternehmen",
          requirements: "Anforderungen",
          consent: "Zustimmung"
        },
        labels: {
          companyName: "Unternehmensname",
          contactPerson: "Ansprechpartner",
          workEmail: "Geschäftliche E-Mail",
          seats: "Anzahl der Benutzer (Seats)",
          vpnStatus: "Aktuelle Netzwerksicherheit",
          consent: "Ich stimme dem Erhalt des personalisierten ZTNA-Vergleichs zu und willige ein, von einem Experten kontaktiert zu werden."
        },
        buttons: {
          continue: "Weiter",
          back: "Zurück",
          submit: "Vergleich anfordern",
          generating: "Wird erstellt..."
        },
        options: {
          vpn_active: "Nutze klassisches VPN",
          vpn_replacing: "VPN-Ablösung läuft",
          vpn_none: "Cloud Native / Kein VPN"
        }
      },
      results: {
        title: "Ihr ZTNA-Vergleich",
        subtitle: "Basierend auf {{seats}} Benutzern.",
        tco_title: "Geschätzte TCO (Jahr 1)",
        score: "Bewertung",
        bsi_qualified: "BSI QUALIFIZIERT",
        export_pdf: "PDF Exportieren",
        disclaimer: "Die Preise sind Schätzungen basierend auf Marktforschung. Endpreise können abweichen."
      }
    }
  }
};
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });
export default i18n;