import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Loader2, ArrowRight } from 'lucide-react';
import { api } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
export function VerifyPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [comparisonId, setComparisonId] = useState<string | null>(null);
  useEffect(() => {
    const verifyToken = async () => {
      try {
        const res = await api<{ comparisonId: string }>(`/api/verify/${token}`);
        setComparisonId(res.comparisonId);
        setStatus('success');
        // Auto-redirect after 3 seconds
        setTimeout(() => navigate(`/vergleich/${res.comparisonId}`), 3000);
      } catch (e) {
        setStatus('error');
      }
    };
    if (token) verifyToken();
  }, [token, navigate]);
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white p-12 rounded-3xl shadow-2xl text-center"
        >
          {status === 'loading' && (
            <div className="space-y-6">
              <Loader2 className="w-16 h-16 text-primary animate-spin mx-auto" />
              <h2 className="text-2xl font-display font-bold">Verifying your request...</h2>
              <p className="text-muted-foreground">This will only take a moment.</p>
            </div>
          )}
          {status === 'success' && (
            <div className="space-y-6">
              <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
              <h2 className="text-2xl font-display font-bold">Identity Verified!</h2>
              <p className="text-muted-foreground">Your enterprise analysis is ready. Redirecting you now...</p>
              <Button onClick={() => navigate(`/vergleich/${comparisonId}`)} className="btn-gradient w-full py-6 mt-4 group">
                Go to Results
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          )}
          {status === 'error' && (
            <div className="space-y-6">
              <XCircle className="w-16 h-16 text-red-500 mx-auto" />
              <h2 className="text-2xl font-display font-bold">Verification Failed</h2>
              <p className="text-muted-foreground">The link may have expired or is invalid. Please start a new comparison.</p>
              <Button onClick={() => navigate('/')} variant="outline" className="w-full py-6 mt-4">
                Back to Start
              </Button>
            </div>
          )}
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}