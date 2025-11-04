import React from 'react';

const ElementSelector = ({ value, onChange, options }) => {
  const getElementName = (key) => {
    switch (key) {
      case 'floor_joists':
        return 'Floor Joists';
      case 'ceiling_joists':
        return 'Ceiling Joists';
      case 'roof_rafters':
        return 'Roof Rafters';
      case 'stud_walls':
        return 'Stud Walls';
      case 'stair_stringers':
        return 'Stair Stringers';
      default:
        return key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
  };

  const getElementIcon = (key) => {
    switch (key) {
      case 'floor_joists':
        return '🏠';
      case 'ceiling_joists':
        return '🏘️';
      case 'roof_rafters':
        return '🏚️';
      case 'stud_walls':
        return '🧱';
      case 'stair_stringers':
        return '🪜';
      default:
        return '🪵';
    }
  };

  return (
    <div className="mb-4">
      <label htmlFor="element-type" className="block text-sm font-medium text-gray-700 mb-2">
        Structural Element Type
      </label>
      <select
        id="element-type"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
      >
        {options.map((element) => (
          <option key={element.key} value={element.key}>
            {getElementIcon(element.key)} {getElementName(element.key)}
          </option>
        ))}
      </select>
      
      {/* Element-specific information */}
      {value && (
        <div className="mt-2 p-3 bg-gray-50 rounded border text-sm">
          {options.find(el => el.key === value) && (
            <>
              <p className="text-gray-700 mb-2">
                {options.find(el => el.key === value).description}
              </p>
              <div className="text-xs text-gray-600">
                <p><span className="font-medium">Loading:</span> {options.find(el => el.key === value).loading.total_load} {options.find(el => el.key === value).loading.unit}</p>
                <p><span className="font-medium">Deflection limit:</span> {options.find(el => el.key === value).design_criteria.deflection_limit}</p>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ElementSelector;