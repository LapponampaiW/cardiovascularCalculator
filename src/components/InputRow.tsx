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
    <div className="input-field">
      <label className="block text-[11px] font-bold uppercase tracking-[0.09em] text-gray-500 mb-1">
        {label}
      </label>
      <div className="flex items-baseline gap-2">
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full bg-transparent border-none p-0 text-white text-base font-medium focus:ring-0 placeholder:text-gray-700"
        />
        {units && (
          <select
            name={`${name}Unit`}
            value={unitValue}
            onChange={onChange}
            className="bg-transparent border-none p-0 text-[11px] font-bold text-indigo-400 cursor-pointer focus:ring-0 uppercase tracking-widest"
          >
            {units.map((unit) => (
              <option key={unit} value={unit} className="bg-[#161925] text-white">
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
