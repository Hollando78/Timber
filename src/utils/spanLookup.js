import spanData from '../data/span-tables.json';

export const getMaxSpan = (timberSize, spacing, grade = 'C16', elementType = 'floor_joists') => {
  try {
    const spacingKey = spacing.replace('mm', '');
    const element = spanData.structural_elements[elementType];
    
    if (!element || !element.spans[grade] || !element.spans[grade][timberSize] || !element.spans[grade][timberSize][spacingKey]) {
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

const getSpanStatus = (span) => {
  if (span >= 4.5) return 'excellent';
  if (span >= 3.5) return 'good';
  if (span >= 2.5) return 'adequate';
  return 'limited';
};

export const getTimberSizes = (elementType = 'floor_joists') => {
  const element = spanData.structural_elements[elementType];
  if (!element || !element.spans) return [];
  
  // Get all timber sizes available for any grade in this element type
  const sizes = new Set();
  Object.values(element.spans).forEach(gradeData => {
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

export const getMetaData = () => {
  return spanData.meta;
};

export const getDataSources = () => {
  return spanData.meta.sources;
};

export const getUsageNotes = () => {
  return spanData.usage_notes;
};