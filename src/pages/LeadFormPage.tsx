import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Steps } from '@/components/ui/steps';
import { ThemeToggle } from '@/components/ThemeToggle';
import { api } from '@/lib/api-client';
import { toast } from 'sonner';
const leadSchema = z.object({
  companyName: z.string().min(2, "Required"),
  contactName: z.string().min(2, "Required"),
  email: z.string().email("Invalid email"),
  seats: z.preprocess((val) => Number(val), z.number().min(1, "Minimum 1 seat")),
  vpnStatus: z.enum(['active', 'replacing', 'none']),
  consentGiven: z.boolean().refine(v => v === true, "Required")
});
type LeadFormData = z.infer<typeof leadSchema>;
export function LeadFormPage() {
  const { t } = useTranslation();
  const [step, setStep] = useState(0);
  const navigate = useNavigate();
  const form = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
    defaultValues: { 
      vpnStatus: 'active', 
      consentGiven: false,
      companyName: '',
      contactName: '',
      email: '',
      seats: 50
    }
  });
  const steps = [
    { title: t('form.steps.company') },
    { title: t('form.steps.requirements') },
    { title: t('form.steps.consent') }
  ];
  const onSubmit = async (data: LeadFormData) => {
    try {
      const result = await api<{ id: string }>('/api/submit', {
        method: 'POST',
        body: JSON.stringify({
          ...data,
          timing: 'immediate' // Default for now
        })
      });
      toast.success("Success!");
      navigate(`/vergleich/${result.id}`);
    } catch (e) {
      toast.error("An error occurred.");
    }
  };
  const nextStep = async () => {
    const fields = step === 0 
      ? ['companyName', 'contactName', 'email'] 
      : ['seats', 'vpnStatus'];
    const isValid = await form.trigger(fields as any);
    if (isValid) setStep(s => s + 1);
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <ThemeToggle />
      <div className="py-12 md:py-20 max-w-2xl mx-auto">
        <div className="text-center mb-12 space-y-4">
          <h1 className="text-5xl font-display font-bold text-gradient tracking-tight">{t('hero.title')}</h1>
          <p className="text-xl text-muted-foreground">{t('hero.subtitle')}</p>
        </div>
        <Steps steps={steps} currentStep={step} />
        <Card className="mt-10 shadow-xl border-primary/5 bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-2xl">{steps[step].title}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <AnimatePresence mode="wait">
                {step === 0 && (
                  <motion.div key="s0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                    <div className="space-y-2">
                      <Label>{t('form.labels.companyName')}</Label>
                      <Input {...form.register('companyName')} placeholder="Acme Inc." />
                    </div>
                    <div className="space-y-2">
                      <Label>{t('form.labels.contactPerson')}</Label>
                      <Input {...form.register('contactName')} placeholder="John Doe" />
                    </div>
                    <div className="space-y-2">
                      <Label>{t('form.labels.workEmail')}</Label>
                      <Input {...form.register('email')} type="email" placeholder="john@acme.com" />
                    </div>
                    <Button type="button" className="w-full btn-gradient py-6 text-lg" onClick={nextStep}>{t('form.buttons.continue')}</Button>
                  </motion.div>
                )}
                {step === 1 && (
                  <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                    <div className="space-y-2">
                      <Label>{t('form.labels.seats')}</Label>
                      <Input {...form.register('seats')} type="number" />
                    </div>
                    <div className="space-y-2">
                      <Label>{t('form.labels.vpnStatus')}</Label>
                      <select {...form.register('vpnStatus')} className="w-full h-12 rounded-lg border border-input bg-background px-4">
                        <option value="active">{t('form.options.vpn_active')}</option>
                        <option value="replacing">{t('form.options.vpn_replacing')}</option>
                        <option value="none">{t('form.options.vpn_none')}</option>
                      </select>
                    </div>
                    <div className="flex gap-4 pt-4">
                      <Button type="button" variant="outline" className="flex-1 py-6" onClick={() => setStep(0)}>{t('form.buttons.back')}</Button>
                      <Button type="button" className="flex-1 btn-gradient py-6" onClick={nextStep}>{t('form.buttons.continue')}</Button>
                    </div>
                  </motion.div>
                )}
                {step === 2 && (
                  <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                    <div className="flex items-start space-x-3 p-6 bg-muted/50 rounded-xl border">
                      <Checkbox 
                        id="c" 
                        onCheckedChange={(v) => form.setValue('consentGiven', v === true, { shouldValidate: true })}
                        checked={form.watch('consentGiven')}
                      />
                      <Label htmlFor="c" className="text-sm leading-relaxed">{t('form.labels.consent')}</Label>
                    </div>
                    <div className="flex gap-4">
                      <Button type="button" variant="outline" className="flex-1 py-6" onClick={() => setStep(1)}>{t('form.buttons.back')}</Button>
                      <Button type="submit" className="flex-1 btn-gradient py-6 text-lg" disabled={form.formState.isSubmitting}>
                        {form.formState.isSubmitting ? t('form.buttons.generating') : t('form.buttons.submit')}
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}