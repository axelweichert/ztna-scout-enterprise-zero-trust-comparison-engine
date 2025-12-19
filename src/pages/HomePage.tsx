import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight } from 'lucide-react';
export function HomePage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-rainbow opacity-5 pointer-events-none" />
        <div className="text-center space-y-10 relative z-10 animate-fade-in w-full max-w-4xl">
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-3xl bg-gradient-primary flex items-center justify-center shadow-primary floating">
              <Sparkles className="w-10 h-10 text-white rotating" />
            </div>
          </div>
          <div className="space-y-6">
            <h1 className="text-5xl md:text-8xl font-display font-bold text-balance leading-tight tracking-tighter">
              ZTNA <span className="text-gradient">Scout</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto text-pretty">
              The professional engine for Zero Trust Network Access comparison and TCO analysis.
            </p>
          </div>
          <div className="flex justify-center gap-4">
            <Button
              size="lg"
              onClick={() => navigate('/')}
              className="btn-gradient px-10 py-8 text-xl font-bold shadow-xl rounded-2xl group"
            >
              Start Comparison
              <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}