import React, { useState, useEffect } from 'react';
import TimberSelector from './TimberSelector';
import SpacingSelector from './SpacingSelector';
import GradeSelector from './GradeSelector';
import ElementSelector from './ElementSelector';
import ResultsDisplay from './ResultsDisplay';
import { getMaxSpan, getTimberSizes, getSpacingOptions, getGrades, getStructuralElements } from '../utils/spanLookup';

const SpanCalculator = () => {
  const [elementType, setElementType] = useState('floor_joists');
  const [timberSize, setTimberSize] = useState('');
  const [spacing, setSpacing] = useState('');
  const [grade, setGrade] = useState('C16');
  const [result, setResult] = useState(null);
  
  const structuralElements = getStructuralElements();
  const timberSizes = getTimberSizes(elementType);
  const spacingOptions = getSpacingOptions(elementType);
  const grades = getGrades();

  // Reset timber size when element type changes as sizes may differ
  useEffect(() => {
    setTimberSize('');
  }, [elementType]);

  useEffect(() => {
    if (timberSize && spacing && grade && elementType) {
      const spanResult = getMaxSpan(timberSize, spacing, grade, elementType);
      setResult(spanResult);
    } else {
      setResult(null);
    }
  }, [timberSize, spacing, grade, elementType]);

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <ElementSelector
          value={elementType}
          onChange={setElementType}
          options={structuralElements}
        />
        
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