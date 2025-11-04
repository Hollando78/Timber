import React, { useState, useEffect } from 'react';
import TimberSelector from './TimberSelector';
import SpacingSelector from './SpacingSelector';
import ResultsDisplay from './ResultsDisplay';
import { getMaxSpan, getTimberSizes, getSpacingOptions } from '../utils/spanLookup';

const SpanCalculator = () => {
  const [timberSize, setTimberSize] = useState('');
  const [spacing, setSpacing] = useState('');
  const [result, setResult] = useState(null);
  
  const timberSizes = getTimberSizes();
  const spacingOptions = getSpacingOptions();

  useEffect(() => {
    if (timberSize && spacing) {
      const spanResult = getMaxSpan(timberSize, spacing);
      setResult(spanResult);
    } else {
      setResult(null);
    }
  }, [timberSize, spacing]);

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <span className="font-semibold">Use:</span> Floor Joists | 
            <span className="font-semibold"> Grade:</span> C16 | 
            <span className="font-semibold"> Loading:</span> Standard Domestic
          </p>
        </div>
        
        <TimberSelector
          value={timberSize}
          onChange={setTimberSize}
          options={timberSizes}
        />
        
        <SpacingSelector
          value={spacing}
          onChange={setSpacing}
          options={spacingOptions}
        />
        
        <ResultsDisplay result={result} />
      </div>
    </div>
  );
};

export default SpanCalculator;