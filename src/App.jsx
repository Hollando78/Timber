import React from 'react';
import SpanCalculator from './components/SpanCalculator';
import DataSources from './components/DataSources';
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
            Industry-Verified Data • Building Regs Compliant
          </p>
        </header>
        
        <main>
          <SpanCalculator />
          <DataSources />
        </main>
        
        <footer className="mt-12 text-center text-xs text-gray-500">
          <div className="mb-2 p-4 bg-amber-50 border border-amber-200 rounded-lg max-w-md mx-auto">
            <p className="font-semibold text-amber-800 mb-1">Professional Disclaimer</p>
            <p className="text-amber-700">
              {meta.disclaimer}
            </p>
          </div>
          <p className="mt-4">
            Version {meta.version} | {meta.data_status}
          </p>
          <p className="mt-2">
            Last verified: {new Date(meta.validation_status.last_verified).toLocaleDateString()}
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;