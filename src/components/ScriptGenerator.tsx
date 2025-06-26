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

interface Script {
  _id: string;
  gigId: string;
  targetClient: string;
  language: string;
  details?: string;
  script: { phase: string; actor: string; replica: string }[];
  createdAt: string;
  gig?: Gig;
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
  const [scripts, setScripts] = useState<Script[]>([]);
  const [isLoadingScripts, setIsLoadingScripts] = useState(false);
  const [scriptsError, setScriptsError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showScriptId, setShowScriptId] = useState<string | null>(null);

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

  const fetchAllScripts = async () => {
    setIsLoadingScripts(true);
    setScriptsError(null);
    try {
      const companyId = getCompanyId();
      if (!companyId) throw new Error('Company ID not found');
      const backendUrl = import.meta.env.VITE_BACKEND_API;
      if (!backendUrl) throw new Error('Backend API URL not configured');
      const url = `${backendUrl}/api/scripts/company/${companyId}`;
      console.log('[SCRIPTS] Fetching all scripts for companyId:', companyId, 'URL:', url);
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Failed to fetch scripts: ${response.statusText}`);
      const data = await response.json();
      console.log('[SCRIPTS] API response:', data);
      setScripts(Array.isArray(data.data) ? data.data : []);
    } catch (err: any) {
      console.error('[SCRIPTS] Error fetching scripts:', err);
      setScriptsError(err.message || 'Failed to fetch scripts');
    } finally {
      setIsLoadingScripts(false);
    }
  };

  const fetchScriptsForGig = async (gigId: string) => {
    setIsLoadingScripts(true);
    setScriptsError(null);
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_API;
      if (!backendUrl) throw new Error('Backend API URL not configured');
      const url = `${backendUrl}/scripts/gig/${gigId}`;
      console.log('[SCRIPTS] Fetching scripts for gigId:', gigId, 'URL:', url);
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Failed to fetch scripts: ${response.statusText}`);
      const data = await response.json();
      console.log('[SCRIPTS] API response:', data);
      setScripts(Array.isArray(data.data) ? data.data : []);
    } catch (err: any) {
      console.error('[SCRIPTS] Error fetching scripts for gig:', err);
      setScriptsError(err.message || 'Failed to fetch scripts for this gig');
      setScripts([]);
    } finally {
      setIsLoadingScripts(false);
    }
  };

  useEffect(() => {
    fetchGigs();
    fetchAllScripts();
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
      // Refresh scripts list and hide form
      await fetchAllScripts();
      setShowForm(false);
      setSelectedGig(null);
      setTypeClient('');
      setLangueTon('');
      setContexte('');
      setDomaine('');
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Failed to generate script');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGigSelectInForm = (gigId: string) => {
    const gig = gigs.find(g => g._id === gigId) || null;
    setSelectedGig(gig);
    setDomaine(gig?.category || '');
  };

  const toggleShowScript = (scriptId: string) => {
    setShowScriptId(prev => prev === scriptId ? null : scriptId);
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-2xl font-bold mb-2">Scripts générés</h2>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          onClick={() => setShowForm(v => !v)}
        >
          {showForm ? 'Annuler' : 'Générer un nouveau script'}
        </button>
      </div>
      {/* Tableau des scripts */}
      <div className="overflow-x-auto mb-10">
        {isLoadingScripts ? (
          <div className="text-gray-600">Chargement des scripts...</div>
        ) : scriptsError ? (
          <div className="p-2 bg-red-50 border border-red-200 rounded-lg text-red-700">{scriptsError}</div>
        ) : scripts.length === 0 ? (
          <div className="text-gray-500 italic">Aucun script généré pour cette société.</div>
        ) : (
          <table className="min-w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-3 py-2 border">Gig</th>
                <th className="px-3 py-2 border">Client cible</th>
                <th className="px-3 py-2 border">Langue</th>
                <th className="px-3 py-2 border">Date</th>
                <th className="px-3 py-2 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {scripts.map(script => {
                const gig = gigs.find(g => g._id === script.gigId);
                return (
                  <React.Fragment key={script._id}>
                    <tr>
                      <td className="px-3 py-2 border font-semibold">{gig?.title || gig?.category || script.gigId}</td>
                      <td className="px-3 py-2 border">{script.targetClient}</td>
                      <td className="px-3 py-2 border">{script.language}</td>
                      <td className="px-3 py-2 border">{new Date(script.createdAt).toLocaleString()}</td>
                      <td className="px-3 py-2 border text-center">
                        <button
                          className="text-blue-600 underline hover:text-blue-800"
                          onClick={() => toggleShowScript(script._id)}
                        >
                          {showScriptId === script._id ? 'Masquer' : 'Afficher'}
                        </button>
                      </td>
                    </tr>
                    {showScriptId === script._id && (
                      <tr>
                        <td colSpan={5} className="bg-blue-50 px-4 py-3">
                          {Array.isArray(script.script) && script.script.length > 0 ? (
                            <div className="pl-2 border-l-4 border-blue-200">
                              {script.script.map((step, idx) => (
                                <div key={idx} className="mb-1">
                                  <span className="font-semibold text-blue-700">[{step.phase}]</span>{' '}
                                  <span className={`font-semibold ${step.actor === 'agent' ? 'text-green-700' : 'text-purple-700'}`}>{step.actor === 'agent' ? 'Agent' : 'Lead'}:</span>{' '}
                                  <span className="text-gray-800">{step.replica}</span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-gray-400 italic">Script vide ou non disponible.</div>
                          )}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
      {/* Formulaire de génération de script */}
      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 space-y-4 bg-white border rounded-lg shadow p-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gig <span className="text-red-500">*</span></label>
            <select
              value={selectedGig?._id || ''}
              onChange={e => handleGigSelectInForm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Sélectionner un gig</option>
              {gigs.map(gig => (
                <option key={gig._id} value={gig._id}>{gig.title || gig.category}</option>
              ))}
            </select>
          </div>
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
          {error && (
            <div className="p-4 mb-6 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 font-medium">Une erreur est survenue</p>
              <p className="text-red-700 mt-1">{error}</p>
            </div>
          )}
        </form>
      )}
    </div>
  );
};

export default ScriptGenerator; 