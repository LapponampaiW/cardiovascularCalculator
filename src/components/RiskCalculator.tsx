import React, { useState, useMemo } from 'react';
import InputRow from './InputRow';
import RadioRow from './RadioRow';
import ResultsDisplay from './ResultsDisplay';
import { calculatePrevent } from '../utils/calculations';

const RiskCalculator: React.FC = () => {
  const [inputs, setInputs] = useState({
    age: '70',
    ageUnit: 'yr',
    sex: 'Female',
    height: '160',
    heightUnit: 'cm',
    weight: '70',
    weightUnit: 'kg',
    totalChol: '220',
    totalCholUnit: 'mg/dL',
    hdlChol: '40',
    hdlCholUnit: 'mg/dL',
    systolicBP: '170',
    systolicBPUnit: 'mmHg',
    creatinine: '0.9',
    creatinineUnit: 'mg/dL',
    onHypertensionMed: 'No',
    onStatin: 'Yes',
    hasDiabetes: 'Yes',
    isSmoking: 'Yes',
    hbA1c: '7',
    hbA1cUnit: '%',
    uacr: '1.2',
    uacrUnit: 'mg/g',
    zipCode: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  const results = useMemo(() => calculatePrevent(inputs), [inputs]);

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-blue-100">

      {/* Top Nav Bar */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/80 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
              <svg width="16" height="16" className="text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <span className="text-sm font-black text-slate-700 tracking-tight">CardioRisk</span>
          </div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">ACC/AHA 2023</span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">

        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-black tracking-tight text-slate-900">
            Cardiovascular{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">
              Risk Assessment
            </span>
          </h1>
          <p className="mt-1.5 text-base text-slate-500 font-medium">
            10-year and 30-year primary prevention calculator
          </p>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">

          {/* Left: Form */}
          <div className="xl:col-span-7 space-y-6">

            {/* Patient Profile */}
            <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100 bg-slate-50/60">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h2 className="text-base font-bold text-slate-700">Patient Profile</h2>
              </div>
              <div className="px-6 py-2">
                <InputRow label="Age" name="age" value={inputs.age} onChange={handleInputChange} units={['yr']} unitValue={inputs.ageUnit} />
                <RadioRow label="Biological Sex" name="sex" value={inputs.sex} options={[{ label: 'Female', value: 'Female' }, { label: 'Male', value: 'Male' }]} onChange={handleInputChange} />
                <InputRow label="Height" name="height" value={inputs.height} onChange={handleInputChange} units={['cm', 'in']} unitValue={inputs.heightUnit} />
                <InputRow label="Weight" name="weight" value={inputs.weight} onChange={handleInputChange} units={['kg', 'lb']} unitValue={inputs.weightUnit} />
              </div>
            </section>

            {/* Clinical Data */}
            <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100 bg-slate-50/60">
                <div className="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center text-rose-500">
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h2 className="text-base font-bold text-slate-700">Clinical Data</h2>
              </div>
              <div className="px-6 py-2">
                <InputRow label="Total Cholesterol" name="totalChol" value={inputs.totalChol} onChange={handleInputChange} units={['mg/dL', 'mmol/L']} unitValue={inputs.totalCholUnit} />
                <InputRow label="HDL Cholesterol" name="hdlChol" value={inputs.hdlChol} onChange={handleInputChange} units={['mg/dL', 'mmol/L']} unitValue={inputs.hdlCholUnit} />
                <InputRow label="Systolic BP" name="systolicBP" value={inputs.systolicBP} onChange={handleInputChange} units={['mmHg']} unitValue={inputs.systolicBPUnit} />
                <InputRow label="Serum Creatinine" name="creatinine" value={inputs.creatinine} onChange={handleInputChange} units={['mg/dL', 'μmol/L']} unitValue={inputs.creatinineUnit} />
              </div>
            </section>

            {/* Medical History */}
            <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100 bg-slate-50/60">
                <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600">
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h2 className="text-base font-bold text-slate-700">Medical History</h2>
              </div>
              <div className="px-6 py-2">
                <RadioRow label="On Hypertension Meds" name="onHypertensionMed" value={inputs.onHypertensionMed} options={[{ label: 'No', value: 'No' }, { label: 'Yes', value: 'Yes' }]} onChange={handleInputChange} />
                <RadioRow label="On Statin Therapy" name="onStatin" value={inputs.onStatin} options={[{ label: 'No', value: 'No' }, { label: 'Yes', value: 'Yes' }]} onChange={handleInputChange} />
                <RadioRow label="Diabetes" name="hasDiabetes" value={inputs.hasDiabetes} options={[{ label: 'No', value: 'No' }, { label: 'Yes', value: 'Yes' }]} onChange={handleInputChange} />
                <RadioRow label="Current Smoking" name="isSmoking" value={inputs.isSmoking} options={[{ label: 'No', value: 'No' }, { label: 'Yes', value: 'Yes' }]} onChange={handleInputChange} />
              </div>
            </section>

            {/* Optional Novel Risk Factors */}
            <section className="bg-indigo-50/50 rounded-2xl border border-indigo-100 shadow-sm overflow-hidden">
              <div className="flex items-center gap-3 px-6 py-4 border-b border-indigo-100">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600">
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-base font-bold text-indigo-900">Optional Novel Risk Factors</h2>
                  <p className="text-xs font-medium text-indigo-500 mt-0.5">AHA 2023 add-on model</p>
                </div>
              </div>
              <div className="px-6 py-2">
                <InputRow label="HbA1C Level" name="hbA1c" value={inputs.hbA1c} onChange={handleInputChange} units={['%']} unitValue={inputs.hbA1cUnit} />
                <InputRow label="UACR Ratio" name="uacr" value={inputs.uacr} onChange={handleInputChange} units={['mg/g']} unitValue={inputs.uacrUnit} />
                <div className="flex flex-col sm:flex-row sm:items-center justify-between py-4 gap-3 sm:gap-6">
                  <label className="text-base font-semibold text-slate-600 flex-1">US Zip Code</label>
                  <input
                    type="text"
                    name="zipCode"
                    placeholder="e.g. 90210"
                    value={inputs.zipCode}
                    onChange={handleInputChange}
                    className="w-full sm:w-28 px-3 py-2.5 border-2 border-slate-200 rounded-xl text-base font-bold text-slate-800 bg-white transition-all duration-200 hover:border-blue-300 focus:outline-none focus:ring-3 focus:ring-blue-500/20 focus:border-blue-500 placeholder:text-slate-300"
                  />
                </div>
              </div>
            </section>

          </div>

          {/* Right: Results (Sticky) */}
          <div className="xl:col-span-5">
            <div className="sticky top-20">
              <ResultsDisplay results={results} age={parseInt(inputs.age) || 0} />
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default RiskCalculator;
