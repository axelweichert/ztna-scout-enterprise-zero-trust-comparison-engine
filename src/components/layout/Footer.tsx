import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
export function Footer({ className }: { className?: string }) {
  const { t } = useTranslation();
  return (
    <footer className={cn("border-t bg-slate-50/50 py-8 print:py-4 print:bg-white", className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col items-center md:items-start gap-1 text-xs text-muted-foreground print:text-black print:text-[8pt]">
            <span className="font-bold text-foreground">
              {t('layout.footer.service_line')}
            </span>
            <span className="font-medium">von Busch GmbH – Alfred-Bozi-Straße 12 – 33602 Bielefeld</span>
            <div className="flex gap-4 mt-1">
              <Link
                to="/impressum"
                className="hover:text-foreground transition-colors underline-offset-4 hover:underline"
              >
                {t('layout.footer.imprint')}
              </Link>
              <Link
                to="/datenschutz"
                className="hover:text-foreground transition-colors underline-offset-4 hover:underline"
              >
                {t('layout.footer.privacy')}
              </Link>
            </div>
          </div>
          <div className="text-xs text-muted-foreground print:text-black print:text-[8pt] flex items-center gap-1">
            {t('layout.footer.credit')}
            <a
              href="https://www.cloudflare.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-semibold"
            >
              Cloudflare
            </a>.
          </div>
        </div>
      </div>
    </footer>
  );
}