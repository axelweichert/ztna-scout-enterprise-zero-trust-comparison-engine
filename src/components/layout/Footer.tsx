import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
export function Footer({ className }: { className?: string }) {
  return (
    <footer className={cn("border-t bg-slate-50/50 py-12 md:py-16 print:py-6 print:bg-white", className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center gap-6">
          {/* 3-Line Branding Block */}
          <div className="space-y-1 text-sm md:text-base font-medium text-foreground print:text-black print:text-[9pt]">
            <p>von Busch GmbH – Alfred-Bozi-Straße 12 – 33602 Bielefeld</p>
            <p>A strategic security service by von Busch GmbH</p>
            <p>Built with <span className="text-primary mx-0.5">♥</span> at Cloudflare.</p>
          </div>
          {/* Legal Links Row */}
          <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground print:hidden">
            <Link
              to="/impressum"
              className="hover:text-primary transition-colors underline-offset-4 hover:underline font-semibold uppercase tracking-widest"
            >
              Imprint
            </Link>
            <div className="w-1 h-1 rounded-full bg-muted-foreground/30" />
            <Link
              to="/datenschutz"
              className="hover:text-primary transition-colors underline-offset-4 hover:underline font-semibold uppercase tracking-widest"
            >
              Privacy Policy
            </Link>
          </div>
          {/* Copyright Metadata */}
          <div className="text-[10px] text-muted-foreground/60 font-mono tracking-tighter uppercase mt-4">
            &copy; {new Date().getFullYear()} von Busch Digital. All Rights Reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}