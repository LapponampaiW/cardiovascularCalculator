import React, { useState } from 'react';
import type { PreventResults } from '../utils/calculations';

interface ResultsDisplayProps {
  results: PreventResults;
  age: number;
}

function fmt(n: number | null, dp: number): string {
  if (n === null) return '—';
  let s = n.toFixed(dp);
  if (dp === 1) s = s.replace(/\.0$/, '');
  if (dp === 2) s = s.replace(/\.00$/, '');
  return s;
}

function getAscvdRisk(val: number | null): { label: string; textColor: string; barColor: string; bgColor: string } {
  if (val === null) return { label: 'Awaiting input', textColor: 'text-slate-400', barColor: 'bg-slate-300', bgColor: 'bg-slate-50 border-slate-200' };
  if (val < 5)   return { label: 'Low Risk',          textColor: 'text-emerald-600', barColor: 'bg-emerald-400', bgColor: 'bg-emerald-50 border-emerald-200' };
  if (val < 7.5) return { label: 'Borderline Risk',   textColor: 'text-yellow-600',  barColor: 'bg-yellow-400',  bgColor: 'bg-yellow-50 border-yellow-200' };
  if (val < 20)  return { label: 'Intermediate Risk', textColor: 'text-orange-600',  barColor: 'bg-orange-400',  bgColor: 'bg-orange-50 border-orange-200' };
  return              { label: 'High Risk',           textColor: 'text-red-600',     barColor: 'bg-red-400',     bgColor: 'bg-red-50 border-red-200' };
}

function getBmiCategory(bmi: number | null): { label: string; color: string } {
  if (bmi === null) return { label: '—', color: 'text-slate-400' };
  if (bmi < 18.5) return { label: 'Underweight', color: 'text-blue-500' };
  if (bmi < 25)   return { label: 'Normal',       color: 'text-emerald-600' };
  if (bmi < 30)   return { label: 'Overweight',   color: 'text-amber-500' };
  return               { label: 'Obese',          color: 'text-red-500' };
}

function getEgfrStage(egfr: number | null): { label: string; color: string } {
  if (egfr === null) return { label: '—', color: 'text-slate-400' };
  if (egfr >= 90) return { label: 'G1 — Normal',          color: 'text-emerald-600' };
  if (egfr >= 60) return { label: 'G2 — Mildly decreased', color: 'text-emerald-600' };
  if (egfr >= 45) return { label: 'G3a — Mild–moderate',  color: 'text-amber-500' };
  if (egfr >= 30) return { label: 'G3b — Moderate–severe', color: 'text-orange-500' };
  if (egfr >= 15) return { label: 'G4 — Severely decreased', color: 'text-red-500' };
  return              { label: 'G5 — Kidney failure',      color: 'text-red-700' };
}

interface RiskBarProps {
  label: string;
  value: number | null;
  dp: number;
  maxVal?: number;
}

const RiskBar: React.FC<RiskBarProps> = ({ label, value, dp, maxVal = 40 }) => {
  const pct = value !== null ? Math.min((value / maxVal) * 100, 100) : 0;
  const risk = getAscvdRisk(value);
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-sm font-semibold text-slate-500">{label}</span>
        <div className="flex items-baseline gap-0.5">
          <span className={`text-2xl font-black tabular-nums ${risk.textColor}`}>
            {fmt(value, dp)}
          </span>
          {value !== null && <span className="text-sm font-bold text-slate-400">%</span>}
        </div>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${risk.barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className={`text-xs font-bold uppercase tracking-wider ${risk.textColor}`}>
        {risk.label}
      </span>
    </div>
  );
};

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results, age }) => {
  const [dp, setDp] = useState(1);
  const primaryRisk = getAscvdRisk(results.ascvd10);
  const bmiCat  = getBmiCategory(results.bmi);
  const egfrStage = getEgfrStage(results.egfr);
  const hasResults = results.ascvd10 !== null;

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <h2 className="text-xl font-black text-slate-800">Results</h2>
        {hasResults && (
          <span className={`text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border ${
            results.modelType === 'addon'
              ? 'text-indigo-600 bg-indigo-50 border-indigo-200'
              : 'text-slate-500 bg-slate-100 border-slate-200'
          }`}>
            {results.modelType === 'addon' ? 'Add-on model' : 'Base model'}
          </span>
        )}
      </div>

      {/* Validation errors */}
      {results.errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 space-y-1">
          {results.errors.map((e, i) => (
            <p key={i} className="text-sm font-semibold text-red-600">{e}</p>
          ))}
        </div>
      )}

      {/* Primary ASCVD Risk Card */}
      <div className={`rounded-2xl p-5 border-2 ${primaryRisk.bgColor}`}>
        <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">
          10-Year ASCVD Risk
        </p>
        <div className="flex items-end justify-between">
          <div>
            <span className={`text-6xl font-black tabular-nums leading-none ${primaryRisk.textColor}`}>
              {fmt(results.ascvd10, dp)}
            </span>
            {results.ascvd10 !== null && (
              <span className={`text-2xl font-bold ml-1 ${primaryRisk.textColor}`}>%</span>
            )}
          </div>
          <span className={`text-sm font-black uppercase tracking-wide ${primaryRisk.textColor} px-4 py-2 bg-white/60 rounded-xl`}>
            {primaryRisk.label}
          </span>
        </div>
      </div>

      {/* 10-Year Risk Breakdown */}
      <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-5">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-3">
          10-Year Risk Breakdown
        </h3>
        <RiskBar label="ASCVD Risk"        value={results.ascvd10} dp={dp} />
        <RiskBar label="Heart Failure Risk" value={results.hf10}    dp={dp} />
        <RiskBar label="Total CVD Risk"     value={results.cvd10}   dp={dp} maxVal={50} />
      </div>

      {/* Clinical Metrics */}
      <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-3 mb-4">
          Clinical Metrics
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-50 rounded-xl p-4">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">BMI</p>
            <p className="text-2xl font-black text-slate-800">{fmt(results.bmi, dp)}</p>
            <p className="text-xs font-bold text-slate-400 mb-2">kg/m²</p>
            <span className={`text-xs font-bold ${bmiCat.color}`}>{bmiCat.label}</span>
          </div>
          <div className="bg-slate-50 rounded-xl p-4">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">eGFR</p>
            <p className="text-2xl font-black text-slate-800">{fmt(results.egfr, dp)}</p>
            <p className="text-xs font-bold text-slate-400 mb-2">mL/min/1.73m²</p>
            <span className={`text-xs font-bold ${egfrStage.color}`}>{egfrStage.label}</span>
          </div>
        </div>
      </div>

      {/* 30-Year Risk */}
      <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-3 mb-4">
          30-Year Risk Assessment
        </h3>
        {age >= 60 ? (
          <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
            <span className="text-amber-500 text-lg mt-0.5">⚠</span>
            <p className="text-sm font-semibold text-amber-700">
              30-year risks are not calculated for patients ≥60 years old.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'ASCVD',         val: results.ascvd30 },
              { label: 'Heart Failure', val: results.hf30 },
              { label: 'Total CVD',     val: results.cvd30 },
            ].map(({ label, val }) => {
              const r = getAscvdRisk(val);
              return (
                <div key={label} className="bg-slate-50 rounded-xl p-3 text-center">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">{label}</p>
                  <div className="flex items-baseline justify-center gap-0.5">
                    <span className={`text-xl font-black ${r.textColor}`}>{fmt(val, dp)}</span>
                    {val !== null && <span className="text-sm font-bold text-slate-400">%</span>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Decimal precision */}
      <div className="flex justify-center items-center gap-3">
        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Precision</label>
        <select
          value={dp}
          onChange={e => setDp(Number(e.target.value))}
          className="bg-white border-2 border-slate-200 rounded-xl text-sm font-bold text-slate-600 px-3 py-1.5 outline-none hover:border-blue-300 focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer"
        >
          <option value={1}>1 decimal</option>
          <option value={2}>2 decimals</option>
        </select>
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-slate-400 text-center leading-relaxed px-2">
        Based on ACC/AHA 2023 PREVENT Equations. For clinical decision support only.
      </p>
    </div>
  );
};

export default ResultsDisplay;
