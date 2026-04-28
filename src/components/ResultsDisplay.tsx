import React, { useState } from 'react';
import type { PreventResults } from '../utils/calculations';

interface ResultsDisplayProps {
  results: PreventResults;
}

function fmt(n: number | null, dp: number): string {
  if (n === null) return '—';
  let s = n.toFixed(dp);
  if (dp === 1) s = s.replace(/\.0$/, '');
  if (dp === 2) s = s.replace(/\.00$/, '');
  return s;
}

function getRiskMetadata(val: number | null) {
  if (val === null) return { label: 'Awaiting Input', color: '#6b7280', text: 'text-gray-500' };
  if (val < 5)   return { label: 'Low Risk',          color: '#16a34a', text: 'text-emerald-500' };
  if (val < 7.5) return { label: 'Borderline Risk',   color: '#d97706', text: 'text-amber-500' };
  if (val < 20)  return { label: 'Intermediate Risk', color: '#ea580c', text: 'text-orange-500' };
  return              { label: 'High Risk',           color: '#dc2626', text: 'text-red-500' };
}

function getBmiCategory(bmi: number | null): { label: string; color: string } {
  if (bmi === null) return { label: '—', color: 'text-gray-500' };
  if (bmi < 18.5) return { label: 'Underweight', color: 'text-blue-400' };
  if (bmi < 25)   return { label: 'Normal',       color: 'text-emerald-400' };
  if (bmi < 30)   return { label: 'Overweight',   color: 'text-amber-400' };
  return               { label: 'Obese',          color: 'text-red-400' };
}

function getEgfrStage(egfr: number | null): { label: string; color: string } {
  if (egfr === null) return { label: '—', color: 'text-gray-500' };
  if (egfr >= 90) return { label: 'G1 — Normal',          color: 'text-emerald-400' };
  if (egfr >= 60) return { label: 'G2 — Mildly Decreased', color: 'text-emerald-400' };
  if (egfr >= 45) return { label: 'G3a — Mild–Moderate',  color: 'text-amber-400' };
  if (egfr >= 30) return { label: 'G3b — Moderate–Severe', color: 'text-orange-400' };
  if (egfr >= 15) return { label: 'G4 — Severely Decreased', color: 'text-red-400' };
  return              { label: 'G5 — Kidney Failure',      color: 'text-red-600' };
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results }) => {
  const [dp, setDp] = useState(1);
  const meta = getRiskMetadata(results.ascvd10);
  const bmiCat = getBmiCategory(results.bmi);
  const egfrStage = getEgfrStage(results.egfr);

  return (
    <div className="space-y-6">
      
      {/* 10-Year ASCVD Hero */}
      <div className="card-simple text-center relative overflow-hidden">
        <div 
          className="absolute top-0 left-0 w-full h-1" 
          style={{ backgroundColor: meta.color }} 
        />
        <label className="block text-[11px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-4">
          10-Year ASCVD Risk
        </label>
        <div className="flex items-baseline justify-center gap-1">
          <span className="text-[88px] font-black leading-none tracking-tighter" style={{ color: meta.color }}>
            {fmt(results.ascvd10, dp)}
          </span>
          <span className="text-2xl font-bold opacity-40">%</span>
        </div>
        <div className={`mt-4 inline-block px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-widest border border-white/5 bg-white/5`}>
          {meta.label}
        </div>
      </div>

      {/* Breakdown Bars */}
      <div className="card-simple space-y-6">
        <label className="block text-[11px] font-bold uppercase tracking-[0.2em] text-gray-500">
          Risk Breakdown
        </label>
        {[
          { label: 'ASCVD', value: results.ascvd10, color: '#4f46e5' },
          { label: 'Heart Failure', value: results.hf10, color: '#d97706' },
          { label: 'Total CVD', value: results.cvd10, color: '#dc2626' }
        ].map((item) => (
          <div key={item.label} className="space-y-2">
            <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest">
              <span className="text-gray-400">{item.label}</span>
              <span className="text-white">{fmt(item.value, dp)}%</span>
            </div>
            <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full transition-all duration-700"
                style={{ 
                  width: `${Math.min((item.value || 0) * 2, 100)}%`, 
                  backgroundColor: item.color 
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Metrics Grid */}
      <div className="grid-2">
        <div className="card-simple p-4">
          <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">BMI</label>
          <div className="text-xl font-bold">{fmt(results.bmi, dp)}</div>
          <div className={`text-[10px] font-bold uppercase mt-1 ${bmiCat.color}`}>{bmiCat.label}</div>
        </div>
        <div className="card-simple p-4">
          <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">eGFR</label>
          <div className="text-xl font-bold">{fmt(results.egfr, dp)}</div>
          <div className={`text-[10px] font-bold uppercase mt-1 ${egfrStage.color}`}>{egfrStage.label.split(' — ')[0]}</div>
        </div>
      </div>

      {/* 30-Year Assessment */}
      <div className="card-simple">
        <label className="block text-[11px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-4">
          30-Year Risk Assessment
        </label>
        {results.ascvd30 === null ? (
          <div className="text-[11px] font-medium text-amber-500/80 italic">
            Not calculated for age ≥ 60
          </div>
        ) : (
          <div className="grid-3">
            {[
              { label: 'ASCVD', val: results.ascvd30 },
              { label: 'HF', val: results.hf30 },
              { label: 'CVD', val: results.cvd30 }
            ].map((r) => (
              <div key={r.label} className="text-center">
                <div className="text-[10px] font-bold text-gray-600 mb-1">{r.label}</div>
                <div className="text-sm font-bold">{fmt(r.val, dp)}%</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Controls */}
      <div className="flex flex-col items-center gap-4 pt-2">
        <div className="flex gap-2">
          {[1, 2].map((n) => (
            <button
              key={n}
              onClick={() => setDp(n)}
              className={`px-3 py-1 rounded text-[10px] font-bold transition-all ${
                dp === n ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-500 hover:text-gray-300'
              }`}
            >
              .{'0'.repeat(n)}
            </button>
          ))}
        </div>
        <p className="text-[10px] text-gray-600 text-center uppercase tracking-widest leading-relaxed">
          Based on ACC/AHA 2023 PREVENT Equations<br/>
          For clinical decision support only
        </p>
      </div>
    </div>
  );
};

export default ResultsDisplay;
