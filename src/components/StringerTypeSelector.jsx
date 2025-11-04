import React from 'react';

const StringerTypeSelector = ({ value, onChange, options, elementType }) => {
  // Only show if this is a stair stringer
  if (elementType !== 'stair_stringers') {
    return null;
  }

  const getStringerTypeName = (key) => {
    switch (key) {
      case 'domestic_cut':
        return 'Domestic Cut Stringer';
      case 'domestic_uncut':
        return 'Domestic Uncut Stringer';
      case 'commercial_cut':
        return 'Commercial Cut Stringer';
      case 'commercial_uncut':
        return 'Commercial Uncut Stringer';
      default:
        return key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
  };

  const getStringerTypeDescription = (key) => {
    switch (key) {
      case 'domestic_cut':
        return 'Cut stringers with notches for treads - reduced effective section';
      case 'domestic_uncut':
        return 'Uncut stringers for closed riser construction - full section';
      case 'commercial_cut':
        return 'Cut stringers under commercial loading (offices, shops)';
      case 'commercial_uncut':
        return 'Uncut stringers for commercial applications - maximum strength';
      default:
        return '';
    }
  };

  const getStringerTypeIcon = (key) => {
    switch (key) {
      case 'domestic_cut':
        return '🏠';
      case 'domestic_uncut':
        return '🏘️';
      case 'commercial_cut':
        return '🏢';
      case 'commercial_uncut':
        return '🏬';
      default:
        return '🪜';
    }
  };

  const getLoadingInfo = (key) => {
    switch (key) {
      case 'domestic_cut':
      case 'domestic_uncut':
        return 'Loading: 4.8 kN/m² imposed + 1.3 kN concentrated load';
      case 'commercial_cut':
      case 'commercial_uncut':
        return 'Loading: 7.5 kN/m² imposed + 2.0 kN concentrated load';
      default:
        return '';
    }
  };

  return (
    <div className="mb-4">
      <label htmlFor="stringer-type" className="block text-sm font-medium text-gray-700 mb-2">
        Stringer Type
      </label>
      <select
        id="stringer-type"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
      >
        {options.map((stringerType) => (
          <option key={stringerType} value={stringerType}>
            {getStringerTypeIcon(stringerType)} {getStringerTypeName(stringerType)}
          </option>
        ))}
      </select>
      
      {/* Stringer type-specific information */}
      {value && (
        <div className="mt-2 p-3 bg-gray-50 rounded border text-sm">
          <p className="text-gray-700 mb-1">
            <span className="font-medium">{getStringerTypeName(value)}:</span> {getStringerTypeDescription(value)}
          </p>
          
          <p className="text-gray-600 text-xs mb-2">
            {getLoadingInfo(value)}
          </p>
          
          {(value === 'domestic_cut' || value === 'domestic_uncut') && (
            <div className="text-xs text-green-600 mt-1">
              ✓ Domestic stairs - Building Regulations Part K compliance
            </div>
          )}
          
          {(value === 'commercial_cut' || value === 'commercial_uncut') && (
            <div className="text-xs text-orange-600 mt-1">
              ⚠️ Commercial stairs - Higher loading requirements
            </div>
          )}
          
          {value.includes('cut') && (
            <div className="text-xs text-blue-600 mt-1">
              ℹ️ Cut stringers assume 75mm effective depth reduction for tread notches
            </div>
          )}
          
          {value.includes('uncut') && (
            <div className="text-xs text-purple-600 mt-1">
              ⭐ Uncut stringers provide maximum strength - suitable for closed riser stairs
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StringerTypeSelector;