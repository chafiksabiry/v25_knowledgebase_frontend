import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import ContactsList from './components/ContactsList';
import AISearch from './components/AISearch';
import AIInsights from './components/AIInsights';
import KnowledgeBase from './components/KnowledgeBase';
import KnowledgeInsights from './components/KnowledgeInsights';
import AIAssistant from './components/AIAssistant';
import AugmentedLearning from './components/AugmentedLearning';
import CompanyManagement from './components/CompanyManagement';
import UserManagement from './components/UserManagement';
import PermissionsManagement from './components/PermissionsManagement';

function App() {
  return (
    <Router>
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/contacts" element={<ContactsList />} />
              <Route path="/search" element={<AISearch />} />
              <Route path="/insights" element={<AIInsights />} />
              <Route path="/knowledge" element={<KnowledgeBase />} />
              <Route path="/knowledge-insights" element={<KnowledgeInsights />} />
              <Route path="/assistant" element={<AIAssistant />} />
              <Route path="/augmented-learning" element={<AugmentedLearning />} />
              <Route path="/companies" element={<CompanyManagement />} />
              <Route path="/users" element={<UserManagement />} />
              <Route path="/permissions" element={<PermissionsManagement />} />
              <Route path="/tags" element={<div className="p-6"><h1 className="text-2xl font-bold">Tags Management</h1><p className="mt-4">This feature is coming soon.</p></div>} />
              <Route path="/analytics" element={<div className="p-6"><h1 className="text-2xl font-bold">Analytics</h1><p className="mt-4">This feature is coming soon.</p></div>} />
              <Route path="/settings" element={<div className="p-6"><h1 className="text-2xl font-bold">Settings</h1><p className="mt-4">This feature is coming soon.</p></div>} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;