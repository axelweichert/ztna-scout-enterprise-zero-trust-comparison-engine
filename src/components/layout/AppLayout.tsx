import React from "react";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Languages } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n";

type AppLayoutProps = {
  children: React.ReactNode;
  container?: boolean;
  className?: string;
  contentClassName?: string;
};

export function AppLayout({ children, container = false, className, contentClassName }: AppLayoutProps): JSX.Element {
  const { lang, setLang } = useI18n();

  const leftHeaderSlot = (
    <div className="flex items-center gap-2">
      <SidebarTrigger />
      <span className="hidden lg:inline-block font-bold text-xs tracking-widest text-muted-foreground uppercase">
        Admin Panel
      </span>
    </div>
  );

  const rightHeaderSlot = (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2 h-8">
          <Languages className="h-4 w-4" />
          <span className="uppercase text-xs font-bold">{lang}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setLang("de")}>Deutsch</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLang("en")}>English</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLang("fr")}>Français</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <SidebarProvider defaultOpen>
      <AppSidebar />
      <SidebarInset>
        <Header leftSlot={leftHeaderSlot} rightSlot={rightHeaderSlot} />
        <main className={cn("flex-1 w-full", container ? "max-w-7xl mx-auto px-4 md:px-6" : "", className)}>
          <div className={cn("py-6 md:py-8", contentClassName)}>{children}</div>
        </main>
        <Footer />
      </SidebarInset>
    </SidebarProvider>
  );
}
