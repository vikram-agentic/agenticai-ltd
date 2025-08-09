import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { LogIn, Loader2 } from 'lucide-react';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });

  useEffect(() => {
    // Check if already authenticated
    const token = localStorage.getItem('admin_token');
    if (token) {
      navigate('/admin-agentic');
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Check hardcoded credentials first
      if (loginData.email === 'info@agentic-ai.ltd' && loginData.password === 'agenticailtd') {
        localStorage.setItem('admin_token', 'agentic-admin-token-' + Date.now());
        toast({
          title: "Login Successful",
          description: "Welcome to Agentic AI Admin Dashboard",
        });
        navigate('/admin-agentic');
        return;
      }

      // Fallback to API authentication
      const { data, error } = await supabase.functions.invoke('admin-auth', {
        body: {
          email: loginData.email,
          password: loginData.password
        }
      });

      if (error) throw error;

      if (data.success) {
        localStorage.setItem('admin_token', data.token);
        toast({
          title: "Login Successful",
          description: "Welcome to Agentic AI Admin Dashboard",
        });
        navigate('/admin-agentic');
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid credentials",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-slate-900/80 backdrop-blur-xl border-purple-500/30 shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Agentic AI
          </CardTitle>
          <CardDescription className="text-slate-300">
            Admin Dashboard Login
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-200">Email</Label>
              <Input
                id="email"
                type="email"
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                className="bg-slate-800/50 border-slate-600 text-white"
                placeholder="admin@agentic-ai.ltd"
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-200">Password</Label>
              <Input
                id="password"
                type="password"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                className="bg-slate-800/50 border-slate-600 text-white"
                placeholder="Enter password"
                required
                disabled={loading}
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </>
              )}
            </Button>
          </form>
          
          <div className="mt-6 pt-4 border-t border-slate-700">
            <p className="text-xs text-slate-400 text-center">
              Secure admin access for Agentic AI AMRO Ltd
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;