import React from 'react';

const ResultsDisplay = ({ result }) => {
  if (!result) {
    return (
      <div className="mt-6 p-6 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-center text-gray-500">
          Select timber size and spacing to calculate maximum span
        </p>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'excellent':
        return 'bg-green-100 border-green-400 text-green-900';
      case 'good':
        return 'bg-blue-100 border-blue-400 text-blue-900';
      case 'adequate':
        return 'bg-amber-100 border-amber-400 text-amber-900';
      case 'limited':
        return 'bg-red-100 border-red-400 text-red-900';
      default:
        return 'bg-gray-100 border-gray-400 text-gray-900';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'excellent':
        return 'Excellent span capability';
      case 'good':
        return 'Good span capability';
      case 'adequate':
        return 'Adequate span capability';
      case 'limited':
        return 'Limited span - consider larger timber';
      default:
        return '';
    }
  };

  return (
    <div className={`mt-6 p-6 rounded-lg border-2 ${getStatusColor(result.status)}`}>
      <div className="text-center">
        <p className="text-sm font-medium uppercase tracking-wide mb-2">Maximum Span</p>
        <p className="text-4xl font-bold mb-3">{result.maxSpan.toFixed(2)}m</p>
        <p className="text-sm">{getStatusText(result.status)}</p>
        {result.notes && (
          <p className="text-xs mt-2 opacity-75">{result.notes}</p>
        )}
      </div>
      
      <div className="mt-4 pt-4 border-t border-current opacity-50">
        <p className="text-xs text-center">
          Based on Building Regs Approved Document A
        </p>
      </div>
    </div>
  );
};

export default ResultsDisplay;