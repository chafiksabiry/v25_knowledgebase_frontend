import React, { useState, useEffect } from 'react';
import { Brain, FileText, Video, Link as LinkIcon, BarChart2, TrendingUp, Search } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import apiClient from '../api/client';
import { jwtDecode } from 'jwt-decode';

const KnowledgeInsights: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [knowledgeBase, setKnowledgeBase] = useState<any[]>([]);
  const [analysis, setAnalysis] = useState<any | null>(null);
  type AnalysisStatus = 'idle' | 'processing' | 'completed' | 'failed';
  const [analysisStatus, setAnalysisStatus] = useState<AnalysisStatus>('idle');
  
  // Count resources by type
  const documentCount = knowledgeBase.filter(item => item.type === 'document').length;
  const videoCount = knowledgeBase.filter(item => item.type === 'video').length;
  const linkCount = knowledgeBase.filter(item => item.type === 'link').length;
  
  // Get recent resources
  const recentResources = [...knowledgeBase]
    .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())
    .slice(0, 5);

  // Function to get companyId from JWT
  const getCompanyIdFromToken = () => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      console.log('No JWT token found in localStorage');
      return null;
    }
    try {
      const decoded: any = jwtDecode(token);
      return decoded.companyId;
    } catch (error) {
      console.error('Failed to decode JWT:', error);
      return null;
    }
  };

  // Fetch documents and latest analysis
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const companyId = getCompanyIdFromToken();
        
        if (!companyId) {
          throw new Error('Company ID not found');
        }

        // Fetch documents
        const docsResponse = await apiClient.get('/documents', {
          params: { companyId }
        });

        const documents = docsResponse.data.documents.map((doc: any) => ({
          id: doc._id,
          name: doc.name,
          description: doc.description,
          type: doc.type || 'document',
          fileUrl: `${import.meta.env.VITE_BACKEND_API}${doc.fileUrl}`,
          uploadedAt: doc.uploadedAt,
          uploadedBy: doc.uploadedBy,
          tags: doc.tags,
          usagePercentage: doc.usagePercentage || 0,
          isPublic: doc.isPublic
        }));

        setKnowledgeBase(documents);

        // Fetch latest analysis
        const analysisResponse = await apiClient.get('/analysis', {
          params: { companyId }
        });

        if (analysisResponse.data.analyses && analysisResponse.data.analyses.length > 0) {
          const latestAnalysis = analysisResponse.data.analyses[0];
          setAnalysis(latestAnalysis);
          setAnalysisStatus(latestAnalysis.status);
          
          // Start new analysis if no analysis exists or if last analysis failed
          if (!latestAnalysis || latestAnalysis.status === 'failed') {
            await startNewAnalysis();
          }
        } else {
          // No analysis exists, start a new one
          await startNewAnalysis();
        }

      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to fetch insights data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Start new analysis
  const startNewAnalysis = async () => {
    try {
      const companyId = getCompanyIdFromToken();
      
      if (!companyId) {
        throw new Error('Company ID not found');
      }

      setAnalysisStatus('processing');
      
      const response = await apiClient.post('/analysis/knowledge-base', {
        companyId
      });

      // Poll for analysis completion
      const pollInterval = setInterval(async () => {
        try {
          const statusResponse = await apiClient.get(`/analysis/${response.data.analysisId}`);
          const currentAnalysis = statusResponse.data.analysis;

          if (currentAnalysis.status === 'completed' || currentAnalysis.status === 'failed') {
            clearInterval(pollInterval);
            setAnalysis(currentAnalysis);
            setAnalysisStatus(currentAnalysis.status);
          }
        } catch (error) {
          console.error('Error polling analysis status:', error);
          clearInterval(pollInterval);
          setAnalysisStatus('failed');
        }
      }, 5000); // Poll every 5 seconds

    } catch (error) {
      console.error('Error starting analysis:', error);
      setAnalysisStatus('failed');
      setError('Failed to start analysis');
    }
  };
  
  // Get resource icon
  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'document':
        return <FileText size={16} className="text-blue-500" />;
      case 'video':
        return <Video size={16} className="text-red-500" />;
      case 'link':
        return <LinkIcon size={16} className="text-green-500" />;
      default:
        return <FileText size={16} className="text-gray-500" />;
    }
  };
  
  // Get insight icon
  const getInsightIcon = (category: string) => {
    switch (category) {
      case 'gap':
        return <Search size={20} className="text-red-500" />;
      case 'recommendation':
        return <TrendingUp size={20} className="text-green-500" />;
      case 'strength':
        return <BarChart2 size={20} className="text-blue-500" />;
      case 'weakness':
        return <Search size={20} className="text-orange-500" />;
      default:
        return <Brain size={20} className="text-purple-500" />;
    }
  };
  
  // Get insight background color
  const getInsightBgColor = (category: string) => {
    switch (category) {
      case 'gap':
        return 'bg-red-50';
      case 'recommendation':
        return 'bg-green-50';
      case 'strength':
        return 'bg-blue-50';
      case 'weakness':
        return 'bg-orange-50';
      default:
        return 'bg-purple-50';
    }
  };

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Knowledge Insights</h1>
            <p className="text-gray-600">
              AI-generated insights about your knowledge base usage, content gaps, and recommendations
              for improving your documentation to better support contact handling.
            </p>
          </div>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Resources</p>
              <p className="text-2xl font-bold">{knowledgeBase.length}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <Brain size={24} className="text-purple-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Documents</p>
              <p className="text-2xl font-bold">{documentCount}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <FileText size={24} className="text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Videos</p>
              <p className="text-2xl font-bold">{videoCount}</p>
            </div>
            <div className="bg-red-100 p-3 rounded-full">
              <Video size={24} className="text-red-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Links</p>
              <p className="text-2xl font-bold">{linkCount}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <LinkIcon size={24} className="text-green-600" />
            </div>
          </div>
        </div>
      </div>
      
      {/* AI Insights */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 mb-8">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center">
            <Brain size={20} className="text-purple-600 mr-2" />
            <h2 className="text-lg font-semibold">AI-Generated Insights</h2>
          </div>
          {analysisStatus && (
            <button
              onClick={startNewAnalysis}
              className="flex items-center space-x-2 px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={analysisStatus === 'processing'}
              title={analysisStatus === 'processing' ? 'Analysis in progress...' : 'Start a new analysis'}
            >
              <Brain size={16} className={analysisStatus === 'processing' ? 'animate-spin' : ''} />
              <span>{analysisStatus === 'processing' ? 'Analyzing...' : 'Reanalyze'}</span>
            </button>
          )}
        </div>
        
        <div className="p-4 space-y-4">
          {analysis?.status === 'processing' ? (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
              <span className="text-gray-600">Analyzing knowledge base...</span>
            </div>
          ) : analysis?.status === 'completed' ? (
            <>
              {/* Summary */}
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Analysis Summary</h3>
                <p className="text-gray-700">{analysis.summary}</p>
              </div>

              {/* Metrics */}
              {analysis.metrics && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {Object.entries(analysis.metrics).map(([key, value]) => (
                    <div key={key} className="bg-white p-4 rounded-lg border border-gray-200">
                      <p className="text-sm text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                      <p className="text-2xl font-bold text-gray-900">{(Number(value) * 100).toFixed(0)}%</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Insights */}
              {analysis.insights && analysis.insights.length > 0 && (
                <div className="space-y-4">
                  {analysis.insights.map((insight: any, index: number) => (
                    <div 
                      key={index}
                      className={`p-4 rounded-lg ${getInsightBgColor(insight.category)}`}
                    >
                      <div className="flex items-start">
                        <div className="mr-4">
                          {getInsightIcon(insight.category)}
                        </div>
                        <div className="flex-grow">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="text-lg font-medium text-gray-900">{insight.title}</h3>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              insight.severity === 'high' ? 'bg-red-100 text-red-800' :
                              insight.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {insight.severity.charAt(0).toUpperCase() + insight.severity.slice(1)} Priority
                            </span>
                          </div>
                          <p className="text-gray-700">{insight.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Content Gaps */}
              {analysis.contentGaps && analysis.contentGaps.length > 0 && (
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Content Gaps</h3>
                  <div className="space-y-4">
                    {analysis.contentGaps.map((gap: any, index: number) => (
                      <div key={index} className="border-b border-gray-200 last:border-0 pb-4 last:pb-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-grow">
                            <p className="text-gray-900 font-medium mb-1">{gap.description}</p>
                            <p className="text-sm text-gray-600 mb-2">Affected sections: {gap.affectedSections.join(', ')}</p>
                            <p className="text-sm text-gray-700">{gap.recommendation}</p>
                          </div>
                          <span className={`ml-4 px-2 py-1 text-xs rounded-full whitespace-nowrap ${
                            gap.severity === 'high' ? 'bg-red-100 text-red-800' :
                            gap.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {gap.severity.charAt(0).toUpperCase() + gap.severity.slice(1)} Priority
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendations */}
              {analysis.recommendations && analysis.recommendations.length > 0 && (
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Recommendations</h3>
                  <div className="space-y-4">
                    {analysis.recommendations.map((rec: any, index: number) => (
                      <div key={index} className="border-b border-gray-200 last:border-0 pb-4 last:pb-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-grow">
                            <p className="text-gray-900 font-medium mb-1">{rec.description}</p>
                            <p className="text-sm text-gray-600 mb-2">Impact: {rec.impact}</p>
                            <p className="text-sm text-gray-700">Implementation: {rec.implementationDifficulty}</p>
                          </div>
                          <span className={`ml-4 px-2 py-1 text-xs rounded-full whitespace-nowrap ${
                            rec.priority === 'high' ? 'bg-red-100 text-red-800' :
                            rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {rec.priority.charAt(0).toUpperCase() + rec.priority.slice(1)} Priority
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : analysis?.status === 'failed' ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              <strong className="font-bold">Analysis failed!</strong>
              <p className="mt-2">There was an error analyzing your knowledge base. Please try again.</p>
              <button
                onClick={startNewAnalysis}
                className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center"
              >
                <Brain size={18} className="mr-2" />
                Retry Analysis
              </button>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <Brain size={24} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No analysis available</h3>
              <p className="text-gray-500 max-w-md mx-auto mb-4">
                Start a new analysis to get AI-generated insights about your knowledge base.
              </p>
              <button
                onClick={startNewAnalysis}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center mx-auto"
              >
                <Brain size={18} className="mr-2" />
                Start Analysis
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Recent Resources */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="p-4 border-b border-gray-100 flex items-center">
          <FileText size={20} className="text-blue-600 mr-2" />
          <h2 className="text-lg font-semibold">Recently Added Resources</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Added
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usage
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentResources.map((resource) => (
                <tr key={resource.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center">
                        {getResourceIcon(resource.type)}
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{resource.name}</div>
                        <div className="text-xs text-gray-500 max-w-xs truncate">{resource.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      resource.type === 'document' ? 'bg-blue-100 text-blue-800' : 
                      resource.type === 'video' ? 'bg-red-100 text-red-800' : 
                      'bg-green-100 text-green-800'
                    }`}>
                      {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(parseISO(resource.uploadedAt), 'MMM d, yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-blue-600 h-2.5 rounded-full" 
                          style={{ width: `${resource.usagePercentage}%` }}
                        ></div>
                      </div>
                      <span className="ml-2 text-xs text-gray-500">{resource.usagePercentage}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeInsights;