import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';
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
import ScriptGenerator from './components/ScriptGenerator';

// ⬇️ Ajoute le qiankun helper
import { qiankunWindow } from 'vite-plugin-qiankun/dist/helper';

function App() {
  const isStandaloneMode = import.meta.env.VITE_RUN_MODE === 'standalone';
  const basename = isStandaloneMode ? '/' : '/knowledgebase';

  return (
    <AuthProvider>
      <Router basename={basename}>
        <div className="flex flex-col h-screen bg-gray-50">
          {/* Header avec logo et logout */}
          <Header />
          
          {/* Contenu principal */}
          <div className="flex-1 overflow-hidden">
            <main className="h-full overflow-y-auto">
              <Routes>
                {/* Routes protégées */}
                <Route path="/upload" element={
                  <ProtectedRoute>
                    <KnowledgeBase />
                  </ProtectedRoute>
                } />
                <Route path="/" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="/app9" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="/contacts" element={
                  <ProtectedRoute>
                    <ContactsList />
                  </ProtectedRoute>
                } />
                <Route path="/search" element={
                  <ProtectedRoute>
                    <AISearch />
                  </ProtectedRoute>
                } />
                <Route path="/insights" element={
                  <ProtectedRoute>
                    <AIInsights />
                  </ProtectedRoute>
                } />
                <Route path="/knowledge-insights" element={
                  <ProtectedRoute>
                    <KnowledgeInsights />
                  </ProtectedRoute>
                } />
                <Route path="/knowledge-query" element={
                  <ProtectedRoute>
                    <KnowledgeQuery />
                  </ProtectedRoute>
                } />
                <Route path="/assistant" element={
                  <ProtectedRoute>
                    <AIAssistant />
                  </ProtectedRoute>
                } />
                <Route path="/augmented-learning" element={
                  <ProtectedRoute>
                    <AugmentedLearning />
                  </ProtectedRoute>
                } />
                <Route path="/companies" element={
                  <ProtectedRoute>
                    <CompanyManagement />
                  </ProtectedRoute>
                } />
                <Route path="/users" element={
                  <ProtectedRoute>
                    <UserManagement />
                  </ProtectedRoute>
                } />
                <Route path="/permissions" element={
                  <ProtectedRoute>
                    <PermissionsManagement />
                  </ProtectedRoute>
                } />
                <Route path="/tags" element={
                  <ProtectedRoute>
                    <div className="p-6">
                      <h1 className="text-2xl font-bold">Tags Management</h1>
                      <p className="mt-4">This feature is coming soon.</p>
                    </div>
                  </ProtectedRoute>
                } />
                <Route path="/analytics" element={
                  <ProtectedRoute>
                    <div className="p-6">
                      <h1 className="text-2xl font-bold">Analytics</h1>
                      <p className="mt-4">This feature is coming soon.</p>
                    </div>
                  </ProtectedRoute>
                } />
                <Route path="/settings" element={
                  <ProtectedRoute>
                    <div className="p-6">
                      <h1 className="text-2xl font-bold">Settings</h1>
                      <p className="mt-4">This feature is coming soon.</p>
                    </div>
                  </ProtectedRoute>
                } />
                <Route path="/script-generator" element={
                  <ProtectedRoute>
                    <ScriptGenerator />
                  </ProtectedRoute>
                } />
              </Routes>
            </main>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
