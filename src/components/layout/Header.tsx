import React from 'react';
import { Link } from 'react-router-dom';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { ThemeToggle } from '@/components/ThemeToggle';
import { cn } from '@/lib/utils';
interface HeaderProps {
  className?: string;
  leftSlot?: React.ReactNode;
  rightSlot?: React.ReactNode;
}
export function Header({ className, leftSlot, rightSlot }: HeaderProps) {
  return (
    <header className={cn("sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md print:hidden", className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {leftSlot || (
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                <span className="text-white font-bold text-xs">ZS</span>
              </div>
              <span className="font-display font-bold text-xl tracking-tight hidden sm:block">
                ZTNA <span className="text-primary">Scout</span>
              </span>
            </Link>
          )}
        </div>
        <div className="flex items-center gap-2 sm:gap-6">
          <div className="flex items-center gap-2">
            {rightSlot}
            <TooltipProvider delayDuration={0}>
              <div className="flex items-center gap-4 border-l pl-4 ml-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <a
                      href="https://www.vonbusch.digital"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-foreground/60 hover:text-foreground transition-all duration-200"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 21h18" /><path d="M3 7v1a3 3 0 0 0 6 0V7m0 1a3 3 0 0 0 6 0V7m0 1a3 3 0 0 0 6 0V7H3l2-4h14l2 4" /><path d="M5 21V10.85" /><path d="M19 21V10.85" /><path d="M9 21v-4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v4" />
                      </svg>
                    </a>
                  </TooltipTrigger>
                  <TooltipContent>Developed by von Busch Digital</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <a
                      href="https://www.cloudflare.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-foreground/60 hover:text-foreground transition-all duration-200"
                    >
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
                      </svg>
                    </a>
                  </TooltipTrigger>
                  <TooltipContent>Powered by Cloudflare Infrastructure</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <a
                      href="https://ui.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-foreground/60 hover:text-foreground transition-all duration-200"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2v8"/><path d="m4.93 10.93 1.41 1.41"/><path d="M2 18h2"/><path d="M20 18h2"/><path d="m19.07 10.93-1.41 1.41"/><path d="M22 22H2"/><path d="m8 22 4-10 4 10"/><circle cx="12" cy="18" r="2"/>
                      </svg>
                    </a>
                  </TooltipTrigger>
                  <TooltipContent>Security Audit Framework</TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>
            <ThemeToggle className="relative top-0 right-0" />
          </div>
        </div>
      </div>
    </header>
  );
}