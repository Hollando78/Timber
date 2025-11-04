import React, { useState, useEffect } from 'react';
import TimberSelector from './TimberSelector';
import SpacingSelector from './SpacingSelector';
import GradeSelector from './GradeSelector';
import ResultsDisplay from './ResultsDisplay';
import { getMaxSpan, getTimberSizes, getSpacingOptions, getGrades } from '../utils/spanLookup';

const SpanCalculator = () => {
  const [timberSize, setTimberSize] = useState('');
  const [spacing, setSpacing] = useState('');
  const [grade, setGrade] = useState('C16');
  const [result, setResult] = useState(null);
  
  const timberSizes = getTimberSizes();
  const spacingOptions = getSpacingOptions();
  const grades = getGrades();

  useEffect(() => {
    if (timberSize && spacing && grade) {
      const spanResult = getMaxSpan(timberSize, spacing, grade);
      setResult(spanResult);
    } else {
      setResult(null);
    }
  }, [timberSize, spacing, grade]);

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <span className="font-semibold">Use:</span> Floor Joists | 
            <span className="font-semibold"> Loading:</span> Standard Domestic (1.75 kN/m²)
          </p>
        </div>
        
        <GradeSelector
          value={grade}
          onChange={setGrade}
          options={grades}
        />
        
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
        
        <ResultsDisplay result={result} grade={grade} />
      </div>
    </div>
  );
};

export default SpanCalculator;