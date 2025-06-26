import React, { useState, useEffect } from 'react';
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
      gigInfo?: {
        gigId: string;
        gigTitle: string;
        gigCategory: string;
      };
    };
  };
  error?: {
    message: string;
    code?: string;
    details?: string;
  };
}

interface Gig {
  _id: string;
  title: string;
  description: string;
  category: string;
  userId: string;
  companyId: string;
  destination_zone: string;
  seniority: {
    level: string;
    yearsExperience: string;
  };
  skills: {
    professional: Array<{
      skill: string;
      level: number;
      details: string;
    }>;
    technical: Array<{
      skill: string;
      level: number;
      details: string;
    }>;
    soft: Array<{
      skill: string;
      level: number;
      details: string;
    }>;
    languages: Array<{
      language: string;
      proficiency: string;
      iso639_1: string;
    }>;
  };
  availability: {
    schedule: Array<{
      day: string;
      hours: {
        start: string;
        end: string;
      };
    }>;
    timeZone: string;
    flexibility: string[];
    minimumHours: {
      daily: number;
      weekly: number;
      monthly: number;
    };
  };
  commission: {
    base: string;
    baseAmount: string;
    bonus: string;
    bonusAmount: string;
    structure: string;
    currency: string;
    minimumVolume: {
      amount: string;
      period: string;
      unit: string;
    };
    transactionCommission: {
      type: string;
      amount: string;
    };
  };
  leads: {
    types: Array<{
      type: 'hot' | 'warm' | 'cold';
      percentage: number;
      description: string;
      conversionRate: number;
    }>;
    sources: string[];
  };
  team: {
    size: string;
    structure: Array<{
      roleId: string;
      count: number;
      seniority: {
        level: string;
        yearsExperience: string;
      };
    }>;
    territories: string[];
  };
  documentation: {
    product: Array<{
      name: string;
      url: string;
    }>;
    process: Array<{
      name: string;
      url: string;
    }>;
    training: Array<{
      name: string;
      url: string;
    }>;
  };
  createdAt: string;
  updatedAt: string;
}

const ScriptGenerator: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<ScriptResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [domaine, setDomaine] = useState('');
  const [typeClient, setTypeClient] = useState('');
  const [contexte, setContexte] = useState('');
  const [langueTon, setLangueTon] = useState('');
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [selectedGig, setSelectedGig] = useState<Gig | null>(null);
  const [isLoadingGigs, setIsLoadingGigs] = useState(false);
  const [gigsError, setGigsError] = useState<string | null>(null);

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

  const isInAppMode = () => {
    return (import.meta.env.VITE_RUN_MODE || 'in-app') === 'in-app';
  };

  const handleBackToOrchestrator = () => {
    const orchestratorUrl = import.meta.env.VITE_COMPANY_ORCHESTRATOR_URL;
    if (orchestratorUrl) {
      window.location.href = orchestratorUrl;
    }
  };

  const fetchGigs = async () => {
    const companyId = getCompanyId();
    console.log('[GIGS] Fetching gigs for companyId:', companyId);
    if (!companyId) {
      setGigsError('Company ID not found');
      return;
    }

    setIsLoadingGigs(true);
    setGigsError(null);
    
    try {
      const gigsApiUrl = import.meta.env.VITE_GIGS_API_URL;
      if (!gigsApiUrl) {
        throw new Error('Gigs API URL not configured');
      }

      const response = await fetch(`${gigsApiUrl}/gigs/company/${companyId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch gigs: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('[GIGS] API response:', data);
      setGigs(Array.isArray(data.data) ? data.data : []);
    } catch (err: any) {
      console.error('[GIGS] Error fetching gigs:', err);
      setGigsError(err.message || 'Failed to fetch gigs');
    } finally {
      setIsLoadingGigs(false);
    }
  };

  useEffect(() => {
    fetchGigs();
  }, []);

  const handleGigSelection = (gig: Gig) => {
    setSelectedGig(gig);
    setDomaine(gig.category || '');
  };

  const updateOnboardingProgress = async () => {
    try {
      const companyId = getCompanyId();
      if (!companyId) throw new Error('Company ID not found');
      const apiUrl = import.meta.env.VITE_API_URL_ONBOARDING;
      const endpoint = `${apiUrl}/onboarding/companies/${companyId}/onboarding/phases/2/steps/8`;
      const response = await apiClient.put(endpoint, { status: 'completed' });
      console.log('Onboarding progress (script) update response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error updating onboarding progress (script):', error);
      throw error;
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
      if (!selectedGig) throw new Error('Vous devez sélectionner un gig pour générer un script.');
      const requestData: any = {
        companyId,
        gig: selectedGig,
        typeClient,
        langueTon,
        contexte
      };
      const apiResponse = await apiClient.post<ScriptResponse>('/rag/generate-script', requestData);
      setResponse(apiResponse.data);
      // Update onboarding progress for script creation (phase 2, step 8)
      try {
        await updateOnboardingProgress();
        console.log('Successfully updated onboarding progress (script)');
      } catch (err) {
        // Log but do not block script creation
        console.error('Failed to update onboarding progress (script):', err);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Failed to generate script');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Back arrow for in-app mode */}
      {isInAppMode() && (
        <div className="mb-6">
          <button
            onClick={handleBackToOrchestrator}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back to Orchestrator</span>
          </button>
        </div>
      )}

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Script Generator</h2>
        <p className="text-gray-600">
          Generate a call script based on your company knowledge base (documents & call recordings).
        </p>
      </div>

      {/* Gigs Selection */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Select a Gig</h3>
        {isLoadingGigs ? (
          <div className="text-gray-600">Loading gigs...</div>
        ) : gigsError ? (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 font-medium">Error loading gigs</p>
            <p className="text-red-700 mt-1">{gigsError}</p>
          </div>
        ) : gigs.length === 0 ? (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800">No gigs found for this company.</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {gigs.map((gig) => (
              <div
                key={gig._id}
                onClick={() => handleGigSelection(gig)}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedGig?._id === gig._id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-gray-900">{gig.title || 'Untitled Gig'}</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {gig.description ? gig.description.substring(0, 100) + '...' : 'No description'}
                    </p>
                    {gig.category && (
                      <span className="inline-block mt-2 px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                        {gig.category}
                      </span>
                    )}
                  </div>
                  {selectedGig?._id === gig._id && (
                    <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Formulaire de génération de script */}
      {gigs.length > 0 && (
        <form onSubmit={handleSubmit} className="mb-8 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Domaine</label>
            <input
              type="text"
              value={domaine}
              readOnly
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 cursor-not-allowed focus:ring-0 focus:border-gray-300"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type de client (DISC) <span className="text-red-500">*</span></label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Contexte spécifique (optionnel mais recommandé)</label>
            <input
              type="text"
              value={contexte}
              onChange={e => setContexte(e.target.value)}
              placeholder="e.g. Historique client, émotion, objections..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Langue & ton souhaité <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={langueTon}
              onChange={e => setLangueTon(e.target.value)}
              placeholder="e.g. Formel, chaleureux, professionnel..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <button
            type="submit"
            disabled={
              isLoading ||
              !selectedGig ||
              !domaine.trim() ||
              !typeClient.trim() ||
              !langueTon.trim()
            }
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? 'Génération en cours...' : 'Générer le script'}
          </button>
        </form>
      )}
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
                {response.data.metadata.gigInfo && (
                  <div className="border-t border-gray-200 pt-2 mt-2">
                    <p className="font-semibold text-gray-700 mb-1">Generated for Gig:</p>
                    <p><span className="font-semibold text-gray-700">Title:</span> {response.data.metadata.gigInfo.gigTitle}</p>
                    <p><span className="font-semibold text-gray-700">Category:</span> {response.data.metadata.gigInfo.gigCategory}</p>
                  </div>
                )}
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