import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import type { ComparisonSnapshot } from '@shared/types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, Printer, ArrowLeft, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
export function ResultsPage() {
  const { id } = useParams();
  const { data: snapshot, isLoading, error } = useQuery({
    queryKey: ['comparison', id],
    queryFn: () => api<ComparisonSnapshot>(`/api/comparison/${id}`),
    retry: 1
  });
  if (isLoading) return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="flex justify-between items-center">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-32" />
      </div>
      <Skeleton className="h-64 w-full" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Skeleton className="h-48" />
        <Skeleton className="h-48" />
        <Skeleton className="h-48" />
      </div>
    </div>
  );
  if (error || !snapshot) return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
      <h2 className="text-2xl font-bold mb-4">Comparison Not Found</h2>
      <p className="text-muted-foreground mb-8">The requested comparison ID may be invalid or expired.</p>
      <Button asChild><Link to="/">Go Back Home</Link></Button>
    </div>
  );
  const sortedResults = [...snapshot.results].sort((a, b) => b.scores.totalScore - a.scores.totalScore);
  const chartData = sortedResults.map(r => ({
    name: r.vendorName,
    tco: r.tcoYear1,
    id: r.vendorId
  }));
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12 space-y-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-6">
          <div>
            <h1 className="text-3xl font-display font-bold">Your ZTNA Comparison</h1>
            <p className="text-muted-foreground">Based on {snapshot.inputs.seats} seats and enterprise feature requirements.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild className="hidden sm:flex">
              <Link to="/"><ArrowLeft className="mr-2 h-4 w-4" /> New Search</Link>
            </Button>
            <Button variant="default" size="sm" onClick={() => window.print()} className="bg-[#F48120] hover:bg-[#E55A1B] text-white">
              <Printer className="mr-2 h-4 w-4" /> Export PDF
            </Button>
          </div>
        </div>
        <section className="space-y-6">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold">Estimated TCO (Year 1)</h2>
            <Badge variant="outline" className="font-normal text-muted-foreground">Incl. €4k Setup</Badge>
          </div>
          <Card className="p-6">
            <div className="h-[450px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} layout="vertical" margin={{ left: 60, right: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} opacity={0.3} />
                  <XAxis type="number" hide />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    width={120} 
                    tick={{ fontSize: 11, fontWeight: 500 }} 
                  />
                  <Tooltip 
                    cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                    formatter={(value: number) => [`€${value.toLocaleString()}`, '1-Year TCO']} 
                  />
                  <Bar dataKey="tco" radius={[0, 4, 4, 0]} barSize={24}>
                    {chartData.map((entry, index) => (
                      <Cell key={index} fill={entry.id === 'cloudflare' ? '#F48120' : '#1E293B'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </section>
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedResults.map((result) => (
            <Card key={result.vendorId} className={result.vendorId === 'cloudflare' ? 'border-[#F48120] shadow-md ring-1 ring-[#F48120]/20' : 'shadow-sm'}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{result.vendorName}</CardTitle>
                    <CardDescription>Enterprise ZTNA</CardDescription>
                  </div>
                  <div className="text-right">
                    <Badge variant={result.scores.totalScore > 80 ? "default" : "secondary"} className={result.scores.totalScore > 80 ? "bg-green-600" : ""}>
                      Score: {result.scores.totalScore}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col">
                  <span className="text-2xl font-bold">€{result.tcoYear1.toLocaleString()}</span>
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Total Cost Year 1</span>
                </div>
                <div className="pt-2 border-t space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Compliance</span>
                    {result.features.isBSIQualified ? (
                      <span className="text-green-600 flex items-center font-semibold text-xs">
                        <ShieldCheck className="w-3.5 h-3.5 mr-1" /> BSI QUALIFIED
                      </span>
                    ) : (
                      <span className="text-muted-foreground italic text-xs">Compliant</span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {result.features.hasZTNA && <Badge variant="secondary" className="text-[9px] h-5 px-1.5">ZTNA</Badge>}
                    {result.features.hasSWG && <Badge variant="secondary" className="text-[9px] h-5 px-1.5">SWG</Badge>}
                    {result.features.hasCASB && <Badge variant="secondary" className="text-[9px] h-5 px-1.5">CASB</Badge>}
                    {result.features.hasFWaaS && <Badge variant="secondary" className="text-[9px] h-5 px-1.5">FWaaS</Badge>}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>
        <div className="bg-muted/30 rounded-xl p-6 border flex gap-4">
          <Info className="h-5 w-5 text-muted-foreground shrink-0 mt-1" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            <strong>Disclaimer:</strong> Prices are estimates based on market research and public list prices where available. 
            Final pricing for enterprise agreements (EA) often includes significant discounts. 
            Installation fees are standardized at €4,000 for calculation purposes unless otherwise noted.
          </p>
        </div>
      </div>
    </div>
  );
}