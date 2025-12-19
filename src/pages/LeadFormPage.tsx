import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Turnstile from 'react-turnstile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Steps } from '@/components/ui/steps';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { api } from '@/lib/api-client';
import { toast } from 'sonner';
import { MailCheck, Loader2 } from 'lucide-react';
const leadSchema = z.object({
  companyName: z.string().min(2, "Required"),
  contactName: z.string().min(2, "Required"),
  email: z.string().email("Invalid email"),
  seats: z.number().min(1, "Minimum 1 seat"),
  vpnStatus: z.enum(['active', 'replacing', 'none'] as const),
  processingAccepted: z.boolean().refine(v => v === true, { message: "Required" }),
  followUpAccepted: z.boolean().refine(v => v === true, { message: "Required" }),
  marketingAccepted: z.boolean().default(false)
});
type LeadFormData = z.infer<typeof leadSchema>;
export function LeadFormPage() {
  const { t } = useTranslation();
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  const form = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      vpnStatus: 'active',
      processingAccepted: false,
      followUpAccepted: false,
      marketingAccepted: false,
      seats: 50,
      companyName: "",
      contactName: "",
      email: ""
    }
  });
  const steps = [
    { title: t('form.steps.company') },
    { title: t('form.steps.requirements') },
    { title: t('form.steps.legal') }
  ];
  const handleFormSubmit: SubmitHandler<LeadFormData> = async (data) => {
    if (!turnstileToken) {
      toast.error("Please complete the bot verification.");
      return;
    }
    setIsProcessing(true);
    try {
      await api('/api/submit', {
        method: 'POST',
        body: JSON.stringify({ ...data, turnstileToken, timing: 'immediate', consentGiven: true })
      });
      setSubmitted(true);
    } catch (e) {
      toast.error("Submission failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };
  const nextStep = async () => {
    const fields = step === 0
      ? ['companyName', 'contactName', 'email']
      : ['seats', 'vpnStatus'];
    const isValid = await form.trigger(fields as any);
    if (isValid) setStep(s => s + 1);
  };
  if (submitted) return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md w-full">
          <Card className="text-center p-12 shadow-2xl border-none bg-white rounded-3xl">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8">
              <MailCheck className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-3xl font-display font-bold mb-4">{t('form.submitted.title')}</h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">{t('form.submitted.desc')}</p>
            <Button className="w-full btn-gradient py-6" onClick={() => navigate('/')}>Return Home</Button>
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
                        <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{t('form.labels.companyName')}</Label>
                        <Input {...form.register('companyName')} className="h-14 rounded-xl" placeholder="Global Corp" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{t('form.labels.contactPerson')}</Label>
                        <Input {...form.register('contactName')} className="h-14 rounded-xl" placeholder="Jane Doe" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{t('form.labels.workEmail')}</Label>
                        <Input {...form.register('email')} type="email" className="h-14 rounded-xl" placeholder="jane.doe@company.com" />
                      </div>
                      <Button type="button" className="w-full btn-gradient py-7 text-lg shadow-lg rounded-xl" onClick={nextStep}>{t('form.buttons.continue')}</Button>
                    </motion.div>
                  )}
                  {step === 1 && (
                    <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                      <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{t('form.labels.seats')}</Label>
                        <Input {...form.register('seats', { valueAsNumber: true })} type="number" className="h-14 rounded-xl" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{t('form.labels.vpnStatus')}</Label>
                        <select {...form.register('vpnStatus')} className="w-full h-14 rounded-xl border border-input bg-background px-4 outline-none transition-all focus:ring-2 focus:ring-primary/20">
                          <option value="active">{t('form.options.vpn_active')}</option>
                          <option value="replacing">{t('form.options.vpn_replacing')}</option>
                          <option value="none">{t('form.options.vpn_none')}</option>
                        </select>
                      </div>
                      <div className="flex gap-4 pt-4">
                        <Button type="button" variant="ghost" className="flex-1 py-7" onClick={() => setStep(0)}>{t('form.buttons.back')}</Button>
                        <Button type="button" className="flex-1 btn-gradient py-7 shadow-lg" onClick={nextStep}>{t('form.buttons.continue')}</Button>
                      </div>
                    </motion.div>
                  )}
                  {step === 2 && (
                    <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-start gap-4 p-4 border rounded-xl bg-slate-50/50">
                          <Checkbox id="c1" onCheckedChange={(v) => form.setValue('processingAccepted', v === true, { shouldValidate: true })} checked={form.watch('processingAccepted')} className="mt-1" />
                          <Label htmlFor="c1" className="text-sm leading-relaxed text-muted-foreground cursor-pointer">{t('form.legal.processing')}</Label>
                        </div>
                        <div className="flex items-start gap-4 p-4 border rounded-xl bg-slate-50/50">
                          <Checkbox id="c2" onCheckedChange={(v) => form.setValue('followUpAccepted', v === true, { shouldValidate: true })} checked={form.watch('followUpAccepted')} className="mt-1" />
                          <Label htmlFor="c2" className="text-sm leading-relaxed text-muted-foreground cursor-pointer">{t('form.legal.contact')}</Label>
                        </div>
                        <div className="flex items-start gap-4 p-4 border rounded-xl">
                          <Checkbox id="c3" onCheckedChange={(v) => form.setValue('marketingAccepted', v === true)} checked={form.watch('marketingAccepted')} className="mt-1" />
                          <Label htmlFor="c3" className="text-sm leading-relaxed text-muted-foreground cursor-pointer">{t('form.legal.marketing')}</Label>
                        </div>
                      </div>
                      <div className="flex justify-center py-4">
                        <Turnstile sitekey="1x00000000000000000000AA" onVerify={(token) => setTurnstileToken(token)} />
                      </div>
                      <div className="flex gap-4">
                        <Button type="button" variant="ghost" className="flex-1 py-7" onClick={() => setStep(1)} disabled={isProcessing}>{t('form.buttons.back')}</Button>
                        <Button type="submit" className="flex-1 btn-gradient py-7 shadow-xl" disabled={isProcessing}>
                          {isProcessing ? (
                            <>
                              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                              {t('form.buttons.generating')}
                            </>
                          ) : t('form.buttons.submit')}
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