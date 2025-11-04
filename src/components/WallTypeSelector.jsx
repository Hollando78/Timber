import React from 'react';

const WallTypeSelector = ({ value, onChange, options, elementType }) => {
  // Only show if this is a stud wall
  if (elementType !== 'stud_walls') {
    return null;
  }

  const getWallTypeName = (key) => {
    switch (key) {
      case 'partition_wall':
        return 'Partition Wall';
      case 'load_bearing_wall':
        return 'Load-Bearing Wall';
      case 'external_wall':
        return 'External Wall';
      default:
        return key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
  };

  const getWallTypeDescription = (key) => {
    switch (key) {
      case 'partition_wall':
        return 'Non-structural internal wall - self-weight only';
      case 'load_bearing_wall':
        return 'Supports floor/roof loads - requires Building Regs approval';
      case 'external_wall':
        return 'External wall with wind loading and insulation';
      default:
        return '';
    }
  };

  const getWallTypeIcon = (key) => {
    switch (key) {
      case 'partition_wall':
        return '🏠';
      case 'load_bearing_wall':
        return '🏗️';
      case 'external_wall':
        return '🌬️';
      default:
        return '🧱';
    }
  };

  return (
    <div className="mb-4">
      <label htmlFor="wall-type" className="block text-sm font-medium text-gray-700 mb-2">
        Wall Type
      </label>
      <select
        id="wall-type"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
      >
        {options.map((wallType) => (
          <option key={wallType} value={wallType}>
            {getWallTypeIcon(wallType)} {getWallTypeName(wallType)}
          </option>
        ))}
      </select>
      
      {/* Wall type-specific information */}
      {value && (
        <div className="mt-2 p-3 bg-gray-50 rounded border text-sm">
          <p className="text-gray-700 mb-1">
            <span className="font-medium">{getWallTypeName(value)}:</span> {getWallTypeDescription(value)}
          </p>
          
          {value === 'partition_wall' && (
            <div className="text-xs text-green-600 mt-1">
              ✓ No Building Regulations approval typically required
            </div>
          )}
          
          {value === 'load_bearing_wall' && (
            <div className="text-xs text-orange-600 mt-1">
              ⚠️ Building Regulations approval required for structural alterations
            </div>
          )}
          
          {value === 'external_wall' && (
            <div className="text-xs text-blue-600 mt-1">
              ℹ️ Must comply with Part L thermal requirements and wind loading
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WallTypeSelector;