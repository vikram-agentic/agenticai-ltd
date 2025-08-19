import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './ui/sidebar';
import { useToast } from '@/hooks/use-toast';

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('admin_token');
      
      if (!token) {
        toast({
          title: "Authentication Required",
          description: "Please log in to access the admin dashboard.",
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
          title: "Session Expired",
          description: "Please log in again.",
          variant: "destructive",
        });
        navigate('/admin-agentic/login');
        return;
      }
      
      setLoading(false);
    };

    checkAuth();
  }, [navigate, toast]);

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-900 items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="flex h-screen bg-gray-900">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden bg-gray-900">
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-900">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;