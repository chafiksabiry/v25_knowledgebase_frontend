import React, { useState } from 'react';
import apiClient from '../api/client';
import Cookies from 'js-cookie';

interface ScriptResponse {
  success: boolean;
  data?: {
    script: string;
    metadata: {
      processedAt: string;
      model: string;
      corpusStatus: {
        exists: boolean;
        documentCount: number;
        callRecordingCount: number;
        totalCount: number;
      };
    };
  };
  error?: {
    message: string;
    code?: string;
    details?: string;
  };
}

const ScriptGenerator: React.FC = () => {
  const [projectId, setProjectId] = useState('');
  const [scriptType, setScriptType] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<ScriptResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getCompanyId = () => {
    const runMode = import.meta.env.VITE_RUN_MODE || 'in-app';
    if (runMode === 'standalone') {
      // Utilise la variable d'environnement en standalone
      return import.meta.env.VITE_STANDALONE_COMPANY_ID;
    } else {
      // Utilise le cookie en in-app
      return Cookies.get('companyId');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setResponse(null);
    try {
      const companyId = getCompanyId();
      if (!companyId) throw new Error('Company ID not found');
      const apiResponse = await apiClient.post<ScriptResponse>('/rag/generate-script', {
        companyId,
        projectId,
        scriptType
      });
      setResponse(apiResponse.data);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Failed to generate script');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Script Generator</h2>
        <p className="text-gray-600">
          Generate a call script based on your company knowledge base (documents & call recordings).
        </p>
      </div>
      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Project / Domain</label>
          <input
            type="text"
            value={projectId}
            onChange={e => setProjectId(e.target.value)}
            placeholder="e.g. Assurance Santé, Prévoyance, ..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Script Type (optional)</label>
          <input
            type="text"
            value={scriptType}
            onChange={e => setScriptType(e.target.value)}
            placeholder="e.g. Vente, Support, Onboarding..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || !projectId.trim()}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isLoading ? 'Generating...' : 'Generate Script'}
        </button>
      </form>
      {error && (
        <div className="p-4 mb-6 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 font-medium">An error occurred</p>
          <p className="text-red-700 mt-1">{error}</p>
        </div>
      )}
      {response && response.success && (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Generated Script</h3>
            <div className="prose max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: response.data?.script || '' }} />
          </div>
          {response.data?.metadata && (
            <div className="border-t border-gray-200 bg-gray-50 p-4 rounded-b-lg">
              <div className="text-sm text-gray-600 space-y-2">
                <div className="flex items-center gap-4">
                  <span className="font-semibold text-gray-700">Analyzed Resources:</span>
                  <span>{response.data.metadata.corpusStatus.totalCount} resources</span>
                </div>
                <p><span className="font-semibold text-gray-700">Model:</span> {response.data.metadata.model}</p>
                <p><span className="font-semibold text-gray-700">Processed at:</span> {new Date(response.data.metadata.processedAt).toLocaleString()}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ScriptGenerator; 