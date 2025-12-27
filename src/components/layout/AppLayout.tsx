import React from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { cn } from "@/lib/utils";

type AppLayoutProps = {
  children: React.ReactNode;
  container?: boolean;
  className?: string;
  contentClassName?: string;
};

export function AppLayout({
  children,
  container = false,
  className,
  contentClassName,
}: AppLayoutProps): JSX.Element {
  return (
    <div className={cn("flex flex-col min-h-screen", className)}>
      <Header className="sticky top-0 z-50" />

      <main className="flex-1">
        {container ? (
          <div className={cn("max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12", contentClassName)}>
            {children}
          </div>
        ) : (
          children
        )}
      </main>

      <Footer />
    </div>
  );
}
