import React, { useEffect, useState, useMemo } from 'react';
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
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  const { data: snapshot, isLoading } = useQuery({
    queryKey: ['comparison', id],
    queryFn: () => api<ComparisonSnapshot>(id === 'sample' || id === 'demo' ? '/api/sample-comparison' : `/api/comparison/${id}`),
  });
  useEffect(() => {
    if (snapshot && mounted) {
      const timer = setTimeout(() => {
        window.print();
      }, 2500); 
      return () => clearTimeout(timer);
    }
  }, [snapshot, mounted]);
  const sortedResults = useMemo(() => {
    if (!snapshot) return [];
    return [...snapshot.results].sort((a, b) => (b.scores?.totalScore ?? 0) - (a.scores?.totalScore ?? 0));
  }, [snapshot]);
  if (isLoading || !snapshot) return (
    <div className="min-h-screen flex items-center justify-center font-sans">
      <div className="text-center space-y-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Preparing Analysis Report...</p>
      </div>
    </div>
  );
  const chartData = sortedResults.map(r => ({
    name: r.vendorName,
    tco: r.tcoYear1,
    id: r.vendorId
  }));
  return (
    <div className="bg-white min-h-screen font-sans selection:bg-transparent">
      <Header className="print:hidden" />
      <div className="p-10 max-w-[21cm] mx-auto bg-white text-black print:p-0 print:m-0">
        <div className="flex justify-between items-end border-b-2 border-black pb-4 mb-8">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold uppercase tracking-tighter">{t('results.print.title')}</h1>
            <p className="text-[10px] text-gray-500 uppercase font-mono">{t('results.print.tagline')}</p>
          </div>
          <div className="text-right text-[10px] leading-tight font-mono">
            <p className="font-bold">{t('results.meta.rid')}: {snapshot.id.slice(0, 8).toUpperCase()}</p>
            <p>{t('results.meta.generated')}: {formatDate(snapshot.createdAt, i18n.language)}</p>
          </div>
        </div>
        <section className="mb-10">
          <h2 className="text-base font-bold mb-4 border-l-4 border-black pl-3 uppercase tracking-tight">{t('results.print.summary')}</h2>
          <div className="grid grid-cols-3 gap-6 text-sm">
            <div className="bg-gray-50 p-5 border border-gray-200 rounded-sm shadow-sm">
              <p className="text-gray-500 uppercase text-[9px] font-bold mb-1">{t('results.print.seats')}</p>
              <p className="text-xl font-bold">{snapshot.inputs.seats}</p>
            </div>
            <div className="bg-gray-100 p-5 border border-gray-200 col-span-2 rounded-sm shadow-sm">
              <p className="text-gray-500 uppercase text-[9px] font-bold mb-1">{t('results.print.top_recommendation')}</p>
              <p className="text-xl font-bold">{sortedResults[0]?.vendorName} ({t('results.matrix.total_score')}: {sortedResults[0]?.scores?.totalScore})</p>
            </div>
          </div>
        </section>
        <section className="mb-12">
          <h2 className="text-base font-bold mb-4 border-l-4 border-black pl-3 uppercase tracking-tight">{t('results.tco_title')}</h2>
          <div className="w-full h-[550px] border border-gray-200 p-8 bg-white rounded-sm min-h-[550px]">
            {mounted && (
              <ResponsiveContainer width="99.9%" height="100%" minHeight={550} aspect={undefined}>
                <BarChart data={chartData} layout="vertical" margin={{ left: 160, right: 110, top: 10, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                  <XAxis type="number" hide />
                  <YAxis
                    dataKey="name"
                    type="category"
                    width={150}
                    tick={{ fontSize: 10, fontWeight: 'bold', fill: '#000' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Bar dataKey="tco" barSize={22} radius={[0, 4, 4, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={index} fill={entry.id === 'cloudflare' ? '#F48120' : '#1E293B'} />
                    ))}
                    <LabelList
                      dataKey="tco"
                      position="right"
                      offset={12}
                      formatter={(v: number) => formatCurrency(v, i18n.language)}
                      style={{ fontSize: 10, fontWeight: 'bold', fill: '#000', fontFamily: 'Inter, sans-serif' }}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
          <div className="mt-4 p-5 bg-gray-50 border border-gray-100 italic text-[10px] text-gray-500 leading-relaxed rounded-sm">
             <p className="font-bold mb-2 underline tracking-widest uppercase">{t('results.print.transparency_title')}</p>
             <p>{t('results.print.transparency_desc')}</p>
          </div>
        </section>
        <section className="break-inside-avoid">
          <h2 className="text-base font-bold mb-4 border-l-4 border-black pl-3 uppercase tracking-tight">{t('results.matrix.title')}</h2>
          <table className="w-full text-[10px] border-collapse border border-gray-200 shadow-sm">
            <thead>
              <tr className="bg-black text-white">
                <th className="p-4 text-left border border-black uppercase tracking-widest font-bold">Vendor</th>
                <th className="p-4 text-center border border-black uppercase tracking-widest font-bold">{t('results.matrix.market_rank')}</th>
                <th className="p-4 text-center border border-black uppercase tracking-widest font-bold">{t('results.matrix.price_score')}</th>
                <th className="p-4 text-center border border-black uppercase tracking-widest font-bold">{t('results.matrix.feature_score')}</th>
                <th className="p-4 text-center border border-black uppercase tracking-widest font-bold">{t('results.matrix.total_score')}</th>
              </tr>
            </thead>
            <tbody>
              {sortedResults.map((r, i) => (
                <tr key={r.vendorId} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="p-4 font-bold border border-gray-200">{r.vendorName}</td>
                  <td className="p-4 text-center border border-gray-200 font-medium">{getRankLabel(i + 1, t)}</td>
                  <td className="p-4 text-center border border-gray-200">{r.scores?.priceScore}</td>
                  <td className="p-4 text-center border border-gray-200">{r.scores?.featureScore}</td>
                  <td className="p-4 text-center border border-gray-200 font-bold bg-gray-100">{r.scores?.totalScore}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
      <Footer className="mt-20 border-none bg-transparent print:bg-white print:py-10" />
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body { background: white !important; -webkit-print-color-adjust: exact; }
          .print\\:hidden { display: none !important; }
          @page { size: A4; margin: 1cm; }
          .text-primary { color: #F48120 !important; }
        }
      `}} />
    </div>
  );
}