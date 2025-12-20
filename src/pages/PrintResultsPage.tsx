import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { api } from '@/lib/api-client';
import type { ComparisonSnapshot } from '@shared/types';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, CartesianGrid, LabelList } from 'recharts';
import { format } from 'date-fns';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
export function PrintResultsPage() {
  const { id } = useParams();
  const { t } = useTranslation();
  const { data: snapshot, isLoading } = useQuery({
    queryKey: ['comparison', id],
    queryFn: () => api<ComparisonSnapshot>(`/api/comparison/${id}`),
  });
  useEffect(() => {
    if (snapshot) {
      const timer = setTimeout(() => {
        window.print();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [snapshot]);
  if (isLoading || !snapshot) return <div className="p-10 text-center">Preparing report...</div>;
  const sortedResults = [...snapshot.results].sort((a, b) => (b.scores?.totalScore ?? 0) - (a.scores?.totalScore ?? 0));
  const chartData = sortedResults.map(r => ({
    name: r.vendorName,
    tco: r.tcoYear1,
    id: r.vendorId
  }));
  return (
    <div className="bg-white min-h-screen">
      <Header className="print:hidden" />
      <div className="p-8 max-w-[21cm] mx-auto bg-white text-black print:p-0">
        <div className="flex justify-between items-end border-b-2 border-black pb-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold uppercase tracking-tighter">ZTNA Scout Report</h1>
            <p className="text-sm text-gray-600">Enterprise Security Comparison Matrix - {t('common.data_freshness')}</p>
          </div>
          <div className="text-right text-xs">
            <p>Generated: {format(snapshot.createdAt, 'PPP')}</p>
            <p className="font-bold">{t('common.data_freshness')}</p>
            <p>ID: {snapshot.id.slice(0, 8)}</p>
          </div>
        </div>
        <section className="mb-10">
          <h2 className="text-lg font-bold mb-4 border-l-4 border-black pl-3">Executive Summary</h2>
          <div className="grid grid-cols-3 gap-6 text-sm">
            <div className="bg-gray-50 p-4 border">
              <p className="text-gray-500 uppercase text-[10px] font-bold">User Seats</p>
              <p className="text-xl font-bold">{snapshot.inputs.seats}</p>
            </div>
            <div className="bg-gray-50 p-4 border col-span-2">
              <p className="text-gray-500 uppercase text-[10px] font-bold">Top Recommendation</p>
              <p className="text-xl font-bold">{sortedResults[0]?.vendorName} (Score: {sortedResults[0]?.scores?.totalScore})</p>
            </div>
          </div>
        </section>
        <section className="mb-10">
          <h2 className="text-lg font-bold mb-4 border-l-4 border-black pl-3">Total Cost Analysis (Year 1)</h2>
          <div className="h-[450px] w-full border p-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical" margin={{ left: 140, right: 80, top: 10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  width={140} 
                  tick={{ fontSize: 10, fontWeight: 'bold', fill: '#000' }} 
                />
                <Bar dataKey="tco" barSize={24}>
                  {chartData.map((entry, index) => (
                    <Cell key={index} fill={entry.id === 'cloudflare' ? '#000' : '#666'} />
                  ))}
                  <LabelList 
                    dataKey="tco" 
                    position="right" 
                    formatter={(v: number) => `€${v.toLocaleString()}`} 
                    style={{ fontSize: 10, fontWeight: 'bold' }} 
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[10px] text-gray-500 mt-2 italic">* TCO includes license estimates and a standardized €4,000 implementation fee.</p>
        </section>
        <section>
          <h2 className="text-lg font-bold mb-4 border-l-4 border-black pl-3">Detailed Scoring Matrix</h2>
          <table className="w-full text-[10px] border-collapse">
            <thead>
              <tr className="bg-black text-white">
                <th className="p-2 text-left border">Vendor</th>
                <th className="p-2 text-center border">Price Score</th>
                <th className="p-2 text-center border">Feature Score</th>
                <th className="p-2 text-center border font-bold">Total Score</th>
              </tr>
            </thead>
            <tbody>
              {sortedResults.map((r) => (
                <tr key={r.vendorId} className="border-b">
                  <td className="p-2 font-bold border">{r.vendorName}</td>
                  <td className="p-2 text-center border">{r.scores?.priceScore}</td>
                  <td className="p-2 text-center border">{r.scores?.featureScore}</td>
                  <td className="p-2 text-center border font-bold bg-gray-50">{r.scores?.totalScore}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
      <Footer className="mt-auto border-none" />
    </div>
  );
}