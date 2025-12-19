import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
const resources = {
  en: {
    translation: {
      hero: {
        title: "ZTNA Scout",
        subtitle: "Navigate the Zero Trust landscape with data-driven vendor comparisons."
      },
      form: {
        steps: {
          company: "Organization",
          requirements: "Infrastructure",
          consent: "Agreement"
        },
        labels: {
          companyName: "Company Name",
          contactPerson: "Primary Contact",
          workEmail: "Corporate Email Address",
          seats: "Deployment Scale (Seats)",
          vpnStatus: "Existing Network Architecture",
          consent: "I hereby request the ZTNA analysis and consent to professional follow-up from a certified security architect."
        },
        buttons: {
          continue: "Next Step",
          back: "Previous",
          submit: "Generate Enterprise Report",
          generating: "Calculating TCO..."
        },
        options: {
          vpn_active: "Legacy VPN Infrastructure",
          vpn_replacing: "Active Migration Phase",
          vpn_none: "Cloud Native / SDP Architecture"
        }
      },
      results: {
        title: "Enterprise Comparison Matrix",
        subtitle: "Analysis generated for {{seats}} users.",
        tco_title: "12-Month TCO Projection",
        score: "Scout Score",
        bsi_qualified: "BSI CERTIFIED",
        export_pdf: "Export Consultant Report",
        disclaimer: "Figures are based on standard market list prices. Custom enterprise discounts are not reflected."
      }
    }
  },
  de: {
    translation: {
      hero: {
        title: "ZTNA Scout",
        subtitle: "Die datengestützte Entscheidungshilfe für Ihre Zero Trust Strategie."
      },
      form: {
        steps: {
          company: "Unternehmen",
          requirements: "Infrastruktur",
          consent: "Zustimmung"
        },
        labels: {
          companyName: "Unternehmensname",
          contactPerson: "Ansprechpartner",
          workEmail: "Geschäftliche E-Mail-Adresse",
          seats: "Anzahl der Lizenzen (Seats)",
          vpnStatus: "Aktuelle Netzwerkarchitektur",
          consent: "Ich fordere den ZTNA-Vergleich an und erkläre mich mit einer Kontaktaufnahme durch einen Sicherheitsexperten einverstanden."
        },
        buttons: {
          continue: "Weiter",
          back: "Zurück",
          submit: "Bericht Erstellen",
          generating: "Berechne TCO..."
        },
        options: {
          vpn_active: "Klassische VPN-Struktur",
          vpn_replacing: "In Umstellung auf ZTNA",
          vpn_none: "Cloud Native / Ohne VPN"
        }
      },
      results: {
        title: "Enterprise Vergleichsmatrix",
        subtitle: "Analyse für {{seats}} Benutzer.",
        tco_title: "TCO-Projektion (12 Monate)",
        score: "Scout Score",
        bsi_qualified: "BSI QUALIFIZIERT",
        export_pdf: "Bericht Exportieren (PDF)",
        disclaimer: "Die Preise basieren auf Markt-Listenpreisen. Individuelle Rahmenverträge sind nicht berücksichtigt."
      }
    }
  },
  fr: {
    translation: {
      hero: {
        title: "ZTNA Scout",
        subtitle: "Comparez les solutions Zero Trust avec une approche basée sur les données."
      },
      form: {
        steps: {
          company: "Entreprise",
          requirements: "Infrastructure",
          consent: "Consentement"
        },
        labels: {
          companyName: "Nom de l'entreprise",
          contactPerson: "Contact Principal",
          workEmail: "Adresse E-mail Professionnelle",
          seats: "��chelle de déploiement (Sièges)",
          vpnStatus: "Architecture Réseau Actuelle",
          consent: "Je demande la comparaison ZTNA et j'accepte d'être contacté par un expert en cybersécurité."
        },
        buttons: {
          continue: "Suivant",
          back: "Retour",
          submit: "Générer le Rapport",
          generating: "Calcul du TCO..."
        },
        options: {
          vpn_active: "Infrastructure VPN Classique",
          vpn_replacing: "En phase de migration",
          vpn_none: "Cloud Native / Sans VPN"
        }
      },
      results: {
        title: "Matrice Comparative Enterprise",
        subtitle: "Analyse générée pour {{seats}} utilisateurs.",
        tco_title: "Projection TCO (12 mois)",
        score: "Score Scout",
        bsi_qualified: "QUALIFIÉ BSI",
        export_pdf: "Exporter le Rapport",
        disclaimer: "Les prix sont des estimations basées sur les tarifs du marché. Les remises d'entreprise ne sont pas incluses."
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