import spanData from '../data/span-tables.json';

export const getMaxSpan = (timberSize, spacing) => {
  try {
    const spacingKey = spacing.replace('mm', '');
    const span = spanData.floor_joists.C16[timberSize][spacingKey];
    
    if (!span) {
      return null;
    }
    
    return {
      maxSpan: span.max_span,
      notes: span.notes,
      status: getSpanStatus(span.max_span)
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
  return Object.keys(spanData.floor_joists.C16);
};

export const getSpacingOptions = () => {
  return ['400mm', '450mm', '600mm'];
};

export const getMetaData = () => {
  return spanData.meta;
};