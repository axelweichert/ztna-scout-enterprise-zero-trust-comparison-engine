import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Steps } from '@/components/ui/steps';
import { api } from '@/lib/api-client';
import { toast } from 'sonner';
const leadSchema = z.object({
  companyName: z.string().min(2, "Company name required"),
  contactName: z.string().min(2, "Contact name required"),
  email: z.string().email("Invalid email address"),
  seats: z.coerce.number().min(1, "Minimum 1 seat required"),
  vpnStatus: z.enum(['active', 'replacing', 'none']),
  consentGiven: z.boolean().refine(v => v === true, "Consent required")
});
type LeadFormData = z.infer<typeof leadSchema>;
export function LeadFormPage() {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();
  const form = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
    defaultValues: { vpnStatus: 'active', consentGiven: false }
  });
  const steps = [
    { title: "Company" },
    { title: "Requirements" },
    { title: "Consent" }
  ];
  const onSubmit = async (data: LeadFormData) => {
    try {
      const result = await api<{ id: string }>('/api/submit', {
        method: 'POST',
        body: JSON.stringify(data)
      });
      toast.success("Comparison generated!");
      navigate(`/vergleich/${result.id}`);
    } catch (e) {
      toast.error("Failed to generate comparison. Please try again.");
      console.error(e);
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
      <div className="py-8 md:py-10 lg:py-12 max-w-2xl mx-auto">
        <div className="text-center mb-10 space-y-4">
          <h1 className="text-4xl font-display font-bold text-gradient">ZTNA Scout</h1>
          <p className="text-muted-foreground">Find the best Zero Trust solution for your enterprise.</p>
        </div>
        <Steps steps={steps} currentStep={step} />
        <Card className="mt-8 shadow-soft border-primary/5">
          <CardHeader>
            <CardTitle>{steps[step].title}</CardTitle>
            <CardDescription>We need a few details to calculate your custom TCO comparison.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <AnimatePresence mode="wait">
                {step === 0 && (
                  <motion.div
                    key="step0"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Company Name</Label>
                      <Input id="companyName" {...form.register('companyName')} placeholder="Acme Corp" />
                      {form.formState.errors.companyName && <p className="text-xs text-destructive">{form.formState.errors.companyName.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactName">Contact Person</Label>
                      <Input id="contactName" {...form.register('contactName')} placeholder="Jane Doe" />
                      {form.formState.errors.contactName && <p className="text-xs text-destructive">{form.formState.errors.contactName.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Work Email</Label>
                      <Input id="email" {...form.register('email')} type="email" placeholder="jane@acme.com" />
                      {form.formState.errors.email && <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>}
                    </div>
                    <Button type="button" className="w-full btn-gradient mt-4" onClick={nextStep}>Continue</Button>
                  </motion.div>
                )}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="seats">Number of Users (Seats)</Label>
                      <Input id="seats" {...form.register('seats')} type="number" />
                      {form.formState.errors.seats && <p className="text-xs text-destructive">{form.formState.errors.seats.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="vpnStatus">Current Network Security</Label>
                      <select id="vpnStatus" {...form.register('vpnStatus')} className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
                        <option value="active">Using Legacy VPN</option>
                        <option value="replacing">In the process of replacing VPN</option>
                        <option value="none">Cloud Native / No VPN</option>
                      </select>
                    </div>
                    <div className="flex gap-2 pt-4">
                      <Button type="button" variant="outline" className="flex-1" onClick={() => setStep(0)}>Back</Button>
                      <Button type="button" className="flex-1 btn-gradient" onClick={nextStep}>Continue</Button>
                    </div>
                  </motion.div>
                )}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="flex items-start space-x-3 bg-muted/30 p-4 rounded-lg">
                      <Checkbox
                        id="consent"
                        className="mt-1"
                        onCheckedChange={(checked) => form.setValue('consentGiven', checked === true, { shouldValidate: true })}
                        checked={form.watch('consentGiven')}
                      />
                      <Label htmlFor="consent" className="text-sm leading-tight cursor-pointer">
                        I agree to receive the personalized ZTNA comparison and consent to be contacted by a security expert for a non-binding consultation.
                      </Label>
                    </div>
                    {form.formState.errors.consentGiven && <p className="text-xs text-destructive">{form.formState.errors.consentGiven.message}</p>}
                    <div className="flex gap-2">
                      <Button type="button" variant="outline" className="flex-1" onClick={() => setStep(1)}>Back</Button>
                      <Button type="submit" className="flex-1 btn-gradient" disabled={form.formState.isSubmitting}>
                        {form.formState.isSubmitting ? "Generating..." : "Get My Comparison"}
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