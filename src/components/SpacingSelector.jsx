import React from 'react';

const SpacingSelector = ({ value, onChange, options }) => {
  return (
    <div className="mb-4">
      <label htmlFor="joist-spacing" className="block text-sm font-medium text-gray-700 mb-2">
        Joist Spacing (Centers)
      </label>
      <select
        id="joist-spacing"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
      >
        <option value="">Select spacing</option>
        {options.map((spacing) => (
          <option key={spacing} value={spacing}>
            {spacing}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SpacingSelector;