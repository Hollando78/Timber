import React from 'react';

const GradeSelector = ({ value, onChange, options }) => {
  return (
    <div className="mb-4">
      <label htmlFor="timber-grade" className="block text-sm font-medium text-gray-700 mb-2">
        Timber Grade
      </label>
      <select
        id="timber-grade"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
      >
        {options.map((grade) => (
          <option key={grade} value={grade}>
            {grade} {grade === 'C16' ? '(Standard)' : '(Premium)'}
          </option>
        ))}
      </select>
      <p className="text-xs text-gray-500 mt-1">
        {value === 'C16' ? 'Most common UK softwood grade' : 'Higher strength grade, typically imported'}
      </p>
    </div>
  );
};

export default GradeSelector;