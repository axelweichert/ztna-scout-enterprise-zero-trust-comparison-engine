import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import type { ComparisonSnapshot } from '@shared/types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, Printer, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
export function ResultsPage() {
  const { id } = useParams();
  const { data: snapshot, isLoading } = useQuery({
    queryKey: ['comparison', id],
    queryFn: () => api<ComparisonSnapshot>(`/api/comparison/${id}`)
  });
  if (isLoading) return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <Skeleton className="h-48 w-full" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Skeleton className="h-64" />
        <Skeleton className="h-64" />
        <Skeleton className="h-64" />
      </div>
    </div>
  );
  if (!snapshot) return <div>Comparison not found.</div>;
  const sortedResults = [...snapshot.results].sort((a, b) => b.scores.totalScore - a.scores.totalScore);
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 lg:py-12">
      <div className="flex justify-between items-center mb-8">
        <Button variant="ghost" asChild>
          <Link to="/"><ArrowLeft className="mr-2 h-4 w-4" /> New Search</Link>
        </Button>
        <Button variant="outline" onClick={() => window.print()}>
          <Printer className="mr-2 h-4 w-4" /> Export PDF
        </Button>
      </div>
      <div className="space-y-12">
        <section>
          <h2 className="text-3xl font-display font-bold mb-6">TCO Comparison (Year 1)</h2>
          <Card className="p-6">
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sortedResults} layout="vertical" margin={{ left: 40, right: 20 }}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="vendorName" type="category" width={100} tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(value: number) => [`€${value.toLocaleString()}`, 'TCO Year 1']} />
                  <Bar dataKey="tcoYear1" radius={[0, 4, 4, 0]}>
                    {sortedResults.map((entry, index) => (
                      <Cell key={index} fill={entry.vendorId === 'cloudflare' ? '#F48120' : '#1E293B'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </section>
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedResults.map((result) => (
            <Card key={result.vendorId} className={result.vendorId === 'cloudflare' ? 'border-primary ring-1 ring-primary/20' : ''}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{result.vendorName}</CardTitle>
                  <Badge variant={result.scores.totalScore > 80 ? "default" : "secondary"}>
                    Score: {result.scores.totalScore}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-2xl font-bold">€{result.tcoYear1.toLocaleString()}</div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Compliance</span>
                    {result.features.isBSIQualified ? (
                      <span className="text-green-600 flex items-center font-medium">
                        <ShieldCheck className="w-4 h-4 mr-1" /> BSI Qualified
                      </span>
                    ) : (
                      <span className="text-muted-foreground italic">Standard</span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {result.features.hasZTNA && <Badge variant="outline" className="text-[10px]">ZTNA</Badge>}
                    {result.features.hasSWG && <Badge variant="outline" className="text-[10px]">SWG</Badge>}
                    {result.features.hasCASB && <Badge variant="outline" className="text-[10px]">CASB</Badge>}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>
      </div>
    </div>
  );
}