import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldAlert, CheckCircle2, Loader2, Home } from 'lucide-react';
import { api } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useTranslation } from 'react-i18next';
export function OptOutPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  useEffect(() => {
    const processOptOut = async () => {
      if (!token) {
        setStatus('error');
        return;
      }
      try {
        await api('/api/opt-out', {
          method: 'POST',
          body: JSON.stringify({ token })
        });
        setStatus('success');
      } catch (e) {
        setStatus('error');
      }
    };
    processOptOut();
  }, [token]);
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white p-12 rounded-3xl shadow-2xl text-center"
        >
          {status === 'loading' && (
            <div className="space-y-6">
              <Loader2 className="w-16 h-16 text-primary animate-spin mx-auto" />
              <h2 className="text-2xl font-display font-bold">Updating preferences...</h2>
            </div>
          )}
          {status === 'success' && (
            <div className="space-y-6">
              <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
              <h2 className="text-2xl font-display font-bold">{t('optOut.title')}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {t('optOut.success')}
              </p>
              <Button onClick={() => navigate('/')} className="w-full btn-gradient py-6 mt-4 gap-2">
                <Home className="w-4 h-4" />
                {t('optOut.back')}
              </Button>
            </div>
          )}
          {status === 'error' && (
            <div className="space-y-6">
              <ShieldAlert className="w-16 h-16 text-red-500 mx-auto" />
              <h2 className="text-2xl font-display font-bold">Update Failed</h2>
              <p className="text-muted-foreground leading-relaxed">
                {t('optOut.error')}
              </p>
              <Button onClick={() => navigate('/')} variant="outline" className="w-full py-6 mt-4">
                {t('optOut.back')}
              </Button>
            </div>
          )}
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}