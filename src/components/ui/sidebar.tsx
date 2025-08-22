import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
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
  Target,
  ChevronLeft,
  ChevronRight,
  Heart,
  Shield,
  Brain,
  Rocket,
  TrendingUp
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  
  const navLinkClasses = "flex items-center px-4 py-3 text-gray-300 hover:bg-gradient-to-r hover:from-blue-600/20 hover:to-purple-600/20 hover:text-white rounded-xl transition-all duration-300 group relative overflow-hidden";
  const activeLinkClasses = "bg-gradient-to-r from-blue-600/30 to-purple-600/30 text-white border-l-4 border-blue-400 shadow-lg shadow-blue-500/20";

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
      badge: null,
      description: 'Main overview'
    },
    {
      to: '/admin-agentic/newsletter',
      icon: Mail,
      label: 'Newsletter',
      badge: { text: 'AI', variant: 'default' as const },
      description: 'Email campaigns'
    },
    {
      to: '/admin-agentic/website',
      icon: Globe,
      label: 'Website Manager',
      badge: null,
      description: 'Site management'
    },
    {
      to: '/admin-agentic/meetings',
      icon: Calendar,
      label: 'Meetings',
      badge: null,
      description: 'Schedule & bookings'
    },
    {
      to: '/admin-agentic/contacts',
      icon: Users,
      label: 'Contacts',
      badge: { text: 'Live', variant: 'destructive' as const },
      description: 'Customer database'
    },
    {
      to: '/admin-agentic/content',
      icon: FileText,
      label: 'Content Manager',
      badge: null,
      description: 'Content library'
    },
    {
      to: '/admin-agentic/advanced-article-generator',
      icon: Brain,
      label: 'AI Article Generator',
      badge: { text: 'PRO', variant: 'default' as const },
      description: 'Smart content creation'
    },
    {
      to: '/admin-agentic/autopilot',
      icon: Rocket,
      label: 'Autopilot System',
      badge: { text: 'LIVE', variant: 'destructive' as const },
      description: 'Automated workflows'
    },
    {
      to: '/admin-agentic/resources',
      icon: BookOpen,
      label: 'Resource Manager',
      badge: null,
      description: 'Digital assets'
    },
    {
      to: '/admin-agentic/chatbot',
      icon: Bot,
      label: 'AI Assistant',
      badge: { text: 'Smart', variant: 'secondary' as const },
      description: 'Conversational AI'
    }
  ];

  return (
    <motion.div 
      className={`${isCollapsed ? 'w-20' : 'w-80'} bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white flex flex-col border-r border-gray-700/50 shadow-2xl backdrop-blur-sm transition-all duration-300`}
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <motion.div 
        className="px-6 py-6 bg-gradient-to-r from-gray-900/50 to-gray-800/50 border-b border-gray-700/50 backdrop-blur-sm"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <motion.div 
              className="flex items-center gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
                  <Zap className="w-7 h-7 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-900 animate-pulse"></div>
              </div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Agentic AI
                </h2>
                <p className="text-xs text-gray-400 font-medium">Advanced Admin Portal</p>
              </div>
            </motion.div>
          )}
          
          <motion.button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-xl bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 hover:text-white transition-all duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </motion.button>
        </div>
      </motion.div>
      
      {/* System Status */}
      {!isCollapsed && (
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="px-4 py-4 mx-4 mt-4 bg-gradient-to-r from-green-900/20 to-blue-900/20 rounded-2xl border border-green-500/30 backdrop-blur-sm"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="relative">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-30"></div>
            </div>
            <span className="text-sm text-green-300 font-semibold">Neural Network Online</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex flex-col">
              <span className="text-gray-400">Uptime</span>
              <span className="text-white font-bold">99.9%</span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-400">Load</span>
              <span className="text-green-300 font-bold">12%</span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-400">APIs</span>
              <span className="text-blue-300 font-bold">Active</span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-400">AI</span>
              <span className="text-purple-300 font-bold">Ready</span>
            </div>
          </div>
        </motion.div>
      )}
      
      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-3 overflow-y-auto">
        {menuItems.map((item, index) => (
          <motion.div
            key={item.to}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + index * 0.05 }}
            onMouseEnter={() => setHoveredItem(item.to)}
            onMouseLeave={() => setHoveredItem(null)}
            className="relative"
          >
            <NavLink 
              to={item.to} 
              end={item.end}
              className={({ isActive }) => `${navLinkClasses} ${isActive ? activeLinkClasses : ''}`}
            >
              {/* Hover Effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-xl"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ 
                  opacity: hoveredItem === item.to ? 1 : 0,
                  scale: hoveredItem === item.to ? 1 : 0.9
                }}
                transition={{ duration: 0.2 }}
              />
              
              <div className={`flex items-center ${isCollapsed ? 'justify-center' : ''} relative z-10`}>
                <motion.div
                  className="p-2 rounded-lg bg-gray-700/30"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <item.icon className={`w-5 h-5 ${location.pathname === item.to ? 'text-blue-400' : 'text-gray-400 group-hover:text-white'} transition-colors duration-200`} />
                </motion.div>
                
                {!isCollapsed && (
                  <>
                    <div className="flex-1 ml-4">
                      <span className="text-gray-300 group-hover:text-white transition-colors duration-200 font-medium">
                        {item.label}
                      </span>
                      <p className="text-xs text-gray-500 group-hover:text-gray-300 transition-colors duration-200">
                        {item.description}
                      </p>
                    </div>
                    {item.badge && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2 + index * 0.05 }}
                      >
                        <Badge 
                          variant={item.badge.variant} 
                          className="ml-2 text-xs bg-gradient-to-r from-blue-600 to-purple-600 text-white border-none shadow-lg"
                        >
                          {item.badge.text}
                        </Badge>
                      </motion.div>
                    )}
                  </>
                )}
              </div>
            </NavLink>
            
            {/* Tooltip for collapsed state */}
            <AnimatePresence>
              {isCollapsed && hoveredItem === item.to && (
                <motion.div
                  initial={{ opacity: 0, x: -10, scale: 0.9 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -10, scale: 0.9 }}
                  className="absolute left-full top-0 ml-4 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg shadow-xl border border-gray-700 z-50"
                >
                  <div className="font-medium">{item.label}</div>
                  <div className="text-xs text-gray-400">{item.description}</div>
                  <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-800 rotate-45 border-l border-b border-gray-700"></div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </nav>

      {/* Analytics Quick View */}
      {!isCollapsed && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="px-4 py-4 mx-4 mb-4 bg-gradient-to-br from-gray-800/50 to-gray-700/50 rounded-2xl border border-gray-600/50 backdrop-blur-sm"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-semibold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Real-Time Analytics</span>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <Heart className="w-3 h-3" />
                Active Sessions
              </span>
              <span className="text-sm font-bold text-green-400">1,247</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <Shield className="w-3 h-3" />
                Security Score
              </span>
              <span className="text-sm font-bold text-blue-400">98.7%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <Brain className="w-3 h-3" />
                AI Efficiency
              </span>
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 text-yellow-400" />
                <span className="text-sm font-bold text-yellow-400">95.2%</span>
              </div>
            </div>
            <div className="w-full h-1 bg-gray-700 rounded-full overflow-hidden mt-2">
              <motion.div 
                className="h-full bg-gradient-to-r from-green-500 to-blue-500"
                initial={{ width: 0 }}
                animate={{ width: '95%' }}
                transition={{ duration: 1.5, delay: 0.8 }}
              />
            </div>
          </div>
        </motion.div>
      )}
      
      {/* Footer */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="px-4 py-4 border-t border-gray-700/50 bg-gradient-to-r from-gray-900/50 to-gray-800/50 backdrop-blur-sm"
      >
        <motion.button
          onClick={handleLogout}
          className={`flex items-center w-full px-4 py-3 text-gray-300 hover:bg-gradient-to-r hover:from-red-900/30 hover:to-red-800/30 hover:text-white rounded-2xl transition-all duration-300 group border border-transparent hover:border-red-500/30 ${isCollapsed ? 'justify-center' : ''}`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="p-2 rounded-lg bg-red-900/20 group-hover:bg-red-800/30 transition-colors duration-200">
            <LogOut className="w-4 h-4 text-red-400 group-hover:text-red-300 transition-colors duration-200" />
          </div>
          {!isCollapsed && (
            <div className="ml-3 flex-1 text-left">
              <span className="text-gray-300 group-hover:text-white transition-colors duration-200 font-medium">Logout</span>
              <p className="text-xs text-gray-500 group-hover:text-gray-300 transition-colors duration-200">Sign out securely</p>
            </div>
          )}
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default Sidebar;