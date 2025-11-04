import React from 'react';

const TimberSelector = ({ value, onChange, options }) => {
  return (
    <div className="mb-4">
      <label htmlFor="timber-size" className="block text-sm font-medium text-gray-700 mb-2">
        Timber Size
      </label>
      <select
        id="timber-size"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
      >
        <option value="">Select timber size</option>
        {options.map((size) => (
          <option key={size} value={size}>
            {size}mm
          </option>
        ))}
      </select>
    </div>
  );
};

export default TimberSelector;