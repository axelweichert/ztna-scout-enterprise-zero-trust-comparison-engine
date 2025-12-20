import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import appConfig from '../data/app_config.json';
const resources = {
  en: {
    translation: {
      common: {
        data_freshness: appConfig.data_freshness.en,
        currency_symbol: "��"
      },
      layout: {
        header: {
          tooltips: {
            vonBusch: "Developed by von Busch Digital",
            cloudflare: "Powered by Cloudflare Infrastructure",
            ubiquiti: "Security Audit Framework"
          }
        },
        footer: {
          imprint: "Imprint",
          privacy: "Privacy Policy",
          credit: "Engineered with precision for"
        }
      },
      home: {
        hero: {
          badge: "B2B Analysis Engine",
          title1: "Enterprise Security",
          title2: "Comparison Redefined",
          description: "Stop guessing. Compare 13+ ZTNA providers with deterministic TCO projections and BSI compliance scoring.",
          cta_primary: "Start Free Analysis",
          cta_secondary: "Explore Live Sample"
        },
        trust: {
          bsi: "BSI Qualified",
          gdpr: "GDPR Enforced",
          pdf: "PDF Export",
          sase: "Global SASE"
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
          a1: "Our research team verifies pricing and feature matrixes quarterly. {{freshness}}",
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
        labels: {
          companyName: "Entity Name",
          contactPerson: "Liaison Name",
          phone: "Phone Number",
          workEmail: "Corporate Email",
          seats: "Deployment Scale",
          vpnStatus: "Legacy State",
          timing: "Migration Timeline",
          budgetRange: "Project Budget"
        },
        buttons: { continue: "Proceed", back: "Return", submit: "Verify & Generate", generating: "Processing Analysis..." },
        options: {
          vpn_active: "Active Legacy VPN",
          vpn_replacing: "Ongoing Migration",
          vpn_none: "SDP / Cloud Native",
          timing_immediate: "Immediate",
          timing_3m: "Within 3 Months",
          timing_6m: "Next 6 Months",
          timing_planning: "Strategic Planning",
          budget_low: "< €10k / year",
          budget_med: "€10k - €50k / year",
          budget_high: "€50k - €100k / year",
          budget_enterprise: "€100k+ / year"
        },
        legal: {
          disclaimer: "Your data is used exclusively for the generation of this analysis and professional follow-up by certified security architects at von Busch Digital (security@vonbusch.digital). No data is shared with third parties. You can object to contact at any time using the link in our verification emails."
        },
        submitted: {
          title: "Verification Sent",
          desc: "To ensure data integrity, please check your corporate inbox and click the verification link to unlock your report."
        }
      },
      results: {
        title: "Comparison Result",
        subtitle: "Enterprise Analysis for {{seats}} Users",
        export_pdf: "Download Report",
        tco_title: "12-Month Financial Projection",
        bsi_qualified: "BSI Qualified Provider",
        disclaimer: "Pricing estimates based on market list values. This report does not constitute a binding offer.",
        badges: {
          top_match: "Top Match",
          best_fit: "Best Fit"
        },
        matrix: {
          title: "Capability Matrix",
          capability: "Capability",
          show_all: "Show All Rows",
          diff_only: "Highlight Differences",
          best_fit: "Best Fit",
          deep_dive: "Analysis Deep-Dive"
        }
      },
      optOut: {
        title: "Objection to Contact",
        success: "Your preference has been updated. No further professional follow-up will occur for this inquiry.",
        error: "Invalid or expired link. Please contact support if you wish to update your preferences.",
        back: "Return to Site"
      },
      verify: {
        loading: "Verifying your request...",
        success: "Identity Verified!",
        success_desc: "Your enterprise analysis report (ID: {{id}}) is ready. Redirecting you now...",
        error: "Verification Failed",
        error_desc: "The link may have expired or is invalid. Please start a new comparison."
      }
    }
  },
  de: {
    translation: {
      common: {
        data_freshness: appConfig.data_freshness.de,
        currency_symbol: "€"
      },
      layout: {
        header: {
          tooltips: {
            vonBusch: "Entwickelt von von Busch Digital",
            cloudflare: "Powered by Cloudflare Infrastructure",
            ubiquiti: "Security Audit Framework"
          }
        },
        footer: {
          imprint: "Impressum",
          privacy: "Datenschutz",
          credit: "Entwickelt mit Präzision für"
        }
      },
      home: {
        hero: {
          badge: "B2B Analyse Engine",
          title1: "Enterprise Security",
          title2: "Vergleich neu gedacht",
          description: "Schluss mit Schätzungen. Vergleichen Sie 13+ ZTNA-Anbieter mit deterministischen TCO-Projektionen.",
          cta_primary: "Analyse starten",
          cta_secondary: "Live-Beispiel ansehen"
        },
        trust: {
          bsi: "BSI-qualifiziert",
          gdpr: "DSGVO-konform",
          pdf: "PDF-Export",
          sase: "Global SASE"
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
          a1: "Unser Research-Team prüft Preise und Features quartalsweise. {{freshness}}",
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
        labels: {
          companyName: "Firmenname",
          contactPerson: "Ansprechpartner",
          phone: "Telefonnummer",
          workEmail: "Gesch��ftliche E-Mail",
          seats: "Anzahl Benutzer",
          vpnStatus: "VPN Status",
          timing: "Zeitrahmen Migration",
          budgetRange: "Geplantes Budget"
        },
        buttons: { continue: "Weiter", back: "Zurück", submit: "Bestätigen & Generieren", generating: "Analysiere..." },
        options: {
          vpn_active: "Aktives Legacy VPN",
          vpn_replacing: "Migration läuft",
          vpn_none: "SDP / Cloud Native",
          timing_immediate: "Sofort",
          timing_3m: "Innerhalb 3 Monate",
          timing_6m: "In 6 Monaten",
          timing_planning: "Strategische Planung",
          budget_low: "< €10k / Jahr",
          budget_med: "€10k - €50k / Jahr",
          budget_high: "€50k - €100k / Jahr",
          budget_enterprise: "€100k+ / Jahr"
        },
        legal: {
          disclaimer: "Ihre Daten werden ausschließlich zur Erstellung dieser Analyse und für eine professionelle Nachbetreuung durch zertifizierte Security-Architekten von von Busch Digital (security@vonbusch.digital) verwendet. Es erfolgt keine Weitergabe an Dritte. Sie können der Kontaktaufnahme jederzeit über den Link in unseren Bestätigungs-E-Mails widersprechen."
        },
        submitted: {
          title: "E-Mail Bestätigung",
          desc: "Bitte prüfen Sie Ihr Postfach und klicken Sie auf den Bestätigungslink, um Ihren Bericht freizuschalten."
        }
      },
      results: {
        title: "Analyse-Ergebnis",
        subtitle: "Enterprise-Vergleich für {{seats}} Benutzer",
        export_pdf: "Bericht herunterladen",
        tco_title: "12-Monate TCO Projektion",
        bsi_qualified: "BSI-qualifizierter Anbieter",
        disclaimer: "Preisangaben basieren auf Markt-Listenpreisen. Kein verbindliches Angebot.",
        badges: {
          top_match: "Top Match",
          best_fit: "Beste Wahl"
        },
        matrix: {
          title: "Fähigkeiten-Matrix",
          capability: "Funktion",
          show_all: "Alle Zeilen",
          diff_only: "Unterschiede hervorheben",
          best_fit: "Beste Wahl",
          deep_dive: "Analyse-Details"
        }
      },
      optOut: {
        title: "Widerspruch zur Kontaktaufnahme",
        success: "Ihre Präferenz wurde aktualisiert. Es erfolgt keine weitere professionelle Kontaktaufnahme zu dieser Anfrage.",
        error: "Ungültiger oder abgelaufener Link. Bitte kontaktieren Sie den Support.",
        back: "Zurück zur Website"
      },
      verify: {
        loading: "Verifiziere Anfrage...",
        success: "Identität bestätigt!",
        success_desc: "Ihr Analyse-Bericht (ID: {{id}}) ist bereit. Weiterleitung erfolgt...",
        error: "Verifizierung fehlgeschlagen",
        error_desc: "Link abgelaufen oder ungültig. Bitte starten Sie erneut."
      }
    }
  },
  fr: {
    translation: {
      common: {
        data_freshness: appConfig.data_freshness.fr,
        currency_symbol: "€"
      },
      layout: {
        header: {
          tooltips: {
            vonBusch: "Développé par von Busch Digital",
            cloudflare: "Propulsé par Cloudflare",
            ubiquiti: "Cadre d'audit de sécurit��"
          }
        },
        footer: {
          imprint: "Mentions Légales",
          privacy: "Confidentialité",
          credit: "Conçu avec précision pour"
        }
      },
      home: {
        hero: {
          badge: "Moteur d'analyse B2B",
          title1: "Sécurité d'entreprise",
          title2: "La comparaison redéfinie",
          description: "Comparez plus de 13 fournisseurs ZTNA avec des projections TCO déterministes et des scores de conformité BSI.",
          cta_primary: "Lancer l'analyse",
          cta_secondary: "Voir un exemple"
        },
        trust: {
          bsi: "Qualifié BSI",
          gdpr: "Conforme RGPD",
          pdf: "Export PDF",
          sase: "SASE Global"
        },
        steps: {
          title: "La méthodologie ZTNA Scout",
          subtitle: "Comment nous fournissons des analyses de précision.",
          step1: { title: "Définir le périmètre", desc: "Identifier le nombre d'utilisateurs et l'architecture existante." },
          step2: { title: "Balayage du marché", desc: "Comparaison avec les prix catalogue et les matrices de fonctionnalités." },
          step3: { title: "Rapport stratégique", desc: "Recevez un export PDF professionnel avec projections TCO." }
        },
        faq: {
          title: "Perspectives stratégiques",
          q1: "Les données sont-elles à jour ?",
          a1: "Notre équipe vérifie les prix chaque trimestre. {{freshness}}",
          q2: "Pourquoi Cloudflare ?",
          a2: "Cloudflare propose actuellement la plateforme ZTNA la plus robuste et qualifiée BSI.",
          q4: "Mes données sont-elles en sécurité ?",
          a4: "Nous sommes strictement conformes au RGPD. Données stockées sur infrastructure Cloudflare chiffrée."
        }
      },
      form: {
        steps: { company: "Entité", requirements: "Architecture", legal: "Conformité" },
        labels: {
          companyName: "Nom de l'entreprise",
          contactPerson: "Nom du contact",
          phone: "Numéro de téléphone",
          workEmail: "Email professionnel",
          seats: "Nombre d'utilisateurs",
          vpnStatus: "État du VPN",
          timing: "Délai de migration",
          budgetRange: "Budget du projet"
        },
        buttons: { continue: "Continuer", back: "Retour", submit: "Vérifier & Générer", generating: "Analyse en cours..." },
        options: {
          vpn_active: "VPN hérité actif",
          vpn_replacing: "Migration en cours",
          vpn_none: "Cloud Native",
          timing_immediate: "Immédiat",
          timing_3m: "Sous 3 mois",
          timing_6m: "Sous 6 mois",
          timing_planning: "Planification",
          budget_low: "< €10k / an",
          budget_med: "€10k - €50k / an",
          budget_high: "€50k - €100k / an",
          budget_enterprise: "€100k+ / an"
        },
        legal: {
          disclaimer: "Vos données sont utilisées exclusivement pour l'analyse et le suivi professionnel par des architectes certifiés de von Busch Digital (security@vonbusch.digital). Aucune donnée n'est partagée. Vous pouvez vous opposer au contact via le lien dans nos emails."
        },
        submitted: {
          title: "Vérification envoyée",
          desc: "Veuillez vérifier votre boîte de réception et cliquer sur le lien de vérification pour débloquer votre rapport."
        }
      },
      results: {
        title: "Résultat de l'analyse",
        subtitle: "Comparaison pour {{seats}} utilisateurs",
        export_pdf: "Télécharger le rapport",
        tco_title: "Projection TCO sur 12 mois",
        bsi_qualified: "Fournisseur qualifié BSI",
        disclaimer: "Estimations basées sur les prix catalogue. Pas d'offre contractuelle.",
        badges: {
          top_match: "Meilleure correspondance",
          best_fit: "Meilleur choix"
        },
        matrix: {
          title: "Matrice des capacités",
          capability: "Fonctionnalité",
          show_all: "Toutes les lignes",
          diff_only: "Afficher les différences",
          best_fit: "Meilleur choix",
          deep_dive: "Détails de l'analyse"
        }
      },
      optOut: {
        title: "Opposition au contact",
        success: "Votre préférence a été mise à jour. Aucun autre suivi ne sera effectué.",
        error: "Lien invalide ou expiré.",
        back: "Retour au site"
      },
      verify: {
        loading: "Vérification...",
        success: "Identité vérifiée!",
        success_desc: "Votre rapport (ID: {{id}}) est prêt. Redirection...",
        error: "Échec de la vérification",
        error_desc: "Lien expiré ou invalide."
      }
    }
  }
};
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'de',
    interpolation: { escapeValue: false }
  });
export default i18n;