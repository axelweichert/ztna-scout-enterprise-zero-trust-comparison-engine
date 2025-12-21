import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Steps } from '@/components/ui/steps';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { api } from '@/lib/api-client';
import { toast } from 'sonner';
import { MailCheck, Loader2, ArrowRight, ShieldCheck } from 'lucide-react';
import type { LeadFormData } from '@shared/types';
const leadSchema = z.object({
  companyName: z.string().min(2, "Required"),
  contactName: z.string().min(2, "Required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(6, "Invalid phone").regex(/^[0-9+\s\-().]+$/, "Invalid characters"),
  seats: z.number().min(1, "Minimum 1 seat"),
  vpnStatus: z.enum(['active', 'replacing', 'none'] as const),
  timing: z.enum(['immediate', '3_months', '6_months', 'planning'] as const),
  budgetRange: z.string().min(1, "Required"),
});
export function LeadFormPage() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [verificationToken, setVerificationToken] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  const form = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      vpnStatus: 'active',
      seats: 50,
      companyName: "",
      contactName: "",
      email: "",
      phone: "",
      timing: 'immediate',
      budgetRange: 'med'
    }
  });

  const steps = [
    { title: 'Entity' },
    { title: 'Architecture' },
    { title: 'Compliance' }
  ];
  const handleFormSubmit: SubmitHandler<LeadFormData> = async (data) => {
    if (!isVerified) {
      toast.error("Please complete the demo verification.");
      return;
    }
    setIsProcessing(true);
    try {
      const response = await api<{ verificationToken?: string }>('/api/submit', {
        method: 'POST',
        body: JSON.stringify(data)
      });
      if (response.verificationToken) {
        setVerificationToken(response.verificationToken);
      }
      setSubmitted(true);
    } catch (e) {
      toast.error("Submission failed. Please check your data and try again.");
    } finally {
      setIsProcessing(false);
    }
  };
  const nextStep = async () => {
    const fields = step === 0
      ? ['companyName', 'contactName', 'email', 'phone']
      : ['seats', 'vpnStatus', 'timing', 'budgetRange'];
    const isValid = await form.trigger(fields as any);
    if (isValid) setStep(s => s + 1);
  };
  if (submitted) return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md w-full">
          <Card className="text-center p-8 md:p-12 shadow-2xl border-none bg-white rounded-3xl">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8">
              <MailCheck className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-3xl font-display font-bold mb-4">Verification Sent</h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">To ensure data integrity, please check your corporate inbox and click the verification link to unlock your report.</p>
            <div className="space-y-4">
              {verificationToken && (
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 mb-6 text-left">
                  <div className="flex items-center gap-2 mb-2 text-primary">
                    <ShieldCheck className="w-4 h-4" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Demo Access Key</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-4">In a live environment, this link is sent via email. Click below to bypass email verification for testing.</p>
                  <Button 
                    className="w-full btn-gradient py-6 rounded-xl group"
                    onClick={() => navigate(`/verify/${verificationToken}`)}
                  >
                    View Result Now
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              )}
              <Button variant="outline" className="w-full h-14 rounded-xl border-2" onClick={() => navigate('/')}>
                Return Home
              </Button>
            </div>
          </Card>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 max-w-7xl mx-auto px-4 py-12 md:py-20 w-full">
        <div className="max-w-2xl mx-auto">
          <Steps steps={steps} currentStep={step} className="mb-16" />
          <Card className="shadow-2xl border-primary/5 bg-white/80 backdrop-blur-xl rounded-3xl overflow-hidden">
            <CardHeader className="pt-10 px-8 text-center border-b bg-slate-50/50">
              <CardTitle className="text-2xl font-display">{steps[step].title}</CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8">
                <AnimatePresence mode="wait">
                  {step === 0 && (
                    <motion.div key="s0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                      <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Entity Name</Label>
                        <Input {...form.register('companyName')} className="h-14 rounded-xl" placeholder="Global Corp" />
                        {form.formState.errors.companyName && <p className="text-xs text-destructive">{form.formState.errors.companyName.message}</p>}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Liaison Name</Label>
                          <Input {...form.register('contactName')} className="h-14 rounded-xl" placeholder="Jane Doe" />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Phone Number</Label>
                          <Input {...form.register('phone')} type="tel" className="h-14 rounded-xl" placeholder="+49 521 1234567" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Corporate Email</Label>
                        <Input {...form.register('email')} type="email" className="h-14 rounded-xl" placeholder="jane.doe@company.com" />
                      </div>
                      <Button type="button" className="w-full btn-gradient py-7 text-lg shadow-lg rounded-xl" onClick={nextStep}>Proceed</Button>
                    </motion.div>
                  )}
                  {step === 1 && (
                    <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Deployment Scale</Label>
                          <Input {...form.register('seats', { valueAsNumber: true })} type="number" className="h-14 rounded-xl" />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Project Budget</Label>
                          <select {...form.register('budgetRange')} className="w-full h-14 rounded-xl border border-input bg-background px-4 outline-none transition-all focus:ring-2 focus:ring-primary/20">
                            <option value="low">&lt; €10k / year</option>
                            <option value="med">€10k - €50k / year</option>
                            <option value="high">€50k - €100k / year</option>
                            <option value="enterprise">€100k+ / year</option>
                          </select>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Legacy State</Label>
                          <select {...form.register('vpnStatus')} className="w-full h-14 rounded-xl border border-input bg-background px-4 outline-none transition-all focus:ring-2 focus:ring-primary/20">
                            <option value="active">Active Legacy VPN</option>
                            <option value="replacing">Ongoing Migration</option>
                            <option value="none">SDP / Cloud Native</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Migration Timeline</Label>
                          <select {...form.register('timing')} className="w-full h-14 rounded-xl border border-input bg-background px-4 outline-none transition-all focus:ring-2 focus:ring-primary/20">
                            <option value="immediate">Immediate</option>
                            <option value="3_months">Within 3 Months</option>
                            <option value="6_months">Next 6 Months</option>
                            <option value="planning">Strategic Planning</option>
                          </select>
                        </div>
                      </div>
                      <div className="flex gap-4 pt-4">
                        <Button type="button" variant="ghost" className="flex-1 py-7" onClick={() => setStep(0)}>Return</Button>
                        <Button type="button" className="flex-1 btn-gradient py-7 shadow-lg" onClick={nextStep}>Proceed</Button>
                      </div>
                    </motion.div>
                  )}
                  {step === 2 && (
                    <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                      <div className="p-6 border rounded-2xl bg-slate-50/50 space-y-4">
                        <h4 className="font-bold text-sm uppercase tracking-wider">Compliance</h4>
                        <p className="text-sm leading-relaxed text-muted-foreground italic">
                          Your data is used exclusively for the generation of this analysis and professional follow-up by certified security architects at von Busch Digital (security@vonbusch.digital). No data is shared with third parties. You can object at any time using the link in our emails.
                        </p>
                      </div>
                      <div className="flex justify-center py-4">
                        <div className="flex items-center p-6 border-2 border-dashed border-muted rounded-2xl bg-muted/20 justify-center min-h-[78px]">
                          <label className="flex items-center gap-3 cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                            <input type="checkbox" className="w-5 h-5 rounded border-muted bg-background" checked={isVerified} onChange={(e) => setIsVerified(e.target.checked)} />
                            <span>Demo verification: Confirm I'm human</span>
                          </label>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <Button type="button" variant="ghost" className="flex-1 py-7" onClick={() => setStep(1)} disabled={isProcessing}>Return</Button>
                        <Button type="submit" className="flex-1 btn-gradient py-7 shadow-xl" disabled={isProcessing || !isVerified}>
                          {isProcessing ? (
                            <>
                              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                              Processing Analysis...
                            </>
                          ) : 'Verify & Generate'}
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}