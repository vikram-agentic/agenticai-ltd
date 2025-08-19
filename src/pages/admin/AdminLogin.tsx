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
  const [showOTPStep, setShowOTPStep] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [generatedOTP, setGeneratedOTP] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);

  useEffect(() => {
    // Check if already authenticated
    const token = localStorage.getItem('admin_token');
    if (token) {
      navigate('/admin-agentic');
    }
  }, [navigate]);

  // Generate 6-digit OTP
  const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  // Send OTP to admin email
  const sendOTPToAdmin = async (adminEmail: string) => {
    const otp = generateOTP();
    setGeneratedOTP(otp);
    
    try {
      const { data, error } = await supabase.functions.invoke('contact-handler', {
        body: {
          action: 'admin_otp',
          to: adminEmail,
          subject: '🔐 Your Admin Login OTP - Agentic AI',
          message: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
                <h1 style="margin: 0; font-size: 28px;">🔐 Admin Login OTP</h1>
                <p style="margin: 10px 0 0 0; font-size: 16px;">Secure access to Agentic AI Admin Dashboard</p>
              </div>
              
              <div style="background: white; padding: 30px; border-radius: 0 0 8px 8px; border: 1px solid #e2e8f0;">
                <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #ffc107;">
                  <h3 style="color: #856404; margin: 0 0 10px 0;">🚨 Security Alert</h3>
                  <p style="color: #856404; margin: 0;">Someone is trying to access the Agentic AI Admin Dashboard. If this was you, use the OTP below. If not, please ignore this email.</p>
                </div>
                
                <div style="text-align: center; margin: 30px 0;">
                  <div style="background: #f8f9fa; border: 2px solid #667eea; padding: 20px; border-radius: 8px; display: inline-block;">
                    <h2 style="color: #333; margin: 0 0 10px 0;">Your OTP Code:</h2>
                    <div style="background: #667eea; color: white; padding: 15px 30px; border-radius: 5px; font-size: 32px; font-weight: bold; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                      ${otp}
                    </div>
                  </div>
                </div>
                
                <div style="background: #d4edda; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745;">
                  <h4 style="color: #155724; margin: 0 0 10px 0;">🔒 Security Information:</h4>
                  <ul style="color: #155724; margin: 0; padding-left: 20px;">
                    <li>This OTP is valid for 5 minutes only</li>
                    <li>Do not share this code with anyone</li>
                    <li>Enter this code in the admin login page</li>
                    <li>The code will expire after one use</li>
                  </ul>
                </div>
                
                <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
                  <p style="margin: 0; color: #666;">
                    <strong>Request Details:</strong><br>
                    Time: ${new Date().toLocaleString()}<br>
                    Email: ${adminEmail}
                  </p>
                </div>
                
                <p style="color: #666; font-size: 12px; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">
                  This is an automated security email from Agentic AI Admin System. Do not reply to this email.
                </p>
              </div>
            </div>
          `,
          admin_name: 'Agentic AI Security System'
        }
      });

      if (error) {
        throw new Error('Failed to send OTP email');
      }

      console.log(`🔐 OTP sent to ${adminEmail}: ${otp}`);
    } catch (error) {
      console.error('Error sending OTP:', error);
      throw error;
    }
  };

  // Verify OTP and login
  const handleOTPVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setOtpLoading(true);

    try {
      if (otpCode.trim() === generatedOTP) {
        localStorage.setItem('admin_token', 'agentic_admin_' + Date.now());
        localStorage.setItem('admin_email', loginData.email);
        
        toast({
          title: "🎉 Login Successful!",
          description: `Welcome to Agentic AI Admin Dashboard, ${loginData.email}`,
        });
        
        navigate('/admin-agentic');
      } else {
        throw new Error('Invalid OTP code');
      }
    } catch (error: any) {
      toast({
        title: "❌ OTP Verification Failed",
        description: error.message || "Invalid OTP code",
        variant: "destructive",
      });
    } finally {
      setOtpLoading(false);
    }
  };

  // Resend OTP
  const handleResendOTP = async () => {
    try {
      await sendOTPToAdmin(loginData.email);
      toast({
        title: "🔄 OTP Resent!",
        description: `New verification code sent to ${loginData.email}`,
      });
    } catch (error: any) {
      toast({
        title: "❌ Resend Failed",
        description: error.message || "Failed to resend OTP",
        variant: "destructive",
      });
    }
  };

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

      // Admin authentication with OTP
      const validAdmins = [
        'info@agentic-ai.ltd',
        'vikram@agentic-ai.ltd'
      ];
      
      if (validAdmins.includes(loginData.email) && loginData.password === 'agenticailtd') {
        // Generate and send OTP
        await sendOTPToAdmin(loginData.email);
        setShowOTPStep(true);
        toast({
          title: "OTP Sent!",
          description: `Verification code sent to ${loginData.email}`,
        });
      } else {
        throw new Error('Invalid credentials');
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
          {!showOTPStep ? (
            // Step 1: Email & Password Login
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-200">Admin Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  className="bg-slate-800/50 border-slate-600 text-white"
                  placeholder="Enter admin email"
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
                  Sending OTP...
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4 mr-2" />
                  Send OTP
                </>
              )}
            </Button>
            </form>
          ) : (
            // Step 2: OTP Verification
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-slate-200 mb-2">🔐 Enter Verification Code</h3>
                <p className="text-sm text-slate-400">
                  We've sent a 6-digit code to <span className="text-purple-400">{loginData.email}</span>
                </p>
              </div>
              
              <form onSubmit={handleOTPVerification} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="otp" className="text-slate-200">Verification Code</Label>
                  <Input
                    id="otp"
                    type="text"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    className="bg-slate-800/50 border-slate-600 text-white text-center text-2xl font-mono tracking-widest"
                    placeholder="000000"
                    maxLength={6}
                    required
                    disabled={otpLoading}
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                  disabled={otpLoading || otpCode.length !== 6}
                >
                  {otpLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4 mr-2" />
                      Verify & Login
                    </>
                  )}
                </Button>
              </form>
              
              <div className="text-center space-y-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleResendOTP}
                  className="text-purple-400 hover:text-purple-300"
                >
                  🔄 Resend OTP
                </Button>
                <br />
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => {
                    setShowOTPStep(false);
                    setOtpCode('');
                    setGeneratedOTP('');
                  }}
                  className="text-slate-400 hover:text-slate-300"
                >
                  ← Back to Login
                </Button>
              </div>
            </div>
          )}
          
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