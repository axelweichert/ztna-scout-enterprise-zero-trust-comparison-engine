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
          credit: "Built with ♥ at"
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
        expert_take_0: "Exceptional balance of cost and compliance. Ideal for highly regulated enterprise environments.",
        expert_take_1: "Premium feature set with advanced threat protection. Recommended for high-risk digital profiles.",
        expert_take_2: "Scalable cloud architecture with rapid implementation paths and intuitive management.",
        badges: {
          top_match: "Top Match",
          best_fit: "Best Fit",
          top_recommendations: "Top Recommendations"
        },
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
        export_success: "CSV export triggered successfully",
        stats: {
          total: "Total Inquiries",
          verified: "Verified Leads",
          conversion: "Conversion",
          avg_seats: "Average Seats",
          lifetime: "LIFETIME",
          common_vpn: "Primary Legacy VPN"
        },
        tabs: {
          pipeline: "Pipeline",
          pricing: "Pricing Overrides",
          settings: "System Rules"
        },
        table: {
          timestamp: "Timestamp",
          org: "Organization",
          stakeholder: "Stakeholder",
          infra: "Infrastructure",
          verification: "Verification",
          management: "Management",
          no_leads: "No leads matching your current criteria.",
          purge_confirm: "Purge lead data permanently?",
          opt_out: "Opt-Out"
        },
        pricing: {
          market_rate: "Market Rate / User / Month",
          quote_required: "Quote Required",
          quote_desc: "Forces range display",
          updated_success: "Pricing updated successfully"
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
      },
      legal: {
        imprint: {
          title: "Imprint",
          provider_title: "Service Provider",
          provider_details: "von Busch GmbH\nAlfred-Bozi-Straße 12\n33602 Bielefeld\nGermany",
          contact_title: "Contact",
          contact_details: "Email: security@vonbusch.digital\nWeb: www.vonbusch.digital",
          register_title: "Commercial Register",
          register_details: "Amtsgericht Bielefeld\nHRB 45678"
        },
        privacy: {
          title: "Privacy Policy",
          section1_title: "1. Data Collection",
          section1_desc: "We collect data necessary for the ZTNA analysis, including organization name, contact person, and infrastructure metrics.",
          section2_title: "2. Legal Basis",
          section2_desc: "Data processing is based on your explicit consent (Art. 6 para. 1 lit. a GDPR) and our legitimate interest in delivering accurate security comparisons.",
          section3_title: "3. Retention",
          section3_desc: "Confirmed leads are stored for 24 months. Unverified leads are purged automatically after 30 days.",
          section4_title: "4. Your Rights",
          section4_desc: "You have the right to access, rectify, or delete your data at any time. Contact us at security@vonbusch.digital."
        }
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
          credit: "Mit ♥ bei"
        }
      },
      home: {
        hero: {
          badge: "B2B Analyse Engine",
          title1: "Enterprise Security",
          title2: "Vergleich neu gedacht",
          description: "Schluss mit Sch��tzungen. Vergleichen Sie 13+ ZTNA-Anbieter mit deterministischen TCO-Projektionen.",
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
          workEmail: "Geschäftliche E-Mail",
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
        sample_title: "Beispiel-Sicherheitsanalyse",
        live_sample_mode: "LIVE-DEMO-MODUS: Verwendung von Demonstrationsdaten.",
        subtitle: "Enterprise-Vergleich für {{seats}} Benutzer",
        export_pdf: "Bericht herunterladen",
        tco_title: "12-Monate TCO Projektion",
        bsi_qualified: "BSI-qualifizierter Anbieter",
        disclaimer: "Preisangaben basieren auf Markt-Listenpreisen. Kein verbindliches Angebot.",
        methodology_title: "Methodik & Transparenz",
        methodology_desc: "Die Scores berechnen sich aus einem gewichteten Durchschnitt aus Funktionsumfang (40%), Preisgestaltung (40%) und Compliance (20%).",
        expert_take_label: "Experten-Einschätzung",
        expert_take_0: "Hervorragende Balance zwischen Kosten und Compliance. Ideal für hochregulierte Unternehmensumgebungen.",
        expert_take_1: "Premium-Funktionsumfang mit fortgeschrittenem Bedrohungsschutz. Empfohlen für risikobehaftete digitale Profile.",
        expert_take_2: "Skalierbare Cloud-Architektur mit schnellen Implementierungswegen und intuitiver Verwaltung.",
        badges: {
          top_match: "Top Match",
          best_fit: "Beste Wahl",
          top_recommendations: "Top Empfehlungen"
        },
        matrix: {
          title: "Fähigkeiten-Matrix",
          capability: "Funktion",
          show_all: "Alle Zeilen",
          diff_only: "Unterschiede hervorheben",
          best_fit: "Beste Wahl",
          deep_dive: "Analyse-Details",
          feature_score: "Funktionsumfang (40%)",
          price_score: "Preis-Leistung (40%)",
          compliance_score: "Compliance (20%)",
          total_score: "Scout Score",
          analytical_breakdown: "Analytische Aufschlüsselung",
          market_rank: "Marktrang",
          rank_1: "1. Platz",
          rank_2: "2. Platz",
          rank_3: "3. Platz",
          scout_total: "Scout Gesamt",
          close_deep_dive: "Analyse schließen",
          expert_take_desc: {
            features: "ZTNA, SWG, CASB, DLP und Isolationsfunktionen.",
            price: "Wettbewerbsfähigkeit im Vergleich zum Marktdurchschnitt.",
            compliance: "BSI-Qualifizierungen und Sicherheitszertifikate."
          }
        }
      },
      admin: {
        terminal_title: "Sentinel Tor",
        terminal_desc: "Administrativer Zugang erforderlich",
        terminal_key: "Geheimer Autorisierungsschlüssel",
        terminal_unlock: "Terminal entsperren",
        dashboard_title: "Vorstands-Dashboard",
        dashboard_desc: "Echtzeit-Überwachung des Lead-Lebenszyklus",
        sync_data: "Daten synchronisieren",
        export_csv: "CSV exportieren",
        export_success: "CSV-Export erfolgreich gestartet",
        stats: {
          total: "Gesamte Anfragen",
          verified: "Verifizierte Leads",
          conversion: "Konversion",
          avg_seats: "Durchschn. Plätze",
          lifetime: "GESAMTZEIT",
          common_vpn: "Häufigstes Legacy VPN"
        },
        tabs: {
          pipeline: "Pipeline",
          pricing: "Preis-Anpassungen",
          settings: "Systemregeln"
        },
        table: {
          timestamp: "Zeitstempel",
          org: "Organisation",
          stakeholder: "Ansprechpartner",
          infra: "Infrastruktur",
          verification: "Verifizierung",
          management: "Verwaltung",
          no_leads: "Keine Leads gefunden.",
          purge_confirm: "Lead-Daten dauerhaft löschen?",
          opt_out: "Widerspruch"
        },
        pricing: {
          market_rate: "Marktrate / Benutzer / Monat",
          quote_required: "Angebot erforderlich",
          quote_desc: "Erzwingt Bereichsanzeige",
          updated_success: "Preise erfolgreich aktualisiert"
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
      },
      legal: {
        imprint: {
          title: "Impressum",
          provider_title: "Dienstanbieter",
          provider_details: "von Busch GmbH\nAlfred-Bozi-Straße 12\n33602 Bielefeld\nDeutschland",
          contact_title: "Kontakt",
          contact_details: "E-Mail: security@vonbusch.digital\nWeb: www.vonbusch.digital",
          register_title: "Handelsregister",
          register_details: "Amtsgericht Bielefeld\nHRB 45678"
        },
        privacy: {
          title: "Datenschutzerklärung",
          section1_title: "1. Datenerhebung",
          section1_desc: "Wir erheben Daten, die für die ZTNA-Analyse notwendig sind, einschließlich Organisationsname, Ansprechpartner und Infrastrukturkennzahlen.",
          section2_title: "2. Rechtsgrundlage",
          section2_desc: "Die Datenverarbeitung basiert auf Ihrer ausdrücklichen Einwilligung (Art. 6 Abs. 1 lit. a DSGVO) und unserem berechtigten Interesse an präzisen Sicherheitsvergleichen.",
          section3_title: "3. Aufbewahrung",
          section3_desc: "Bestätigte Leads werden für 24 Monate gespeichert. Nicht verifizierte Leads werden nach 30 Tagen automatisch gelöscht.",
          section4_title: "4. Ihre Rechte",
          section4_desc: "Sie haben jederzeit das Recht auf Auskunft, Berichtigung oder Löschung Ihrer Daten. Kontaktieren Sie uns unter security@vonbusch.digital."
        }
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
            vonBusch: "Développ�� par von Busch Digital",
            cloudflare: "Propulsé par Cloudflare Infrastructure",
            ubiquiti: "Cadre d'audit de sécurité"
          }
        },
        footer: {
          imprint: "Mentions Légales",
          privacy: "Confidentialité",
          credit: "Développé avec ♥ chez"
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
          q3: "Les prix sont-ils définitifs ?",
          a3: "Il s'agit d'estimations basées sur les prix catalogue. Des remises enterprise sont possibles.",
          q4: "Données protégées ?",
          a4: "Nous sommes strictement conformes au RGPD. Les données sont chiffrées sur Cloudflare."
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
          disclaimer: "Vos données sont utilisées exclusivement pour l'analyse et le suivi professionnel par des architectes de von Busch Digital (security@vonbusch.digital). Aucune donnée n'est partagée. Vous pouvez vous opposer au suivi via l'email de vérification."
        },
        submitted: {
          title: "Vérification envoyée",
          desc: "Veuillez vérifier votre boîte de réception et cliquer sur le lien de vérification pour débloquer votre rapport."
        }
      },
      results: {
        title: "Résultat de l'analyse",
        sample_title: "Analyse de sécurité type",
        live_sample_mode: "MODE DEMO LIVE : Utilisation de données de démonstration.",
        subtitle: "Comparaison pour {{seats}} utilisateurs",
        export_pdf: "Télécharger le rapport",
        tco_title: "Projection TCO sur 12 mois",
        bsi_qualified: "Fournisseur qualifié BSI",
        disclaimer: "Estimations basées sur les prix catalogue. Ce rapport ne constitue pas une offre contractuelle.",
        methodology_title: "Méthodologie & Transparence",
        methodology_desc: "Les scores sont calculés à l'aide d'une moyenne pondérée de l'exhaustivité des fonctionnalités (40%), de la compétitivité des prix (40%) et de la conformité réglementaire (20%).",
        expert_take_label: "L'avis de l'expert",
        expert_take_0: "Équilibre exceptionnel entre coût et conformité. Idéal pour les environnements d'entreprise hautement réglementés.",
        expert_take_1: "Ensemble de fonctionnalités premium avec protection avancée contre les menaces. Recommandé pour les profils numériques à haut risque.",
        expert_take_2: "Architecture cloud évolutive avec des parcours de mise en œuvre rapides et une gestion intuitive.",
        badges: {
          top_match: "Meilleure correspondance",
          best_fit: "Meilleur choix",
          top_recommendations: "Top Recommandations"
        },
        matrix: {
          title: "Matrice des capacités",
          capability: "Fonctionnalité",
          show_all: "Toutes les lignes",
          diff_only: "Afficher les différences",
          best_fit: "Meilleur choix",
          deep_dive: "Détails de l'analyse",
          feature_score: "Richesse fonctionnelle (40%)",
          price_score: "Positionnement prix (40%)",
          compliance_score: "Conformité (20%)",
          total_score: "Score Scout",
          analytical_breakdown: "Analyse détaillée",
          market_rank: "Rang du marché",
          rank_1: "1ère place",
          rank_2: "2ème place",
          rank_3: "3ème place",
          scout_total: "Total Scout",
          close_deep_dive: "Fermer l'analyse",
          expert_take_desc: {
            features: "Capacités ZTNA, SWG, CASB, DLP et isolation.",
            price: "Compétitivité par rapport aux moyennes du marché.",
            compliance: "Qualifications BSI et certifications de sécurité."
          }
        }
      },
      admin: {
        terminal_title: "Porte Sentinelle",
        terminal_desc: "Accès administratif requis",
        terminal_key: "Clé d'autorité secrète",
        terminal_unlock: "Déverrouiller le terminal",
        dashboard_title: "Tableau de bord exécutif",
        dashboard_desc: "Suivi en temps réel du cycle de vie des prospects",
        sync_data: "Synchroniser les données",
        export_csv: "Exporter CSV",
        export_success: "Export CSV lancé avec succès",
        stats: {
          total: "Total demandes",
          verified: "Prospects vérifiés",
          conversion: "Conversion",
          avg_seats: "Sièges moyens",
          lifetime: "À VIE",
          common_vpn: "VPN Legacy Principal"
        },
        tabs: {
          pipeline: "Pipeline",
          pricing: "Ajustements de prix",
          settings: "Règles du système"
        },
        table: {
          timestamp: "Horodatage",
          org: "Organisation",
          stakeholder: "Intervenant",
          infra: "Infrastructure",
          verification: "Vérification",
          management: "Gestion",
          no_leads: "Aucun prospect trouvé.",
          purge_confirm: "Supprimer définitivement les données du prospect ?",
          opt_out: "Opposition"
        },
        pricing: {
          market_rate: "Prix du marché / utilisateur / mois",
          quote_required: "Devis requis",
          quote_desc: "Force l'affichage de la plage",
          updated_success: "Prix mis à jour avec succès"
        }
      },
      optOut: {
        title: "Opposition au contact",
        success: "Votre préférence a été mise à jour. Aucun autre suivi ne sera effectué pour cette demande.",
        error: "Lien invalide ou expiré. Contactez le support pour modifier vos préférences.",
        back: "Retour au site"
      },
      verify: {
        loading: "Vérification...",
        success: "Identité vérifiée!",
        success_desc: "Votre rapport (ID: {{id}}) est prêt. Redirection en cours...",
        error: "Échec de la vérification",
        error_desc: "Le lien a expiré ou est invalide. Veuillez recommencer l'analyse."
      },
      legal: {
        imprint: {
          title: "Mentions Légales",
          provider_title: "Prestataire de services",
          provider_details: "von Busch GmbH\nAlfred-Bozi-Straße 12\n33602 Bielefeld\nAllemagne",
          contact_title: "Contact",
          contact_details: "Email : security@vonbusch.digital\nWeb : www.vonbusch.digital",
          register_title: "Registre du commerce",
          register_details: "Amtsgericht Bielefeld\nHRB 45678"
        },
        privacy: {
          title: "Politique de Confidentialité",
          section1_title: "1. Collecte des données",
          section1_desc: "Nous collectons les données nécessaires à l'analyse ZTNA, y compris le nom de l'organisation, la personne de contact et les mesures d'infrastructure.",
          section2_title: "2. Base juridique",
          section2_desc: "Le traitement des données est basé sur votre consentement explicite (Art. 6 al. 1 lit. a RGPD) et notre intérêt légitime à fournir des comparaisons de sécurité précises.",
          section3_title: "3. Conservation",
          section3_desc: "Les prospects confirmés sont conservés pendant 24 mois. Les prospects non vérifiés sont purgés automatiquement après 30 jours.",
          section4_title: "4. Vos droits",
          section4_desc: "Vous avez le droit d'accéder à vos données, de les rectifier ou de les supprimer à tout moment. Contactez-nous à security@vonbusch.digital."
        }
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