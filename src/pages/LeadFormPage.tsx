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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Steps } from '@/components/ui/steps';
import { ThemeToggle } from '@/components/ThemeToggle';
import { api } from '@/lib/api-client';
import { toast } from 'sonner';
const leadSchema = z.object({
  companyName: z.string().min(2, "Required"),
  contactName: z.string().min(2, "Required"),
  email: z.string().email("Invalid email"),
  seats: z.coerce.number().min(1, "Minimum 1 seat"),
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
          timing: 'immediate'
        })
      });
      toast.success("Comparison Generated!");
      navigate(`/vergleich/${result.id}`);
    } catch (e) {
      console.error(e);
      toast.error("An error occurred while generating the comparison.");
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
      <div className="py-12 md:py-24 max-w-2xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16 space-y-6"
        >
          <h1 className="text-5xl md:text-6xl font-display font-bold text-gradient tracking-tight leading-tight">
            {t('hero.title')}
          </h1>
          <p className="text-xl text-muted-foreground max-w-lg mx-auto leading-relaxed">
            {t('hero.subtitle')}
          </p>
        </motion.div>
        <Steps steps={steps} currentStep={step} />
        <Card className="mt-12 shadow-2xl border-primary/10 bg-card/80 backdrop-blur-xl">
          <CardHeader className="pt-10 px-8">
            <CardTitle className="text-3xl font-display">{steps[step].title}</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <AnimatePresence mode="wait">
                {step === 0 && (
                  <motion.div 
                    key="s0" 
                    initial={{ opacity: 0, y: 10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    exit={{ opacity: 0, y: -10 }} 
                    className="space-y-6"
                  >
                    <div className="space-y-3">
                      <Label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">{t('form.labels.companyName')}</Label>
                      <Input {...form.register('companyName')} placeholder="Enterprise Global Ltd." className="h-12 border-input/60 focus:border-primary" />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">{t('form.labels.contactPerson')}</Label>
                      <Input {...form.register('contactName')} placeholder="Alex Smith" className="h-12 border-input/60 focus:border-primary" />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">{t('form.labels.workEmail')}</Label>
                      <Input {...form.register('email')} type="email" placeholder="alex@enterprise.com" className="h-12 border-input/60 focus:border-primary" />
                    </div>
                    <Button type="button" className="w-full btn-gradient py-7 text-lg shadow-lg" onClick={nextStep}>{t('form.buttons.continue')}</Button>
                  </motion.div>
                )}
                {step === 1 && (
                  <motion.div 
                    key="s1" 
                    initial={{ opacity: 0, y: 10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    exit={{ opacity: 0, y: -10 }} 
                    className="space-y-6"
                  >
                    <div className="space-y-3">
                      <Label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">{t('form.labels.seats')}</Label>
                      <Input {...form.register('seats')} type="number" className="h-12 border-input/60 focus:border-primary" />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">{t('form.labels.vpnStatus')}</Label>
                      <select {...form.register('vpnStatus')} className="w-full h-12 rounded-lg border border-input/60 bg-background px-4 focus:ring-2 focus:ring-primary/20 outline-none transition-all">
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
                  <motion.div 
                    key="s2" 
                    initial={{ opacity: 0, y: 10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    exit={{ opacity: 0, y: -10 }} 
                    className="space-y-8"
                  >
                    <div className="flex items-start space-x-4 p-8 bg-primary/5 rounded-2xl border border-primary/10">
                      <Checkbox
                        id="consent"
                        onCheckedChange={(v) => form.setValue('consentGiven', v === true, { shouldValidate: true })}
                        checked={form.watch('consentGiven')}
                        className="mt-1"
                      />
                      <Label htmlFor="consent" className="text-sm leading-relaxed cursor-pointer font-medium text-foreground/90">{t('form.labels.consent')}</Label>
                    </div>
                    <div className="flex gap-4">
                      <Button type="button" variant="ghost" className="flex-1 py-7" onClick={() => setStep(1)}>{t('form.buttons.back')}</Button>
                      <Button type="submit" className="flex-1 btn-gradient py-7 text-xl shadow-xl" disabled={form.formState.isSubmitting}>
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