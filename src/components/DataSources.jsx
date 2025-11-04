import React, { useState } from 'react';
import { getDataSources, getMetaData, getUsageNotes } from '../utils/spanLookup';

const DataSources = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const sources = getDataSources();
  const meta = getMetaData();
  const usageNotes = getUsageNotes();

  return (
    <div className="mt-8 max-w-2xl mx-auto">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full text-left p-4 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Data Sources & Information
          </h3>
          <span className="text-2xl text-gray-500">
            {isExpanded ? '−' : '+'}
          </span>
        </div>
        <p className="text-sm text-gray-600 mt-1">
          View verification details, sources, and usage notes
        </p>
      </button>

      {isExpanded && (
        <div className="mt-4 p-6 bg-white rounded-lg border border-gray-200 space-y-6">
          {/* Data Status */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Data Verification</h4>
            <div className="bg-blue-50 p-3 rounded border-l-4 border-blue-400">
              <p className="text-sm text-blue-800">
                <span className="font-medium">Status:</span> {meta.data_status}
              </p>
              <p className="text-sm text-blue-800">
                <span className="font-medium">Version:</span> {meta.version}
              </p>
              <p className="text-sm text-blue-800">
                <span className="font-medium">Last Updated:</span> {new Date(meta.created_date).toLocaleDateString()}
              </p>
              <p className="text-sm text-blue-800">
                <span className="font-medium">Confidence:</span> {meta.validation_status.confidence_level}
              </p>
            </div>
          </div>

          {/* Sources */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Referenced Sources</h4>
            <div className="space-y-3">
              {sources.map((source, index) => (
                <div key={index} className="border rounded p-3 bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h5 className="font-medium text-gray-900">{source.name}</h5>
                      {source.version && (
                        <p className="text-sm text-gray-600">Version: {source.version}</p>
                      )}
                      <p className="text-sm text-gray-600">Status: {source.status}</p>
                      {source.notes && (
                        <p className="text-sm text-gray-700 mt-1">{source.notes}</p>
                      )}
                    </div>
                    {source.url && (
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm ml-3"
                      >
                        View →
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Assumptions */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Design Assumptions</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div>
                  <span className="font-medium">Loading:</span>
                  <ul className="ml-4 mt-1 space-y-1 text-gray-600">
                    <li>• Dead load: {meta.assumptions.loading.dead_load} {meta.assumptions.loading.unit}</li>
                    <li>• Imposed load: {meta.assumptions.loading.imposed_load} {meta.assumptions.loading.unit}</li>
                    <li>• Total: {meta.assumptions.loading.total_load} {meta.assumptions.loading.unit}</li>
                  </ul>
                </div>
              </div>
              <div className="space-y-2">
                <div>
                  <span className="font-medium">Structural:</span>
                  <ul className="ml-4 mt-1 space-y-1 text-gray-600">
                    <li>• End conditions: {meta.assumptions.end_conditions}</li>
                    <li>• Deflection limit: {meta.assumptions.deflection_limit}</li>
                    <li>• Bearing length: {meta.assumptions.bearing_length}</li>
                    <li>• Timber type: {meta.assumptions.timber_type}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Usage Notes */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Important Usage Notes</h4>
            <div className="bg-amber-50 p-4 rounded border-l-4 border-amber-400">
              <ul className="space-y-2 text-sm text-amber-800">
                {usageNotes.map((note, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-amber-600 mr-2 mt-0.5">•</span>
                    {note}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="bg-red-50 p-4 rounded border-l-4 border-red-400">
            <h4 className="font-semibold text-red-900 mb-2">Important Disclaimer</h4>
            <p className="text-sm text-red-800">{meta.disclaimer}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataSources;