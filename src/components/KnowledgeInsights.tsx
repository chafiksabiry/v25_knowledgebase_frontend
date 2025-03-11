import React, { useState } from 'react';
import { Brain, FileText, Video, Link as LinkIcon, BarChart2, TrendingUp, Search } from 'lucide-react';
import { mockKnowledgeBase } from '../data/mockData';
import { format, parseISO } from 'date-fns';

const KnowledgeInsights: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Count resources by type
  const documentCount = mockKnowledgeBase.filter(item => item.type === 'document').length;
  const videoCount = mockKnowledgeBase.filter(item => item.type === 'video').length;
  const linkCount = mockKnowledgeBase.filter(item => item.type === 'link').length;
  
  // Get recent resources
  const recentResources = [...mockKnowledgeBase]
    .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())
    .slice(0, 5);
  
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
  
  // Mock AI-generated insights
  const aiInsights = [
    {
      id: '1',
      title: 'Product Knowledge Gaps',
      content: 'Analysis of customer interactions reveals knowledge gaps about the API integration process. Consider adding more detailed documentation.',
      type: 'gap',
      relatedResources: ['3', '7']
    },
    {
      id: '2',
      title: 'Most Referenced Documentation',
      content: 'The "Quick Start Guide" is referenced in 68% of successful customer interactions. Ensure this document is kept up-to-date.',
      type: 'usage',
      relatedResources: ['1', '4']
    },
    {
      id: '3',
      title: 'Content Recommendation',
      content: 'Based on recent customer questions, a video tutorial on advanced features would be valuable for your knowledge base.',
      type: 'recommendation',
      relatedResources: []
    }
  ];
  
  // Get insight icon
  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'gap':
        return <Search size={20} className="text-red-500" />;
      case 'usage':
        return <BarChart2 size={20} className="text-blue-500" />;
      case 'recommendation':
        return <TrendingUp size={20} className="text-green-500" />;
      default:
        return <Brain size={20} className="text-purple-500" />;
    }
  };
  
  // Get insight background color
  const getInsightBgColor = (type: string) => {
    switch (type) {
      case 'gap':
        return 'bg-red-50';
      case 'usage':
        return 'bg-blue-50';
      case 'recommendation':
        return 'bg-green-50';
      default:
        return 'bg-purple-50';
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Knowledge Insights</h1>
        <p className="text-gray-600">
          AI-generated insights about your knowledge base usage, content gaps, and recommendations
          for improving your documentation to better support contact handling.
        </p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Resources</p>
              <p className="text-2xl font-bold">{mockKnowledgeBase.length}</p>
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
        <div className="p-4 border-b border-gray-100 flex items-center">
          <Brain size={20} className="text-purple-600 mr-2" />
          <h2 className="text-lg font-semibold">AI-Generated Insights</h2>
        </div>
        
        <div className="p-4 space-y-4">
          {aiInsights.map((insight) => (
            <div 
              key={insight.id} 
              className={`p-4 rounded-lg ${getInsightBgColor(insight.type)}`}
            >
              <div className="flex items-start">
                <div className="mr-4">
                  {getInsightIcon(insight.type)}
                </div>
                
                <div className="flex-grow">
                  <h3 className="text-lg font-medium text-gray-900 mb-1">{insight.title}</h3>
                  <p className="text-gray-700 mb-3">{insight.content}</p>
                  
                  {insight.relatedResources.length > 0 && (
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Related resources:</p>
                      <div className="flex flex-wrap gap-2">
                        {insight.relatedResources.map((resourceId) => {
                          const resource = mockKnowledgeBase.find(r => r.id === resourceId);
                          return resource ? (
                            <div 
                              key={resourceId}
                              className="flex items-center px-3 py-1 bg-white rounded-full text-sm border border-gray-200"
                            >
                              {getResourceIcon(resource.type)}
                              <span className="ml-1">{resource.name}</span>
                            </div>
                          ) : null;
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
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