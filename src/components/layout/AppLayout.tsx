import React from "react";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Languages } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
type AppLayoutProps = {
  children: React.ReactNode;
  container?: boolean;
  className?: string;
  contentClassName?: string;
};
export function AppLayout({ children, container = false, className, contentClassName }: AppLayoutProps): JSX.Element {
  const { i18n } = useTranslation();
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };
  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar />
      <SidebarInset className={cn("flex flex-col min-h-screen", className)}>
        <Header className="sticky top-0 z-50">
          <div className="flex items-center gap-2 mr-4">
            <SidebarTrigger />
            <span className="hidden lg:inline-block font-bold text-xs tracking-widest text-muted-foreground uppercase">Admin Panel</span>
          </div>
          <div className="flex items-center gap-4 ml-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2 h-8">
                  <Languages className="h-4 w-4" />
                  <span className="uppercase text-xs font-bold">{i18n.language.slice(0, 2)}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => changeLanguage('en')}>English</DropdownMenuItem>
                <DropdownMenuItem onClick={() => changeLanguage('de')}>Deutsch</DropdownMenuItem>
                <DropdownMenuItem onClick={() => changeLanguage('fr')}>Français</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </Header>
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
      </SidebarInset>
    </SidebarProvider>
  );
}