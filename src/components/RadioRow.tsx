import React from 'react';

interface RadioRowProps {
  label: string;
  name: string;
  value: string;
  options: { label: string; value: string }[];
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  variant?: 'toggle' | 'switch';
}

const RadioRow: React.FC<RadioRowProps> = ({ label, name, value, options, onChange, variant = 'toggle' }) => {
  if (variant === 'switch') {
    const isYes = value === 'Yes';
    return (
      <div className="flex items-center justify-between py-1">
        <span className="text-sm text-gray-300">{label}</span>
        <label 
          className="relative inline-block w-11 h-6 transition-all duration-200 cursor-pointer rounded-full"
          style={{ backgroundColor: isYes ? '#4f46e5' : '#1f2937' }}
        >
          <input
            type="checkbox"
            className="hidden"
            checked={isYes}
            onChange={(e) => {
              const newVal = e.target.checked ? 'Yes' : 'No';
              const syntheticEvent = {
                target: { name, value: newVal }
              } as React.ChangeEvent<HTMLInputElement>;
              onChange(syntheticEvent);
            }}
          />
          <span 
            className="absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-200"
            style={{ left: isYes ? 23 : 4 }}
          />
        </label>
      </div>
    );
  }

  return (
    <div className="flex bg-gray-900/50 p-1 rounded-lg">
      {options.map((option) => {
        const isSelected = value === option.value;
        return (
          <label
            key={option.value}
            className={`flex-1 py-1.5 text-center text-[11px] font-bold uppercase tracking-wider rounded-md cursor-pointer transition-all duration-200 ${
              isSelected
                ? 'bg-indigo-600 text-white'
                : 'text-gray-500 hover:text-gray-300'
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
  );
};

export default RadioRow;
