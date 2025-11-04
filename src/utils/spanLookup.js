import spanData from '../data/span-tables.json';

export const getMaxSpan = (timberSize, spacing, grade = 'C16', elementType = 'floor_joists', wallType = null) => {
  try {
    const spacingKey = spacing.replace('mm', '');
    const element = spanData.structural_elements[elementType];
    
    if (!element) {
      return null;
    }
    
    // Handle stud walls (heights) vs other elements (spans)
    if (elementType === 'stud_walls') {
      return getMaxHeight(timberSize, spacing, grade, wallType);
    }
    
    // Regular span lookup for other elements
    if (!element.spans[grade] || !element.spans[grade][timberSize] || !element.spans[grade][timberSize][spacingKey]) {
      return null;
    }
    
    const span = element.spans[grade][timberSize][spacingKey];
    
    return {
      maxSpan: span.max_span,
      notes: span.notes,
      confidence: span.confidence,
      status: getSpanStatus(span.max_span),
      sourceAgreement: span.source_agreement,
      elementInfo: {
        description: element.description,
        loading: element.loading,
        designCriteria: element.design_criteria
      }
    };
  } catch (error) {
    console.error('Error looking up span:', error);
    return null;
  }
};

export const getMaxHeight = (timberSize, spacing, grade = 'C16', wallType = 'partition_wall') => {
  try {
    const spacingKey = spacing.replace('mm', '');
    const element = spanData.structural_elements.stud_walls;
    
    if (!element || !element.heights[grade] || !element.heights[grade][timberSize] || 
        !element.heights[grade][timberSize][wallType] || !element.heights[grade][timberSize][wallType][spacingKey]) {
      return null;
    }
    
    const height = element.heights[grade][timberSize][wallType][spacingKey];
    
    return {
      maxHeight: height.max_height,
      notes: height.notes,
      confidence: height.confidence,
      status: getHeightStatus(height.max_height),
      sourceAgreement: height.source_agreement,
      elementInfo: {
        description: element.description,
        loading: element.loading[wallType],
        designCriteria: element.design_criteria
      },
      wallType: wallType
    };
  } catch (error) {
    console.error('Error looking up height:', error);
    return null;
  }
};

const getSpanStatus = (span) => {
  if (span >= 4.5) return 'excellent';
  if (span >= 3.5) return 'good';
  if (span >= 2.5) return 'adequate';
  return 'limited';
};

const getHeightStatus = (height) => {
  if (height >= 3.5) return 'excellent';
  if (height >= 2.8) return 'good';
  if (height >= 2.2) return 'adequate';
  return 'limited';
};

export const getTimberSizes = (elementType = 'floor_joists') => {
  const element = spanData.structural_elements[elementType];
  if (!element) return [];
  
  // Handle stud walls which use heights instead of spans
  const dataKey = elementType === 'stud_walls' ? 'heights' : 'spans';
  if (!element[dataKey]) return [];
  
  // Get all timber sizes available for any grade in this element type
  const sizes = new Set();
  Object.values(element[dataKey]).forEach(gradeData => {
    Object.keys(gradeData).forEach(size => sizes.add(size));
  });
  return Array.from(sizes).sort();
};

export const getSpacingOptions = (elementType = 'floor_joists') => {
  return spanData.timber_specifications.spacing_options.map(s => s + 'mm');
};

export const getGrades = () => {
  return spanData.timber_specifications.grades_available;
};

export const getStructuralElements = () => {
  return Object.keys(spanData.structural_elements).map(key => ({
    key,
    ...spanData.structural_elements[key]
  }));
};

export const getWallTypes = () => {
  const studWalls = spanData.structural_elements.stud_walls;
  if (!studWalls || !studWalls.heights || !studWalls.heights.C16) return [];
  
  // Get wall types from the first timber size of C16 grade
  const firstSize = Object.keys(studWalls.heights.C16)[0];
  if (!firstSize) return [];
  
  return Object.keys(studWalls.heights.C16[firstSize]);
};

export const getMetaData = () => {
  return spanData.meta;
};

export const getDataSources = () => {
  return spanData.meta.sources;
};

export const getUsageNotes = () => {
  return spanData.usage_notes;
};