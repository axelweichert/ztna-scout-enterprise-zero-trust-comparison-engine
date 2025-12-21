import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import appConfig from '../data/app_config.json';
const resources = {
  en: {
    translation: {
      common: {
        data_freshness: appConfig.data_freshness.en,
        currency_symbol: "€"
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
          service_line: "A service of von Busch GmbH",
          address: "von Busch GmbH – Alfred-Bozi-Straße 12 – 33602 Bielefeld"
        }
      },
      home: {
        hero: {
          badge: "B2B Analysis Engine",
          title1: "Enterprise Security",
          title2: "Comparison Redefined",
          description: "Stop guessing. Compare 13+ ZTNA providers with deterministic TCO projections and BSI compliance scoring.",
          cta_primary: "Start Free Analysis",
          cta_secondary: "Explore Live Sample",
          sase_map_cta: "SASE Cloud Map"
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
          contactName: "Liaison Name",
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
          disclaimer: "Your data is used exclusively for the generation of this analysis and professional follow-up by certified security architects at von Busch Digital (security@vonbusch.digital). No data is shared with third parties. You can object at any time using the link in our emails."
        },
        submitted: {
          title: "Verification Sent",
          desc: "To ensure data integrity, please check your corporate inbox and click the verification link to unlock your report."
        }
      },
      results: {
        title: "Comparison Result",
        sample_title: "Sample Security Analysis",
        live_sample_mode: "LIVE SAMPLE MODE: Using demonstration data parameters.",
        subtitle: "Enterprise Analysis for {{seats}} Users",
        export_pdf: "Download Report",
        tco_title: "12-Month Financial Projection",
        bsi_qualified: "BSI Qualified Provider",
        disclaimer: "Pricing estimates based on market list values. This report does not constitute a binding offer.",
        methodology_title: "Methodology & Transparency",
        methodology_desc: "Scores are calculated using a weighted average of feature completeness (40%), price competitiveness (40%), and regulatory compliance (20%).",
        expert_take_label: "Expert Take",
        expert_take_0: "Exceptional balance of cost and compliance. Ideal for highly regulated environments.",
        expert_take_1: "Premium feature set with advanced threat protection. Recommended for high-risk profiles.",
        expert_take_2: "Scalable cloud architecture with rapid implementation and intuitive management.",
        meta: { rid: "Report-ID", generated: "Generated on", verified: "Verified Report" },
        print: {
          title: "ZTNA Scout Analysis Report",
          tagline: "Automated market assessment – generated by ZTNA Scout",
          summary: "Executive Summary",
          seats: "User Seats",
          top_recommendation: "Top Recommendation",
          transparency_title: "Transparency & Sources",
          transparency_desc: "Calculations based on public market list rates (EUR) as of the verification date."
        },
        badges: { top_match: "Top Match", best_fit: "Best Fit", top_recommendations: "Top Recommendations" },
        matrix: {
          title: "Capability Matrix",
          capability: "Capability",
          show_all: "Show All Rows",
          diff_only: "Highlight Differences",
          best_fit: "Best Fit",
          deep_dive: "Analysis Deep-Dive",
          feature_score: "Feature Richness (40%)",
          price_score: "Price Positioning (40%)",
          compliance_score: "Regulatory (20%)",
          total_score: "Scout Score",
          analytical_breakdown: "Analytical Breakdown",
          market_rank: "Market Rank",
          rank_1: "1st Place",
          rank_2: "2nd Place",
          rank_3: "3rd Place",
          scout_total: "Scout Total",
          close_deep_dive: "Close Deep-Dive",
          expert_take_desc: {
            features: "ZTNA, SWG, CASB, DLP and isolation capabilities.",
            price: "Competitiveness relative to market averages.",
            compliance: "BSI qualifications and security certifications."
          }
        }
      },
      admin: {
        terminal_title: "Sentinel Gate",
        terminal_desc: "Administrative Access Required",
        terminal_key: "Secret Authority Key",
        terminal_unlock: "Unlock Terminal",
        dashboard_title: "Executive Dashboard",
        dashboard_desc: "Real-time lead lifecycle monitoring",
        sync_data: "Sync Data",
        export_csv: "Export CSV",
        export_success: "CSV export triggered",
        stats: { total: "Total Inquiries", verified: "Verified Leads", conversion: "Conversion", avg_seats: "Avg Seats", lifetime: "LIFETIME", common_vpn: "Primary Legacy VPN" },
        tabs: { pipeline: "Pipeline", pricing: "Pricing Overrides", settings: "System Rules" },
        table: { timestamp: "Timestamp", org: "Organization", stakeholder: "Stakeholder", infra: "Infrastructure", verification: "Verification", management: "Management", no_leads: "No leads found.", purge_confirm: "Purge lead data?", opt_out: "Opt-Out" },
        pricing: { market_rate: "Market Rate / User / Month", quote_required: "Quote Required", quote_desc: "Forces range display", updated_success: "Pricing updated" }
      },
      optOut: {
        title: "Objection to Contact",
        success: "Your preference has been updated. No further follow-up will occur.",
        error: "Invalid or expired link.",
        back: "Return to Site"
      },
      verify: {
        loading: "Verifying request...",
        success: "Identity Verified!",
        success_desc: "Your analysis report (ID: {{id}}) is ready.",
        error: "Verification Failed",
        error_desc: "The link may have expired. Please start a new comparison."
      },
      legal: {
        imprint: { title: "Imprint", provider_title: "Service Provider", provider_details: "von Busch GmbH\nAlfred-Bozi-Straße 12\n33602 Bielefeld\nGermany", contact_title: "Contact", contact_details: "Email: security@vonbusch.digital\nWeb: www.vonbusch.digital", register_title: "Commercial Register", register_details: "Amtsgericht Bielefeld\nHRB 45678" },
        privacy: { title: "Privacy Policy", section1_title: "1. Data Collection", section1_desc: "We collect data necessary for the ZTNA analysis.", section2_title: "2. Legal Basis", section2_desc: "Processing is based on your explicit consent (Art. 6 GDPR).", section3_title: "3. Retention", section3_desc: "Confirmed leads are stored for 24 months.", section4_title: "4. Your Rights", section4_desc: "You have the right to delete your data at any time." }
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
        header: { tooltips: { vonBusch: "Entwickelt von von Busch Digital", cloudflare: "Powered by Cloudflare Infrastructure", ubiquiti: "Security Audit Framework" } },
        footer: { imprint: "Impressum", privacy: "Datenschutz", service_line: "Ein Service der von Busch GmbH", address: "von Busch GmbH – Alfred-Bozi-Straße 12 – 33602 Bielefeld" }
      },
      home: {
        hero: {
          badge: "B2B Analyse Engine",
          title1: "Enterprise Security",
          title2: "Vergleich neu gedacht",
          description: "Schluss mit Schätzungen. Vergleichen Sie 13+ ZTNA-Anbieter mit deterministischen TCO-Projektionen und BSI-Konformitätsbewertungen.",
          cta_primary: "Analyse starten",
          cta_secondary: "Live-Beispiel ansehen",
          sase_map_cta: "SASE Cloud Map"
        },
        trust: { bsi: "BSI-qualifiziert", gdpr: "DSGVO-konform", pdf: "PDF-Export", sase: "Global SASE" },
        steps: {
          title: "Die ZTNA Scout Methodik",
          subtitle: "So erstellen wir präzise Analysen f��r Ihren Security Stack.",
          step1: { title: "Anforderungen", desc: "Definition von Benutzeranzahl, Legacy-Architektur und Security-Needs." },
          step2: { title: "Markt-Abgleich", desc: "Unsere Engine gleicht Ihre Daten mit aktuellen Listenpreisen ab." },
          step3: { title: "Strategie-Bericht", desc: "Erhalt eines professionellen PDF-Exports mit TCO und Scout Score." }
        },
        faq: {
          title: "Strategische Einblicke",
          q1: "Sind die Daten aktuell?",
          a1: "Unser Research-Team prüft Preise quartalsweise. {{freshness}}",
          q2: "Warum Cloudflare?",
          a2: "Cloudflare bietet derzeit die am stärksten BSI-qualifizierte ZTNA-Plattform am Markt.",
          q3: "Sind die Preise fix?",
          a3: "Dies sind Markt-Listenpreise. Rabatte sind oft möglich.",
          q4: "Datenschutz?",
          a4: "Wir sind DSGVO-konform. Daten werden verschlüsselt gespeichert."
        }
      },
      form: {
        steps: { company: "Unternehmen", requirements: "Infrastruktur", legal: "Compliance" },
        labels: { companyName: "Firmenname", contactName: "Ansprechpartner", phone: "Telefonnummer", workEmail: "Geschäftliche E-Mail", seats: "Anzahl Benutzer", vpnStatus: "VPN Status", timing: "Zeitrahmen Migration", budgetRange: "Geplantes Budget" },
        buttons: { continue: "Weiter", back: "Zurück", submit: "Bestätigen & Generieren", generating: "Analysiere..." },
        options: { vpn_active: "Aktives Legacy VPN", vpn_replacing: "Migration läuft", vpn_none: "SDP / Cloud Native", timing_immediate: "Sofort", timing_3m: "Innerhalb 3 Monate", timing_6m: "In 6 Monaten", timing_planning: "Strategische Planung", budget_low: "< 10.000 € / Jahr", budget_med: "10.000 € - 50.000 € / Jahr", budget_high: "50.000 € - 100.000 € / Jahr", budget_enterprise: "100.000 €+ / Jahr" },
        legal: { disclaimer: "Ihre Daten werden zur Erstellung dieser Analyse und für eine professionelle Nachbetreuung durch zertifizierte Security-Architekten von von Busch Digital verwendet. Keine Weitergabe an Dritte. Widerspruch jederzeit möglich." },
        submitted: { title: "E-Mail Bestätigung", desc: "Bitte prüfen Sie Ihr Postfach und klicken Sie auf den Bestätigungslink, um Ihren Bericht freizuschalten." }
      },
      results: {
        title: "Analyse-Ergebnis",
        sample_title: "Beispiel-Sicherheitsanalyse",
        live_sample_mode: "LIVE-DEMO-MODUS: Verwendung von Demonstrationsdaten.",
        subtitle: "Enterprise-Vergleich für {{seats}} Benutzer",
        export_pdf: "Bericht herunterladen",
        tco_title: "12-Monate TCO Projektion",
        bsi_qualified: "BSI-qualifizierter Anbieter",
        disclaimer: "Preisangaben basieren auf Listenpreisen. Kein verbindliches Angebot.",
        methodology_title: "Methodik & Transparenz",
        methodology_desc: "Die Scores berechnen sich aus Funktionsumfang (40%), Preisgestaltung (40%) und Compliance (20%).",
        expert_take_label: "Experten-Einschätzung",
        expert_take_0: "Hervorragende Balance zwischen Kosten und Compliance. Ideal für hochregulierte Umgebungen.",
        expert_take_1: "Premium-Funktionsumfang mit fortgeschrittenem Bedrohungsschutz. Empfohlen für risikobehaftete Profile.",
        expert_take_2: "Skalierbare Cloud-Architektur mit schnellen Implementierungswegen und intuitiver Verwaltung.",
        meta: { rid: "Bericht-ID", generated: "Erstellt am", verified: "Verifizierter Bericht" },
        print: { title: "ZTNA Scout Analysebericht", tagline: "Automatisierte Marktanalyse – erstellt durch ZTNA Scout", summary: "Management Summary", seats: "Benutzerlizenzen", top_recommendation: "Top Empfehlung", transparency_title: "Transparenz & Quellen", transparency_desc: "Die Berechnungen basieren auf öffentlichen Marktlistenpreisen (EUR)." },
        badges: { top_match: "Top Match", best_fit: "Beste Wahl", top_recommendations: "Top Empfehlungen" },
        matrix: {
          title: "Fähigkeiten-Matrix", capability: "Funktion", show_all: "Alle Zeilen", diff_only: "Unterschiede hervorheben", best_fit: "Beste Wahl", deep_dive: "Analyse-Details", feature_score: "Funktionsumfang (40%)", price_score: "Preis-Leistung (40%)", compliance_score: "Compliance (20%)", total_score: "Scout Score", analytical_breakdown: "Analytische Aufschlüsselung", market_rank: "Marktrang", rank_1: "1. Platz", rank_2: "2. Platz", rank_3: "3. Platz", scout_total: "Scout Gesamt", close_deep_dive: "Analyse schließen",
          expert_take_desc: { features: "ZTNA, SWG, CASB, DLP und Isolationsfunktionen.", price: "Wettbewerbsfähigkeit im Vergleich zum Marktdurchschnitt.", compliance: "BSI-Qualifizierungen und Sicherheitszertifikate." }
        }
      },
      admin: {
        terminal_title: "Sentinel Tor", terminal_desc: "Administrativer Zugang erforderlich", terminal_key: "Geheimer Autorisierungsschlüssel", terminal_unlock: "Terminal entsperren", dashboard_title: "Vorstands-Dashboard", dashboard_desc: "Echtzeit-Überwachung", sync_data: "Daten synchronisieren", export_csv: "CSV exportieren", export_success: "CSV-Export erfolgreich",
        stats: { total: "Gesamte Anfragen", verified: "Verifizierte Leads", conversion: "Konversion", avg_seats: "Durchschn. Plätze", lifetime: "GESAMTZEIT", common_vpn: "Häufigstes Legacy VPN" },
        tabs: { pipeline: "Pipeline", pricing: "Preis-Anpassungen", settings: "Systemregeln" },
        table: { timestamp: "Zeitstempel", org: "Organisation", stakeholder: "Ansprechpartner", infra: "Infrastruktur", verification: "Verifizierung", management: "Verwaltung", no_leads: "Keine Leads gefunden.", purge_confirm: "Lead-Daten löschen?", opt_out: "Widerspruch" },
        pricing: { market_rate: "Marktrate / Benutzer / Monat", quote_required: "Angebot erforderlich", quote_desc: "Erzwingt Bereichsanzeige", updated_success: "Preise aktualisiert" }
      },
      optOut: { title: "Widerspruch", success: "Ihre Präferenz wurde aktualisiert. Keine weitere Kontaktaufnahme.", error: "Ungültiger Link.", back: "Zurück" },
      verify: { loading: "Verifiziere Anfrage...", success: "Identität bestätigt!", success_desc: "Ihr Analyse-Bericht (ID: {{id}}) ist bereit.", error: "Verifizierung fehlgeschlagen", error_desc: "Link abgelaufen oder ungültig." },
      legal: {
        imprint: { title: "Impressum", provider_title: "Dienstanbieter", provider_details: "von Busch GmbH\nAlfred-Bozi-Straße 12\n33602 Bielefeld\nDeutschland", contact_title: "Kontakt", contact_details: "E-Mail: security@vonbusch.digital\nWeb: www.vonbusch.digital", register_title: "Handelsregister", register_details: "Amtsgericht Bielefeld\nHRB 45678" },
        privacy: { title: "Datenschutzerklärung", section1_title: "1. Datenerhebung", section1_desc: "Wir erheben Daten für die ZTNA-Analyse.", section2_title: "2. Rechtsgrundlage", section2_desc: "Die Verarbeitung basiert auf Ihrer Einwilligung (Art. 6 DSGVO).", section3_title: "3. Aufbewahrung", section3_desc: "Leads werden für 24 Monate gespeichert.", section4_title: "4. Ihre Rechte", section4_desc: "Recht auf Auskunft und Löschung." }
      }
    }
  },
  fr: {
    translation: {
      common: { data_freshness: appConfig.data_freshness.fr, currency_symbol: "€" },
      layout: {
        header: { tooltips: { vonBusch: "Développé par von Busch Digital", cloudflare: "Propulsé par Cloudflare", ubiquiti: "Audit de sécurité" } },
        footer: { imprint: "Mentions Légales", privacy: "Confidentialité", service_line: "Un service de von Busch GmbH", address: "von Busch GmbH – Alfred-Bozi-Straße 12 – 33602 Bielefeld" }
      },
      home: {
        hero: { badge: "Moteur d'analyse B2B", title1: "Sécurité d'entreprise", title2: "La comparaison redéfinie", description: "Comparez plus de 13 fournisseurs ZTNA avec des projections TCO et des scores BSI.", cta_primary: "Lancer l'analyse", cta_secondary: "Voir un exemple", sase_map_cta: "SASE Cloud Map" },
        trust: { bsi: "Qualifié BSI", gdpr: "Conforme RGPD", pdf: "Export PDF", sase: "SASE Global" },
        steps: { title: "La méthodologie ZTNA Scout", subtitle: "Comment nous fournissons des analyses de précision.", step1: { title: "Périmètre", desc: "Modifier le nombre d'utilisateurs et l'architecture." }, step2: { title: "Balayage", desc: "Comparaison avec les prix catalogue et les fonctionnalités." }, step3: { title: "Rapport", desc: "Recevez un export PDF professionnel avec projections TCO." } },
        faq: { title: "Perspectives stratégiques", q1: "Données à jour ?", a1: "Notre équipe vérifie les prix chaque trimestre. {{freshness}}", q2: "Pourquoi Cloudflare ?", a2: "Cloudflare propose la plateforme ZTNA la plus robuste et qualifiée BSI.", q3: "Prix définitifs ?", a3: "Estimations basées sur les prix catalogue. Remises possibles.", q4: "Données protégées ?", a4: "Nous sommes conformes au RGPD. Les données sont chiffrées." }
      },
      form: {
        steps: { company: "Entité", requirements: "Architecture", legal: "Conformité" },
        labels: { companyName: "Nom de l'entreprise", contactName: "Nom du contact", phone: "Téléphone", workEmail: "Email pro", seats: "Utilisateurs", vpnStatus: "État du VPN", timing: "Délai migration", budgetRange: "Budget" },
        buttons: { continue: "Continuer", back: "Retour", submit: "Vérifier & Générer", generating: "Analyse en cours..." },
        options: { vpn_active: "VPN hérité actif", vpn_replacing: "Migration en cours", vpn_none: "Cloud Native", timing_immediate: "Immédiat", timing_3m: "Sous 3 mois", timing_6m: "Sous 6 mois", timing_planning: "Planification", budget_low: "< 10.000 € / an", budget_med: "10.000 € - 50.000 € / an", budget_high: "50.000 € - 100.000 € / an", budget_enterprise: "100.000 €+ / an" },
        legal: { disclaimer: "Vos données sont utilisées pour l'analyse et le suivi professionnel par von Busch Digital. Aucune donnée n'est partagée. Opposition possible." },
        submitted: { title: "Vérification envoyée", desc: "Veuillez cliquer sur le lien de vérification dans votre boîte mail." }
      },
      results: {
        title: "Résultat de l'analyse", sample_title: "Analyse de sécurité type", live_sample_mode: "MODE DÉMO LIVE.", subtitle: "Comparaison pour {{seats}} utilisateurs", export_pdf: "Télécharger le rapport", tco_title: "Projection TCO sur 12 mois", bsi_qualified: "Fournisseur qualifié BSI", disclaimer: "Estimations basées sur les prix catalogue.", methodology_title: "Méthodologie & Transparence", methodology_desc: "Scores basés sur les fonctionnalités (40%), le prix (40%) et la conformité (20%).", expert_take_label: "L'avis de l'expert", expert_take_0: "Équilibre exceptionnel entre coût et conformité.", expert_take_1: "Fonctionnalités premium avec protection avancée.", expert_take_2: "Architecture cloud évolutive et gestion intuitive.",
        meta: { rid: "ID-Rapport", generated: "Généré le", verified: "Rapport vérifié" },
        print: { title: "Rapport d'analyse ZTNA Scout", tagline: "Analyse de marché automatisée – générée par ZTNA Scout", summary: "Résumé Exécutif", seats: "Utilisateurs", top_recommendation: "Meilleure recommandation", transparency_title: "Transparence & Sources", transparency_desc: "Calculs basés sur les prix publics (EUR)." },
        badges: { top_match: "Meilleure correspondance", best_fit: "Meilleur choix", top_recommendations: "Top Recommandations" },
        matrix: {
          title: "Matrice des capacités", capability: "Fonctionnalité", show_all: "Toutes les lignes", diff_only: "Différences", best_fit: "Meilleur choix", deep_dive: "Détails", feature_score: "Richesse (40%)", price_score: "Prix (40%)", compliance_score: "Conformité (20%)", total_score: "Score Scout", analytical_breakdown: "Analyse détaillée", market_rank: "Rang", rank_1: "1re place", rank_2: "2e place", rank_3: "3e place", scout_total: "Total Scout", close_deep_dive: "Fermer",
          expert_take_desc: { features: "Capacités ZTNA, SWG, CASB, DLP.", price: "Compétitivité.", compliance: "Qualifications BSI." }
        }
      },
      admin: {
        terminal_title: "Porte Sentinelle", terminal_desc: "Accès requis", terminal_key: "Clé secrète", terminal_unlock: "Déverrouiller", dashboard_title: "Dashboard", dashboard_desc: "Suivi en temps réel", sync_data: "Synchroniser", export_csv: "Exporter CSV", export_success: "Export CSV lancé",
        stats: { total: "Demandes", verified: "Prospects vérifiés", conversion: "Conversion", avg_seats: "Sièges moyens", lifetime: "À VIE", common_vpn: "VPN Legacy Principal" },
        tabs: { pipeline: "Pipeline", pricing: "Prix", settings: "Système" },
        table: { timestamp: "Horodatage", org: "Organisation", stakeholder: "Contact", infra: "Infra", verification: "Vérification", management: "Gestion", no_leads: "Aucun prospect.", purge_confirm: "Supprimer ?", opt_out: "Opposition" },
        pricing: { market_rate: "Prix / mois", quote_required: "Devis requis", quote_desc: "Force l'affichage", updated_success: "Prix mis à jour" }
      },
      optOut: { title: "Opposition", success: "Préférence mise à jour. Aucun suivi.", error: "Lien invalide.", back: "Retour" },
      verify: { loading: "Vérification...", success: "Identité vérifiée!", success_desc: "Votre rapport (ID: {{id}}) est prêt.", error: "Échec", error_desc: "Lien expiré ou invalide." },
      legal: {
        imprint: { title: "Mentions Légales", provider_title: "Prestataire", provider_details: "von Busch GmbH\nAlfred-Bozi-Straße 12\n33602 Bielefeld\nAllemagne", contact_title: "Contact", contact_details: "Email : security@vonbusch.digital\nWeb : www.vonbusch.digital", register_title: "Registre", register_details: "Amtsgericht Bielefeld\nHRB 45678" },
        privacy: { title: "Confidentialité", section1_title: "1. Collecte", section1_desc: "Nous collectons les données pour l'analyse.", section2_title: "2. Base juridique", section2_desc: "Consentement explicite (Art. 6 RGPD).", section3_title: "3. Conservation", section3_desc: "Prospects conservés 24 m.", section4_title: "4. Droits", section4_desc: "Accès et suppression." }
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