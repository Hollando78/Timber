import spanData from '../data/span-tables.json';

export const getMaxSpan = (timberSize, spacing, grade = 'C16') => {
  try {
    const spacingKey = spacing.replace('mm', '');
    const span = spanData.floor_joists[grade][timberSize][spacingKey];
    
    if (!span) {
      return null;
    }
    
    return {
      maxSpan: span.max_span,
      notes: span.notes,
      confidence: span.confidence,
      status: getSpanStatus(span.max_span),
      sourceAgreement: span.source_agreement
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

export const getTimberSizes = () => {
  return spanData.additional_data.timber_sizes_available;
};

export const getSpacingOptions = () => {
  return spanData.additional_data.spacing_options.map(s => s + 'mm');
};

export const getGrades = () => {
  return spanData.additional_data.grades_supported;
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