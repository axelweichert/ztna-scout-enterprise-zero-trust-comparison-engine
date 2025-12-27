import React from "react";

export function Footer(): JSX.Element {
  return (
    <footer className="border-t border-slate-200/60 dark:border-slate-800/60 bg-white/70 dark:bg-slate-950/70 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col gap-6 text-sm text-slate-700 dark:text-slate-300">
          <div className="flex flex-col gap-1">
            <div>von Busch GmbH – Alfred-Bozi-Straße 12 – 33602 Bielefeld</div>
            <div>Ein Service der von Busch GmbH</div>
            <div>Built with ♥ at Cloudflare</div>
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <a
              href="https://vonbusch.digital/impressum/"
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-4 hover:text-slate-900 dark:hover:text-white"
            >
              Impressum
            </a>
            <a
              href="https://vonbusch.digital/datenschutz/"
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-4 hover:text-slate-900 dark:hover:text-white"
            >
              Datenschutz
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
