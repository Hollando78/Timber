import React from 'react';
import SpanCalculator from './components/SpanCalculator';
import { getMetaData } from './utils/spanLookup';

function App() {
  const meta = getMetaData();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            UK Timber Span Calculator
          </h1>
          <p className="text-gray-600 text-sm md:text-base">
            Building Regs Approved Doc A • Quick Reference Tool
          </p>
        </header>
        
        <main>
          <SpanCalculator />
        </main>
        
        <footer className="mt-12 text-center text-xs text-gray-500">
          <div className="mb-2 p-4 bg-amber-50 border border-amber-200 rounded-lg max-w-md mx-auto">
            <p className="font-semibold text-amber-800 mb-1">Important Disclaimer</p>
            <p className="text-amber-700">
              {meta.disclaimer}
            </p>
          </div>
          <p className="mt-4">
            Last updated: {meta.last_updated} | Version 1.0.0
          </p>
          <p className="mt-2">
            Data source: {meta.source}
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;