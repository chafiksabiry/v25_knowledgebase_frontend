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
  const [objectif, setObjectif] = useState('');
  const [domaine, setDomaine] = useState('');
  const [typeClient, setTypeClient] = useState('');
  const [methode, setMethode] = useState('');
  const [contexte, setContexte] = useState('');
  const [langueTon, setLangueTon] = useState('');

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
        domaine,
        objectif,
        typeClient,
        contexte,
        langueTon
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Domaine</label>
          <input
            type="text"
            value={domaine}
            onChange={e => setDomaine(e.target.value)}
            placeholder="e.g. Assurance, Prévoyance, Santé..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Objectif de l'appel</label>
          <input
            type="text"
            value={objectif}
            onChange={e => setObjectif(e.target.value)}
            placeholder="e.g. Vente, Support, Conseil..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Type de client (DISC)</label>
          <select
            value={typeClient}
            onChange={e => setTypeClient(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">Sélectionner un profil DISC</option>
            <option value="D">D : Direct et axé sur les résultats</option>
            <option value="I">I : Enthousiaste et relationnel</option>
            <option value="S">S : Rassurant et stable</option>
            <option value="C">C : Structuré et analytique</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Contexte spécifique</label>
          <input
            type="text"
            value={contexte}
            onChange={e => setContexte(e.target.value)}
            placeholder="e.g. Historique client, émotion, objections..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Langue & ton souhaité</label>
          <input
            type="text"
            value={langueTon}
            onChange={e => setLangueTon(e.target.value)}
            placeholder="e.g. Formel, chaleureux, professionnel..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button
          type="submit"
          disabled={
            isLoading ||
            !domaine.trim() ||
            !objectif.trim() ||
            !typeClient.trim()
          }
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
            {(() => {
              let scriptArray: { actor: string; replica: string; phase: string }[] = [];
              try {
                scriptArray = typeof response.data?.script === 'string' ? JSON.parse(response.data.script) : [];
              } catch (e) {
                return <div className="text-red-600">Failed to parse script. Please try again or refine your prompt.</div>;
              }
              if (!Array.isArray(scriptArray) || scriptArray.length === 0) {
                return <div className="text-gray-500 italic">No script generated.</div>;
              }
              // Group by phase
              const phases = [
                "Context & Preparation",
                "SBAM & Opening",
                "Legal & Compliance",
                "Need Discovery",
                "Value Proposition",
                "Documents/Quote",
                "Objection Handling",
                "Confirmation & Closing",
                "Post-Call Actions"
              ];
              const grouped: { [phase: string]: { actor: string; replica: string }[] } = {};
              scriptArray.forEach(step => {
                if (!grouped[step.phase]) grouped[step.phase] = [];
                grouped[step.phase].push({ actor: step.actor, replica: step.replica });
              });
              return (
                <div className="space-y-8">
                  {phases.filter(phase => grouped[phase]).map(phase => (
                    <div key={phase}>
                      <h4 className="text-md font-bold text-blue-700 mb-2">{phase}</h4>
                      <div className="space-y-2">
                        {grouped[phase].map((step, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <span className={`font-semibold ${step.actor === 'agent' ? 'text-green-700' : 'text-purple-700'}`}>{step.actor === 'agent' ? 'Agent' : 'Lead'}:</span>
                            <span className="text-gray-800">{step.replica}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  {/* Show any extra phases not in the standard list */}
                  {Object.keys(grouped).filter(phase => !phases.includes(phase)).map(phase => (
                    <div key={phase}>
                      <h4 className="text-md font-bold text-blue-700 mb-2">{phase}</h4>
                      <div className="space-y-2">
                        {grouped[phase].map((step, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <span className={`font-semibold ${step.actor === 'agent' ? 'text-green-700' : 'text-purple-700'}`}>{step.actor === 'agent' ? 'Agent' : 'Lead'}:</span>
                            <span className="text-gray-800">{step.replica}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}
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