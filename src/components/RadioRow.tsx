import React from 'react';

interface RadioRowProps {
  label: string;
  name: string;
  value: string;
  options: { label: string; value: string }[];
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const RadioRow: React.FC<RadioRowProps> = ({ label, name, value, options, onChange }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between py-4 border-b border-slate-100 last:border-0 gap-3 sm:gap-6">
      <label className="text-base font-semibold text-slate-600 flex-1">{label}</label>
      <div className="flex p-1 bg-slate-100 rounded-xl border border-slate-200 w-full sm:w-[200px] gap-1">
        {options.map((option) => {
          const isSelected = value === option.value;
          return (
            <label
              key={option.value}
              className={`flex-1 flex items-center justify-center py-2 px-3 rounded-lg text-sm font-bold cursor-pointer transition-all duration-200 ${
                isSelected
                  ? 'bg-white text-blue-600 shadow-sm ring-1 ring-slate-200'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={isSelected}
                onChange={onChange}
                className="hidden"
              />
              {option.label}
            </label>
          );
        })}
      </div>
    </div>
  );
};

export default RadioRow;
