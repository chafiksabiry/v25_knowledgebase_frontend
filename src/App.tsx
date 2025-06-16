import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Cookies from 'js-cookie';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import ContactsList from './components/ContactsList';
import AISearch from './components/AISearch';
import AIInsights from './components/AIInsights';
import KnowledgeBase from './components/KnowledgeBase';
import KnowledgeInsights from './components/KnowledgeInsights';
import KnowledgeQuery from './components/KnowledgeQuery';
import AIAssistant from './components/AIAssistant';
import AugmentedLearning from './components/AugmentedLearning';
import CompanyManagement from './components/CompanyManagement';
import UserManagement from './components/UserManagement';
import PermissionsManagement from './components/PermissionsManagement';
import ProtectedRoute from './components/ProtectedRoute';
import { OnboardingProgress } from './types/onboarding';

// ⬇️ Ajoute le qiankun helper
import { qiankunWindow } from 'vite-plugin-qiankun/dist/helper';

function App() {
  const isStandaloneMode = import.meta.env.VITE_RUN_MODE === 'standalone';
  const isInAppMode = import.meta.env.VITE_RUN_MODE === 'in-app';
  const basename = isStandaloneMode ? '/' : '/knowledgebase';
  const [progress, setProgress] = useState<OnboardingProgress | null>(null);

  useEffect(() => {
    // Only fetch and set progress if in in-app mode
    if (isInAppMode) {
      try {
        const progressData = Cookies.get('companyOnboardingProgress');
        if (progressData) {
          const parsedProgress = JSON.parse(progressData);
          setProgress(parsedProgress);
          console.log('Loaded onboarding progress:', parsedProgress);
        }
      } catch (error) {
        console.error('Error loading onboarding progress:', error);
      }
    }
  }, [isInAppMode]);

  return (
    <Router basename={basename}>
      <div className="flex h-screen bg-gray-50">
        <Sidebar progress={isInAppMode ? progress : null} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header onboardingProgress={isInAppMode ? progress : null} />
          <main className="flex-1 overflow-y-auto">
            <Routes>
              <Route path="/upload" element={<KnowledgeBase />} />
              <Route path="/" element={<ProtectedRoute element={<Dashboard />} />} />
              <Route path="/app9" element={<ProtectedRoute element={<Dashboard />} />} />
              <Route path="/contacts" element={<ProtectedRoute element={<ContactsList />} />} />
              <Route path="/search" element={<ProtectedRoute element={<AISearch />} />} />
              <Route path="/insights" element={<ProtectedRoute element={<AIInsights />} />} />
              <Route path="/knowledge-insights" element={<ProtectedRoute element={<KnowledgeInsights />} />} />
              <Route path="/knowledge-query" element={<ProtectedRoute element={<KnowledgeQuery />} />} />
              <Route path="/assistant" element={<ProtectedRoute element={<AIAssistant />} />} />
              <Route path="/augmented-learning" element={<ProtectedRoute element={<AugmentedLearning />} />} />
              <Route path="/companies" element={<ProtectedRoute element={<CompanyManagement />} />} />
              <Route path="/users" element={<ProtectedRoute element={<UserManagement />} />} />
              <Route path="/permissions" element={<ProtectedRoute element={<PermissionsManagement />} />} />
              <Route path="/tags" element={
                <ProtectedRoute element={
                  <div className="p-6">
                    <h1 className="text-2xl font-bold">Tags Management</h1>
                    <p className="mt-4">This feature is coming soon.</p>
                  </div>
                } />
              } />
              <Route path="/analytics" element={
                <ProtectedRoute element={
                  <div className="p-6">
                    <h1 className="text-2xl font-bold">Analytics</h1>
                    <p className="mt-4">This feature is coming soon.</p>
                  </div>
                } />
              } />
              <Route path="/settings" element={
                <ProtectedRoute element={
                  <div className="p-6">
                    <h1 className="text-2xl font-bold">Settings</h1>
                    <p className="mt-4">This feature is coming soon.</p>
                  </div>
                } />
              } />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
