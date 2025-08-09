import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Calendar, Users, BarChart3, Bot, Settings } from 'lucide-react';

const Sidebar = () => {
  const navLinkClasses = "flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md transition-colors";
  const activeLinkClasses = "bg-gray-700 text-white";

  return (
    <div className="w-64 bg-gray-800 text-white flex flex-col">
      <div className="px-6 py-4 bg-gray-900 text-2xl font-bold text-white">
        Admin Panel
      </div>
      <nav className="flex-1 px-4 py-4 space-y-2">
        <NavLink to="/admin-agentic" end className={({ isActive }) => `${navLinkClasses} ${isActive ? activeLinkClasses : ''}`}>
          <Home className="w-5 h-5 mr-3" />
          Dashboard
        </NavLink>
        <NavLink to="/admin-agentic/meetings" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeLinkClasses : ''}`}>
          <Calendar className="w-5 h-5 mr-3" />
          Meetings
        </NavLink>
        <NavLink to="/admin-agentic/contacts" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeLinkClasses : ''}`}>
          <Users className="w-5 h-5 mr-3" />
          Contacts
        </NavLink>
        <NavLink to="/admin-agentic/analytics" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeLinkClasses : ''}`}>
          <BarChart3 className="w-5 h-5 mr-3" />
          Analytics
        </NavLink>
        <NavLink to="/admin-agentic/chatbot" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeLinkClasses : ''}`}>
          <Bot className="w-5 h-5 mr-3" />
          Chatbot
        </NavLink>
        <NavLink to="/admin-agentic/settings" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeLinkClasses : ''}`}>
          <Settings className="w-5 h-5 mr-3" />
          Settings
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;
