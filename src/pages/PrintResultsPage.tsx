import React, { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { api } from '@/lib/api-client';
import type { ComparisonSnapshot } from '@shared/types';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, CartesianGrid, LabelList } from 'recharts';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { formatDate, getRankLabel, formatCurrency } from '@/lib/utils';
export function PrintResultsPage() {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const { data: snapshot, isLoading } = useQuery({
    queryKey: ['comparison', id],
    queryFn: () => api<ComparisonSnapshot>(id === 'sample' ? '/api/sample-comparison' : `/api/comparison/${id}`),
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
        {/* Header Block */}
        <div className="flex justify-between items-end border-b-2 border-black pb-4 mb-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold uppercase tracking-tighter">{t('results.print.title')}</h1>
            <p className="text-[10px] text-gray-500 uppercase font-mono">{t('results.print.tagline')}</p>
          </div>
          <div className="text-right text-[10px] leading-tight font-mono">
            <p>{t('results.meta.rid')}: {snapshot.id.slice(0, 8)}</p>
            <p>{t('results.meta.generated')}: {formatDate(snapshot.createdAt, i18n.language)}</p>
          </div>
        </div>
        {/* Executive Summary */}
        <section className="mb-8">
          <h2 className="text-base font-bold mb-3 border-l-4 border-black pl-3 uppercase tracking-tight">{t('results.print.summary')}</h2>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="bg-gray-50 p-3 border border-gray-200">
              <p className="text-gray-500 uppercase text-[9px] font-bold mb-1">{t('results.print.seats')}</p>
              <p className="text-lg font-bold">{snapshot.inputs.seats}</p>
            </div>
            <div className="bg-gray-100 p-3 border border-gray-200 col-span-2">
              <p className="text-gray-500 uppercase text-[9px] font-bold mb-1">{t('results.print.top_recommendation')}</p>
              <p className="text-lg font-bold">{sortedResults[0]?.vendorName} (Score: {sortedResults[0]?.scores?.totalScore})</p>
            </div>
          </div>
        </section>
        {/* TCO Chart */}
        <section className="mb-8">
          <h2 className="text-base font-bold mb-3 border-l-4 border-black pl-3 uppercase tracking-tight">{t('results.tco_title')}</h2>
          <div className="w-full h-[500px] border border-gray-200 p-4 bg-white">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical" margin={{ left: 160, right: 100, top: 10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#eee" />
                <XAxis type="number" hide />
                <YAxis
                  dataKey="name"
                  type="category"
                  width={150}
                  tick={{ fontSize: 9, fontWeight: 'bold', fill: '#000' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Bar dataKey="tco" barSize={20} radius={[0, 4, 4, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={index} fill={entry.id === 'cloudflare' ? '#000' : (index % 2 === 0 ? '#444' : '#888')} />
                  ))}
                  <LabelList
                    dataKey="tco"
                    position="right"
                    offset={10}
                    formatter={(v: number) => formatCurrency(v, i18n.language)}
                    style={{ fontSize: 8, fontWeight: 'bold', fill: '#000' }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 p-3 bg-gray-50 border border-gray-100 italic text-[8px] text-gray-500 leading-relaxed">
             <p className="font-bold mb-1 underline">{t('results.print.transparency_title')}</p>
             <p>{t('results.print.transparency_desc')}</p>
          </div>
        </section>
        {/* Comparison Table */}
        <section className="break-inside-avoid">
          <h2 className="text-base font-bold mb-3 border-l-4 border-black pl-3 uppercase tracking-tight">{t('results.matrix.title')}</h2>
          <table className="w-full text-[9px] border-collapse border border-gray-200">
            <thead>
              <tr className="bg-black text-white">
                <th className="p-2 text-left border border-black uppercase tracking-widest">Vendor</th>
                <th className="p-2 text-center border border-black uppercase tracking-widest">{t('results.matrix.market_rank')}</th>
                <th className="p-2 text-center border border-black uppercase tracking-widest">{t('results.matrix.price_score')}</th>
                <th className="p-2 text-center border border-black uppercase tracking-widest">{t('results.matrix.feature_score')}</th>
                <th className="p-2 text-center border border-black uppercase tracking-widest font-bold">{t('results.matrix.total_score')}</th>
              </tr>
            </thead>
            <tbody>
              {sortedResults.map((r, i) => (
                <tr key={r.vendorId} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="p-2 font-bold border border-gray-200">{r.vendorName}</td>
                  <td className="p-2 text-center border border-gray-200">{getRankLabel(i + 1, t)}</td>
                  <td className="p-2 text-center border border-gray-200">{r.scores?.priceScore}</td>
                  <td className="p-2 text-center border border-gray-200">{r.scores?.featureScore}</td>
                  <td className="p-2 text-center border border-gray-200 font-bold bg-gray-100">{r.scores?.totalScore}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
      <Footer className="mt-8 border-none bg-transparent" />
    </div>
  );
}