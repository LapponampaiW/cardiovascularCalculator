import React from 'react';

interface InputRowProps {
  label: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  type?: string;
  units?: string[];
  unitValue?: string;
  name: string;
  placeholder?: string;
}

const InputRow: React.FC<InputRowProps> = ({
  label,
  value,
  onChange,
  type = 'text',
  units,
  unitValue,
  name,
  placeholder,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between py-4 border-b border-slate-100 last:border-0 gap-3 sm:gap-6">
      <label className="text-base font-semibold text-slate-600 flex-1">
        {label}
      </label>
      <div className="flex gap-2 w-full sm:w-auto">
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full sm:w-28 px-3 py-2.5 border-2 border-slate-200 rounded-xl text-base font-bold text-slate-800 bg-white transition-all duration-200 hover:border-blue-300 focus:outline-none focus:ring-3 focus:ring-blue-500/20 focus:border-blue-500"
        />
        {units && (
          <select
            name={`${name}Unit`}
            value={unitValue}
            onChange={onChange}
            className="w-24 px-2 py-2.5 border-2 border-slate-200 rounded-xl text-sm font-semibold text-slate-500 bg-white cursor-pointer hover:border-blue-300 hover:text-blue-600 transition-all duration-200 focus:outline-none focus:ring-3 focus:ring-blue-500/20 focus:border-blue-500 focus:text-blue-700"
          >
            {units.map((unit) => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
};

export default InputRow;
