import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Calendar, 
  Users, 
  BarChart3, 
  Bot, 
  Settings, 
  Sparkles, 
  FileText, 
  Mail, 
  Globe, 
  LogOut, 
  BookOpen,
  Activity,
  Zap,
  Star,
  Target
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

const Sidebar = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const navLinkClasses = "flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-all duration-300 group";
  const activeLinkClasses = "bg-gray-700 text-white border-l-4 border-blue-500";

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    navigate('/admin-agentic/login');
  };

  const menuItems = [
    {
      to: '/admin-agentic',
      end: true,
      icon: Home,
      label: 'Dashboard',
      badge: null
    },
    {
      to: '/admin-agentic/newsletter',
      icon: Mail,
      label: 'Newsletter',
      badge: { text: 'New', variant: 'default' as const }
    },
    {
      to: '/admin-agentic/website',
      icon: Globe,
      label: 'Website Manager',
      badge: null
    },
    {
      to: '/admin-agentic/meetings',
      icon: Calendar,
      label: 'Meetings',
      badge: null
    },
    {
      to: '/admin-agentic/contacts',
      icon: Users,
      label: 'Contacts',
      badge: { text: 'Hot', variant: 'destructive' as const }
    },
    {
      to: '/admin-agentic/content',
      icon: FileText,
      label: 'Content Manager',
      badge: null
    },
    {
      to: '/admin-agentic/content-generator',
      icon: Sparkles,
      label: 'Content Generator',
      badge: { text: 'AI', variant: 'secondary' as const }
    },
    {
      to: '/admin-agentic/resources',
      icon: BookOpen,
      label: 'Resource Manager',
      badge: null
    },
    {
      to: '/admin-agentic/chatbot',
      icon: Bot,
      label: 'Chatbot',
      badge: null
    }
  ];

  return (
    <div className="w-64 bg-gray-800 text-white flex flex-col border-r border-gray-700 shadow-2xl">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-6 py-6 bg-gray-900 border-b border-gray-700"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">
              Agentic AI
            </h2>
            <p className="text-xs text-gray-400">Admin Dashboard</p>
          </div>
        </div>
      </motion.div>
      
      {/* System Status */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="px-4 py-4 mx-4 mt-4 bg-green-900/20 rounded-lg border border-green-500/30"
      >
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-xs text-green-300 font-medium">System Online</span>
        </div>
        <div className="flex items-center justify-between mt-1">
          <span className="text-xs text-gray-400">Status</span>
          <Badge variant="outline" className="bg-green-900/30 text-green-300 border-green-500/50 text-xs px-2 py-0">
            Healthy
          </Badge>
        </div>
      </motion.div>
      
      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item, index) => (
          <motion.div
            key={item.to}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + index * 0.05 }}
          >
            <NavLink 
              to={item.to} 
              end={item.end}
              className={({ isActive }) => `${navLinkClasses} ${isActive ? activeLinkClasses : ''}`}
            >
              <item.icon className="w-5 h-5 mr-3 text-gray-400 group-hover:text-white transition-colors duration-200" />
              <span className="flex-1 text-gray-300 group-hover:text-white transition-colors duration-200">{item.label}</span>
              {item.badge && (
                <Badge 
                  variant={item.badge.variant} 
                  className="ml-2 text-xs bg-gray-700 text-gray-200 border-gray-600"
                >
                  {item.badge.text}
                </Badge>
              )}
            </NavLink>
          </motion.div>
        ))}
      </nav>

      {/* Analytics Quick View */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="px-4 py-4 mx-4 mb-4 bg-gray-700/50 rounded-lg border border-gray-600"
      >
        <div className="flex items-center gap-2 mb-3">
          <BarChart3 className="w-4 h-4 text-blue-400" />
          <span className="text-sm font-medium text-blue-300">Quick Stats</span>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-400">Active Users</span>
            <span className="text-xs font-medium text-white">142</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-400">Health Score</span>
            <span className="text-xs font-medium text-green-300">98.5%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-400">Performance</span>
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 text-yellow-400" />
              <span className="text-xs font-medium text-white">4.9</span>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Footer */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="px-4 py-4 border-t border-gray-700 bg-gray-900"
      >
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-3 text-gray-300 hover:bg-red-900/30 hover:text-white rounded-lg transition-all duration-300 group border border-transparent hover:border-red-500/30"
        >
          <LogOut className="w-5 h-5 mr-3 text-gray-400 group-hover:text-red-400 transition-colors duration-200" />
          <span className="text-gray-300 group-hover:text-white transition-colors duration-200">Logout</span>
        </button>
      </motion.div>
    </div>
  );
};

export default Sidebar;