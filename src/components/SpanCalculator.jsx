import React, { useState, useEffect } from 'react';
import TimberSelector from './TimberSelector';
import SpacingSelector from './SpacingSelector';
import GradeSelector from './GradeSelector';
import ElementSelector from './ElementSelector';
import WallTypeSelector from './WallTypeSelector';
import StringerTypeSelector from './StringerTypeSelector';
import ResultsDisplay from './ResultsDisplay';
import { getMaxSpan, getTimberSizes, getSpacingOptions, getGrades, getStructuralElements, getWallTypes, getStringerTypes } from '../utils/spanLookup';

const SpanCalculator = () => {
  const [elementType, setElementType] = useState('floor_joists');
  const [timberSize, setTimberSize] = useState('');
  const [spacing, setSpacing] = useState('');
  const [grade, setGrade] = useState('C16');
  const [wallType, setWallType] = useState('partition_wall');
  const [stringerType, setStringerType] = useState('domestic_cut');
  const [result, setResult] = useState(null);
  
  const structuralElements = getStructuralElements();
  const timberSizes = getTimberSizes(elementType);
  const spacingOptions = getSpacingOptions(elementType);
  const grades = getGrades();
  const wallTypes = getWallTypes();
  const stringerTypes = getStringerTypes();

  // Reset timber size when element type changes as sizes may differ
  useEffect(() => {
    setTimberSize('');
  }, [elementType]);

  useEffect(() => {
    if (elementType === 'stair_stringers') {
      // For stair stringers, we only need timber size, grade, and stringer type
      if (timberSize && grade && stringerType) {
        const spanResult = getMaxSpan(timberSize, spacing, grade, elementType, wallType, stringerType);
        setResult(spanResult);
      } else {
        setResult(null);
      }
    } else if (timberSize && spacing && grade && elementType) {
      const spanResult = getMaxSpan(timberSize, spacing, grade, elementType, wallType, stringerType);
      setResult(spanResult);
    } else {
      setResult(null);
    }
  }, [timberSize, spacing, grade, elementType, wallType, stringerType]);

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <ElementSelector
          value={elementType}
          onChange={setElementType}
          options={structuralElements}
        />
        
        <WallTypeSelector
          value={wallType}
          onChange={setWallType}
          options={wallTypes}
          elementType={elementType}
        />
        
        <StringerTypeSelector
          value={stringerType}
          onChange={setStringerType}
          options={stringerTypes}
          elementType={elementType}
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
        
        {elementType !== 'stair_stringers' && (
          <SpacingSelector
            value={spacing}
            onChange={setSpacing}
            options={spacingOptions}
          />
        )}
        
        <ResultsDisplay result={result} grade={grade} elementType={elementType} />
      </div>
    </div>
  );
};

export default SpanCalculator;