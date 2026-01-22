import React, { useState } from 'react';
import { Bell, Search, User, ChevronDown, Building, LogOut, Settings } from 'lucide-react';
import { mockUsers, mockCompanies } from '../data/mockData';

// Get the current user (in a real app, this would come from authentication)
const currentUser = mockUsers[0]; // Alex Morgan, admin at Acme Corporation
const currentCompany = mockCompanies.find(company => company.id === currentUser.companyId);

const Header: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  
  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6">
      <div className="relative w-96">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search size={18} className="text-gray-400" />
        </div>
        <input
          type="text"
          className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
          placeholder="Search contacts, companies, or notes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <div className="flex items-center space-x-4">
        {currentUser.role === 'admin' && (
          <div className="flex items-center text-sm text-gray-700 bg-gray-100 px-3 py-1 rounded-lg">
            <Building size={16} className="mr-2 text-gray-500" />
            <span>{currentCompany?.name}</span>
            <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
              {currentCompany?.plan.charAt(0).toUpperCase() + currentCompany?.plan.slice(1)}
            </span>
          </div>
        )}
        
        <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full">
          <Bell size={20} />
          <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
            3
          </span>
        </button>
        
        <div className="relative">
          <button 
            className="flex items-center space-x-2 focus:outline-none"
            onClick={() => setUserMenuOpen(!userMenuOpen)}
          >
            <div className="bg-blue-100 p-2 rounded-full">
              {currentUser.avatar ? (
                <img 
                  src={currentUser.avatar} 
                  alt={currentUser.name} 
                  className="h-6 w-6 rounded-full"
                />
              ) : (
                <User size={20} className="text-blue-600" />
              )}
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium">{currentUser.name}</p>
              <p className="text-xs text-gray-500 capitalize">{currentUser.role}</p>
            </div>
            <ChevronDown size={16} className="text-gray-500" />
          </button>
          
          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-sm font-medium">{currentUser.name}</p>
                <p className="text-xs text-gray-500">{currentUser.email}</p>
              </div>
              <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                <User size={16} className="mr-2 text-gray-500" />
                My Profile
              </a>
              <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                <Settings size={16} className="mr-2 text-gray-500" />
                Account Settings
              </a>
              {currentUser.role === 'admin' && (
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                  <Building size={16} className="mr-2 text-gray-500" />
                  Company Settings
                </a>
              )}
              <div className="border-t border-gray-100 mt-1"></div>
              <a href="#" className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center">
                <LogOut size={16} className="mr-2" />
                Sign Out
              </a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;