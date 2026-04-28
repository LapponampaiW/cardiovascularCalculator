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
    <div className="min-h-screen">
      
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 px-6 h-14 bg-[#0d0f18]/90 backdrop-blur-md border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-indigo-600 flex items-center justify-center text-[10px] font-black italic">CR</div>
          <span className="text-sm font-black text-white tracking-widest uppercase antialiased">CardioRisk PREVENT</span>
        </div>
        <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">ACC/AHA 2023</div>
      </header>

      <main className="max-w-5xl mx-auto p-6 md:p-10">
        <div className="layout-2col">
          
          {/* Left: Inputs */}
          <div className="space-y-6">
            
            <section className="space-y-4">
              <label className="block text-[11px] font-black uppercase tracking-[0.2em] text-indigo-400">Patient Profile</label>
              <div className="card-simple space-y-4">
                <RadioRow 
                  label="Biological Sex" 
                  name="sex" 
                  value={inputs.sex} 
                  options={[{ label: 'Female', value: 'Female' }, { label: 'Male', value: 'Male' }]} 
                  onChange={handleInputChange} 
                />
                <div className="grid-2">
                  <InputRow label="Age" name="age" value={inputs.age} onChange={handleInputChange} units={['yr']} unitValue={inputs.ageUnit} />
                  <InputRow label="Zip Code" name="zipCode" value={inputs.zipCode} onChange={handleInputChange} placeholder="Optional" />
                </div>
                <div className="grid-2">
                  <InputRow label="Height" name="height" value={inputs.height} onChange={handleInputChange} units={['cm', 'in']} unitValue={inputs.heightUnit} />
                  <InputRow label="Weight" name="weight" value={inputs.weight} onChange={handleInputChange} units={['kg', 'lb']} unitValue={inputs.weightUnit} />
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <label className="block text-[11px] font-black uppercase tracking-[0.2em] text-indigo-400">Clinical Measurements</label>
              <div className="card-simple space-y-4">
                <div className="grid-2">
                  <InputRow label="Total Chol" name="totalChol" value={inputs.totalChol} onChange={handleInputChange} units={['mg/dL', 'mmol/L']} unitValue={inputs.totalCholUnit} />
                  <InputRow label="HDL Chol" name="hdlChol" value={inputs.hdlChol} onChange={handleInputChange} units={['mg/dL', 'mmol/L']} unitValue={inputs.hdlCholUnit} />
                </div>
                <div className="grid-2">
                  <InputRow label="Systolic BP" name="systolicBP" value={inputs.systolicBP} onChange={handleInputChange} units={['mmHg']} unitValue={inputs.systolicBPUnit} />
                  <InputRow label="Creatinine" name="creatinine" value={inputs.creatinine} onChange={handleInputChange} units={['mg/dL', 'μmol/L']} unitValue={inputs.creatinineUnit} />
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <label className="block text-[11px] font-black uppercase tracking-[0.2em] text-indigo-400">Medical History</label>
              <div className="card-simple space-y-1">
                <RadioRow label="Diabetes Status" name="hasDiabetes" value={inputs.hasDiabetes} options={[]} onChange={handleInputChange} variant="switch" />
                <RadioRow label="Current Smoking" name="isSmoking" value={inputs.isSmoking} options={[]} onChange={handleInputChange} variant="switch" />
                <RadioRow label="Hypertension Meds" name="onHypertensionMed" value={inputs.onHypertensionMed} options={[]} onChange={handleInputChange} variant="switch" />
                <RadioRow label="Statin Therapy" name="onStatin" value={inputs.onStatin} options={[]} onChange={handleInputChange} variant="switch" />
              </div>
            </section>

            <section className="space-y-4">
              <label className="block text-[11px] font-black uppercase tracking-[0.2em] text-gray-500">Novel Risk Factors (Optional)</label>
              <div className="card-simple grid-2">
                <InputRow label="HbA1C" name="hbA1c" value={inputs.hbA1c} onChange={handleInputChange} units={['%']} unitValue={inputs.hbA1cUnit} />
                <InputRow label="UACR" name="uacr" value={inputs.uacr} onChange={handleInputChange} units={['mg/g']} unitValue={inputs.uacrUnit} />
              </div>
            </section>

            {/* Validation Errors */}
            {results.errors.length > 0 && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl space-y-1">
                {results.errors.map((e, i) => (
                  <div key={i} className="text-[10px] font-bold text-red-400 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-1 h-1 bg-red-400 rounded-full" /> {e}
                  </div>
                ))}
              </div>
            )}

          </div>

          {/* Right: Results */}
          <div>
            <div className="sticky top-20">
              <ResultsDisplay results={results} />
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default RiskCalculator;
