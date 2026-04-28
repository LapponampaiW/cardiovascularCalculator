import React, { useState, useMemo } from 'react';
import ResultsDisplay from './ResultsDisplay';
import { calculatePrevent } from '../utils/calculations';

const Toggle: React.FC<{ label: string; checked: boolean; onToggle: () => void }> = ({ label, checked, onToggle }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 0' }}>
    <span style={{ fontSize: 14, color: '#d1d5db' }}>{label}</span>
    <button
      type="button"
      onClick={onToggle}
      style={{
        width: 44, height: 24, borderRadius: 12,
        backgroundColor: checked ? '#4f46e5' : '#374151',
        border: '1px solid ' + (checked ? '#6366f1' : '#4b5563'),
        cursor: 'pointer', position: 'relative',
        flexShrink: 0, outline: 'none',
      }}
    >
      <span style={{
        display: 'block', width: 16, height: 16, borderRadius: '50%',
        backgroundColor: 'white',
        position: 'absolute', top: 3,
        left: checked ? 23 : 3,
        transition: 'left 0.2s ease',
      }} />
    </button>
  </div>
);

const Field: React.FC<{
  label: string; name: string; value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  unit?: string; unitName?: string; unitValue?: string; unitOptions?: string[];
  placeholder?: string; fullWidth?: boolean;
}> = ({ label, name, value, onChange, unit, unitName, unitValue, unitOptions, placeholder, fullWidth }) => (
  <div>
    <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
      {label}
    </label>
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '8px 12px' }}>
      <input
        name={name} value={value} onChange={onChange}
        placeholder={placeholder || '—'}
        style={{ background: 'transparent', border: 'none', outline: 'none', color: 'white', fontSize: 15, fontWeight: 600, width: fullWidth ? '100%' : 72, fontFamily: 'inherit', minWidth: 0 }}
      />
      {unitOptions && unitName && unitValue ? (
        <select name={unitName} value={unitValue} onChange={onChange}
          style={{ background: '#111827', border: '1px solid #374151', borderRadius: 4, color: '#9ca3af', fontSize: 11, padding: '2px 4px', cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0 }}>
          {unitOptions.map(u => <option key={u} value={u}>{u}</option>)}
        </select>
      ) : unit ? (
        <span style={{ color: '#6b7280', fontSize: 12, flexShrink: 0 }}>{unit}</span>
      ) : null}
    </div>
  </div>
);

const Card: React.FC<{ children: React.ReactNode; accent?: string }> = ({ children, accent }) => (
  <div style={{
    background: '#161925',
    border: `1px solid ${accent || 'rgba(255,255,255,0.07)'}`,
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
  }}>
    {children}
  </div>
);

const SectionLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: 14 }}>{children}</p>
);

const RiskCalculator: React.FC = () => {
  const [inputs, setInputs] = useState({
    age: '70', ageUnit: 'yr',
    sex: 'Female',
    height: '160', heightUnit: 'cm',
    weight: '70', weightUnit: 'kg',
    totalChol: '220', totalCholUnit: 'mg/dL',
    hdlChol: '40', hdlCholUnit: 'mg/dL',
    systolicBP: '170', systolicBPUnit: 'mmHg',
    creatinine: '0.9', creatinineUnit: 'mg/dL',
    onHypertensionMed: 'No',
    onStatin: 'Yes',
    hasDiabetes: 'Yes',
    isSmoking: 'Yes',
    hbA1c: '7', hbA1cUnit: '%',
    uacr: '1.2', uacrUnit: 'mg/g',
    zipCode: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  };
  const handleToggle = (name: string) =>
    setInputs(prev => ({ ...prev, [name]: prev[name as keyof typeof prev] === 'Yes' ? 'No' : 'Yes' }));

  const results = useMemo(() => calculatePrevent(inputs), [inputs]);
  const age = parseInt(inputs.age) || 0;

  return (
    <div style={{ minHeight: '100vh', background: '#0d0f18', color: '#e2e8f0', fontFamily: 'Inter, system-ui, sans-serif' }}>

      {/* Navbar */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(13,15,24,0.97)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        padding: '0 24px', height: 56,
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <span style={{ fontSize: 17, fontWeight: 900, color: 'white', letterSpacing: '-0.02em' }}>
          CardioRisk <span style={{ color: '#818cf8' }}>PREVENT</span>
        </span>
        <span style={{ fontSize: 11, color: '#6b7280', background: '#1f2937', padding: '2px 10px', borderRadius: 99, border: '1px solid #374151' }}>
          ACC/AHA 2023
        </span>
      </header>

      {/* Main */}
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 16px' }}>
        <div className="layout-2col">

          {/* ── LEFT: Inputs ── */}
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: 'white', marginBottom: 16 }}>Clinical Parameters</h2>

            {/* Patient Profile */}
            <Card>
              <SectionLabel>Patient Profile</SectionLabel>
              <div style={{ display: 'flex', background: 'rgba(255,255,255,0.04)', borderRadius: 8, padding: 4, marginBottom: 16, border: '1px solid rgba(255,255,255,0.07)' }}>
                {['Female', 'Male'].map(s => (
                  <button key={s} type="button" onClick={() => setInputs(p => ({ ...p, sex: s }))}
                    style={{
                      flex: 1, padding: '8px 0', borderRadius: 6, border: 'none', cursor: 'pointer',
                      fontSize: 14, fontWeight: 600, fontFamily: 'inherit',
                      background: inputs.sex === s ? '#4f46e5' : 'transparent',
                      color: inputs.sex === s ? 'white' : '#9ca3af',
                    }}>
                    {s}
                  </button>
                ))}
              </div>
              <div className="grid-3">
                <Field label="Age" name="age" value={inputs.age} onChange={handleChange} unit="yr" />
                <Field label="Height" name="height" value={inputs.height} onChange={handleChange}
                  unitName="heightUnit" unitValue={inputs.heightUnit} unitOptions={['cm', 'in']} />
                <Field label="Weight" name="weight" value={inputs.weight} onChange={handleChange}
                  unitName="weightUnit" unitValue={inputs.weightUnit} unitOptions={['kg', 'lb']} />
              </div>
            </Card>

            {/* Clinical Measurements */}
            <Card>
              <SectionLabel>Clinical Measurements</SectionLabel>
              <div className="grid-2">
                <Field label="Total Cholesterol" name="totalChol" value={inputs.totalChol} onChange={handleChange}
                  unitName="totalCholUnit" unitValue={inputs.totalCholUnit} unitOptions={['mg/dL', 'mmol/L']} />
                <Field label="HDL Cholesterol" name="hdlChol" value={inputs.hdlChol} onChange={handleChange}
                  unitName="hdlCholUnit" unitValue={inputs.hdlCholUnit} unitOptions={['mg/dL', 'mmol/L']} />
                <Field label="Systolic BP" name="systolicBP" value={inputs.systolicBP} onChange={handleChange} unit="mmHg" />
                <Field label="Serum Creatinine" name="creatinine" value={inputs.creatinine} onChange={handleChange}
                  unitName="creatinineUnit" unitValue={inputs.creatinineUnit} unitOptions={['mg/dL', 'μmol/L']} />
              </div>
            </Card>

            {/* Medical History */}
            <Card>
              <SectionLabel>Medical History</SectionLabel>
              <Toggle label="Hypertension Medication" checked={inputs.onHypertensionMed === 'Yes'} onToggle={() => handleToggle('onHypertensionMed')} />
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', margin: '2px 0' }} />
              <Toggle label="Statin Therapy" checked={inputs.onStatin === 'Yes'} onToggle={() => handleToggle('onStatin')} />
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', margin: '2px 0' }} />
              <Toggle label="Diabetes" checked={inputs.hasDiabetes === 'Yes'} onToggle={() => handleToggle('hasDiabetes')} />
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', margin: '2px 0' }} />
              <Toggle label="Current Smoking" checked={inputs.isSmoking === 'Yes'} onToggle={() => handleToggle('isSmoking')} />
            </Card>

            {/* Optional Risk Factors */}
            <div style={{
              background: 'rgba(79,70,229,0.07)',
              border: '1px solid rgba(99,102,241,0.22)',
              borderRadius: 12, padding: 20,
            }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#818cf8', textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: 4 }}>
                Optional Novel Risk Factors
              </p>
              <p style={{ fontSize: 12, color: 'rgba(129,140,248,0.55)', marginBottom: 14 }}>
                AHA 2023 add-on model — leave blank to use base model
              </p>
              <div className="grid-2" style={{ marginBottom: 12 }}>
                <Field label="HbA1C" name="hbA1c" value={inputs.hbA1c} onChange={handleChange} unit="%" />
                <Field label="UACR" name="uacr" value={inputs.uacr} onChange={handleChange} unit="mg/g" />
              </div>
              <Field label="US Zip Code" name="zipCode" value={inputs.zipCode} onChange={handleChange} placeholder="e.g. 90210" fullWidth />
            </div>
          </div>

          {/* ── RIGHT: Results ── */}
          <div>
            <ResultsDisplay results={results} age={age} />
          </div>

        </div>
      </main>
    </div>
  );
};

export default RiskCalculator;
