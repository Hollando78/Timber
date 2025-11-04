import React from 'react';

const ResultsDisplay = ({ result, grade }) => {
  if (!result) {
    return (
      <div className="mt-6 p-6 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-center text-gray-500">
          Select timber grade, size and spacing to calculate maximum span
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

  const getConfidenceIndicator = (confidence) => {
    switch (confidence) {
      case 'high':
        return { icon: '✓', color: 'text-green-600', text: 'High confidence' };
      case 'medium':
        return { icon: '~', color: 'text-amber-600', text: 'Medium confidence' };
      case 'low':
        return { icon: '?', color: 'text-red-600', text: 'Low confidence' };
      default:
        return { icon: '', color: 'text-gray-600', text: '' };
    }
  };

  const confidenceInfo = getConfidenceIndicator(result.confidence);

  return (
    <div className={`mt-6 p-6 rounded-lg border-2 ${getStatusColor(result.status)}`}>
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <p className="text-sm font-medium uppercase tracking-wide">Maximum Span</p>
          <span className={`text-sm ${confidenceInfo.color}`} title={confidenceInfo.text}>
            {confidenceInfo.icon}
          </span>
        </div>
        <p className="text-4xl font-bold mb-2">{result.maxSpan.toFixed(2)}m</p>
        <p className="text-sm font-medium">{getStatusText(result.status)}</p>
        
        <div className="text-xs mt-2 space-y-1 opacity-75">
          <p>Grade: {grade} • Confidence: {result.confidence}</p>
          {result.notes && <p>{result.notes}</p>}
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-current opacity-50">
        <p className="text-xs text-center">
          Industry-verified data • Building Regs compliant
        </p>
        <p className="text-xs text-center mt-1">
          For guidance only - consult structural engineer
        </p>
      </div>
    </div>
  );
};

export default ResultsDisplay;