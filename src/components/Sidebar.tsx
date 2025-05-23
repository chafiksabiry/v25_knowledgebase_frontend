import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Users, Search, Tag, BarChart2, Settings, Brain, Home, FileText, MessageSquare, Zap, Building, UserPlus, Shield, ChevronDown, ChevronRight } from 'lucide-react';
import { mockUsers } from '../data/mockData';
import { OnboardingProgress, Phase } from '../types/onboarding';

interface SidebarProps {
  progress: OnboardingProgress | null;
}

// Get the current user (in a real app, this would come from authentication)
const currentUser = mockUsers[0]; // Alex Morgan, admin at Acme Corporation

const Sidebar: React.FC<SidebarProps> = ({ progress }) => {
  const location = useLocation();
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);

  // Find phase 1 and check if step 3 is completed
  const phase1 = progress?.phases.find(phase => phase.id === 1);
  const step3 = phase1?.steps.find(step => step.id === 3);
  const isPhase1Step3Completed = step3?.status === 'completed';

  const canAccessOtherSections = progress && 
    ((progress.currentPhase > 2) || 
    (progress.currentPhase === 2 && isPhase1Step3Completed));
  
  // Define navigation items based on user role and progress
  const navItems = [
    { path: '/', icon: <Home size={20} />, label: 'Dashboard', roles: ['admin', 'manager', 'rep'] },
    { path: '/contacts', icon: <Users size={20} />, label: 'Contacts', roles: ['admin', 'manager', 'rep'] },
    { path: '/search', icon: <Search size={20} />, label: 'AI Search', roles: ['admin', 'manager', 'rep'] },
    { path: '/upload', icon: <FileText size={20} />, label: 'Knowledge Base', roles: ['admin', 'manager', 'rep'] },
    { path: '/knowledge-insights', icon: <Brain size={20} />, label: 'KB Insights', roles: ['admin', 'manager'] },
    { path: '/knowledge-query', icon: <MessageSquare size={20} />, label: 'Ask KB', roles: ['admin', 'manager', 'rep'] },
    { path: '/assistant', icon: <MessageSquare size={20} />, label: 'AI Assistant', roles: ['admin', 'manager', 'rep'] },
    { path: '/insights', icon: <Brain size={20} />, label: 'Contact Insights', roles: ['admin', 'manager', 'rep'] },
    { path: '/augmented-learning', icon: <Zap size={20} />, label: 'AI Learning', roles: ['admin'] },
    { path: '/tags', icon: <Tag size={20} />, label: 'Tags', roles: ['admin', 'manager'] },
    { path: '/analytics', icon: <BarChart2 size={20} />, label: 'Analytics', roles: ['admin', 'manager'] },
  ];
  
  // Admin-only items
  const adminItems = [
    { path: '/companies', icon: <Building size={20} />, label: 'Companies', roles: ['admin'] },
    { path: '/users', icon: <UserPlus size={20} />, label: 'User Management', roles: ['admin'] },
    { path: '/permissions', icon: <Shield size={20} />, label: 'Permissions', roles: ['admin'] },
    { path: '/settings', icon: <Settings size={20} />, label: 'Settings', roles: ['admin', 'manager'] },
  ];
  
  // Filter items based on user role and progress
  const filteredNavItems = navItems.filter(item => {
    const hasRole = item.roles.includes(currentUser.role);
    if (item.path === '/upload') return hasRole; // Always show upload
    return hasRole && canAccessOtherSections;
  });

  const filteredAdminItems = adminItems.filter(item => {
    const hasRole = item.roles.includes(currentUser.role);
    return hasRole && canAccessOtherSections;
  });

  return (
    <div className="bg-gray-800 text-white w-64 flex-shrink-0 h-screen overflow-y-auto">
      <div className="p-4 flex items-center space-x-2">
        <Brain size={24} className="text-blue-400" />
        <h1 className="text-xl font-bold">AI Knowledge Hub</h1>
      </div>
      
      <div className="px-4 py-2">
        <div className="bg-gray-700 rounded-lg p-3">
          <div className="flex items-center">
            <div className="bg-blue-500 p-2 rounded-full">
              {currentUser.avatar ? (
                <img 
                  src={currentUser.avatar} 
                  alt={currentUser.name} 
                  className="h-6 w-6 rounded-full"
                />
              ) : (
                <Users size={16} className="text-white" />
              )}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-white">{currentUser.name}</p>
              <p className="text-xs text-gray-300 capitalize">{currentUser.role}</p>
            </div>
          </div>
        </div>
      </div>
      
      <nav className="mt-4">
        {filteredNavItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center px-4 py-2 text-sm ${
              location.pathname === item.path
                ? 'bg-gray-700 text-white'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
          >
            {item.icon}
            <span className="ml-3">{item.label}</span>
          </Link>
        ))}
        
        {filteredAdminItems.length > 0 && (
          <>
            <button
              className="w-full flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
              onClick={() => setAdminMenuOpen(!adminMenuOpen)}
            >
              <Settings size={20} />
              <span className="ml-3">Administration</span>
              {adminMenuOpen ? (
                <ChevronDown size={16} className="ml-auto" />
              ) : (
                <ChevronRight size={16} className="ml-auto" />
              )}
            </button>
            
            {adminMenuOpen && (
              <div className="bg-gray-900">
                {filteredAdminItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center px-4 py-2 text-sm pl-11 ${
                      location.pathname === item.path
                        ? 'bg-gray-700 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    {item.icon}
                    <span className="ml-3">{item.label}</span>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </nav>
      
      <div className="p-4 mt-8">
        <div className="bg-gray-700 p-3 rounded-lg">
          <p className="text-sm text-gray-300">AI Assistant</p>
          <p className="text-xs text-gray-400 mt-1">Get real-time help during customer calls</p>
          <Link to="/assistant">
            <button className="mt-2 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded-md text-sm transition-colors">
              Open AI Assistant
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;