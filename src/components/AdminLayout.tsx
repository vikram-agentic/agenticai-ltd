import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import Sidebar from './ui/sidebar';
import { 
  Activity, 
  TrendingUp, 
  Users, 
  Zap,
  Bell,
  Search,
  Settings,
  BarChart3,
  Shield
} from 'lucide-react';

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [systemStats, setSystemStats] = useState({
    activeUsers: 1247,
    systemHealth: 98.7,
    apiRequests: 45632,
    contentGenerated: 892,
    uptime: '99.9%'
  });

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('admin_token');
      
      if (!token) {
        toast({
          title: "🔐 Authentication Required",
          description: "Please log in to access the advanced admin dashboard.",
          variant: "destructive",
        });
        navigate('/admin-agentic/login');
        return;
      }

      // Check if it's a valid admin token format
      if (token === 'agentic-admin-hardcoded' || 
          token.startsWith('agentic-admin-token-') || 
          token.startsWith('agentic_admin_')) {
        setIsAuthenticated(true);
      } else {
        // Token exists but invalid format, redirect to login
        localStorage.removeItem('admin_token');
        toast({
          title: "🚨 Session Expired",
          description: "Please authenticate again to continue.",
          variant: "destructive",
        });
        navigate('/admin-agentic/login');
        return;
      }
      
      setLoading(false);
    };

    checkAuth();
  }, [navigate, toast]);

  const loadingVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { 
      scale: 1, 
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    },
    exit: { 
      scale: 1.2, 
      opacity: 0,
      transition: {
        duration: 0.4,
        ease: "easeIn"
      }
    }
  };

  const containerVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const childVariants = {
    initial: { y: 20, opacity: 0 },
    animate: { 
      y: 0, 
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  if (loading) {
    return (
      <motion.div 
        className="flex h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 items-center justify-center relative overflow-hidden"
        initial="initial"
        animate="animate"
        exit="exit"
        variants={loadingVariants}
      >
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 animate-pulse" />
          <motion.div 
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
            animate={{ 
              x: [0, 100, 0],
              y: [0, -50, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div 
            className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"
            animate={{ 
              x: [0, -80, 0],
              y: [0, 60, 0],
              scale: [1, 0.8, 1]
            }}
            transition={{ 
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          />
        </div>

        {/* Loading Content */}
        <div className="relative z-10 text-center">
          <motion.div
            className="relative mb-8"
            animate={{ rotate: 360 }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <div className="w-24 h-24 border-4 border-blue-500/30 rounded-full"></div>
            <div className="absolute top-0 left-0 w-24 h-24 border-4 border-transparent border-t-blue-500 rounded-full animate-spin"></div>
            <div className="absolute top-2 left-2 w-20 h-20 border-4 border-transparent border-t-purple-500 rounded-full animate-spin" style={{animationDuration: '1.5s'}}></div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-3"
          >
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Agentic AI Dashboard
            </h2>
            <p className="text-gray-300">Initializing advanced admin systems...</p>
            
            <motion.div 
              className="flex justify-center space-x-2 mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-blue-500 rounded-full"
                  animate={{ 
                    scale: [1, 1.5, 1],
                    opacity: [0.7, 1, 0.7]
                  }}
                  transition={{ 
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.2
                  }}
                />
              ))}
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return (
    <AnimatePresence>
      <motion.div 
        className="flex h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 relative overflow-hidden"
        variants={containerVariants}
        initial="initial"
        animate="animate"
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div 
            className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-600/5 to-transparent rounded-full blur-3xl"
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ 
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div 
            className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-purple-600/5 to-transparent rounded-full blur-3xl"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{ 
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
          />
        </div>

        {/* Modern Sidebar */}
        <motion.div variants={childVariants}>
          <Sidebar />
        </motion.div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col relative z-10">
          {/* Top Navigation Bar */}
          <motion.div 
            variants={childVariants}
            className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700/50 px-6 py-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h1 className="text-xl font-semibold text-white">Admin Dashboard</h1>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-300">System Online</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-6 text-sm text-gray-300">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4" />
                    <span>{systemStats.activeUsers}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Activity className="w-4 h-4" />
                    <span>{systemStats.systemHealth}%</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4" />
                    <span>{systemStats.apiRequests}</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <Bell className="w-5 h-5" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <Settings className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Content Area */}
          <motion.main 
            className="flex-1 overflow-x-hidden overflow-y-auto"
            variants={childVariants}
          >
            <div className="min-h-full p-6">
              {children}
            </div>
          </motion.main>
        </div>

        {/* Global Toast Container */}
        <motion.div
          className="fixed bottom-4 right-4 z-50"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1 }}
        >
          {/* Toast notifications will appear here */}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AdminLayout;