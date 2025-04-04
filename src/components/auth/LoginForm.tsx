
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Shield, Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface LoginFormProps {
  language: string;
  setOtpSent: (value: boolean) => void;
  setEmail?: (email: string) => void;
}

const LoginForm = ({ language, setOtpSent, setEmail }: LoginFormProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      console.log("Attempting to login with:", loginEmail);
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      });
      
      if (error) {
        console.error("Login error:", error);
        throw error;
      }
      
      console.log("Login successful, session:", data.session);
      
      toast({
        title: language === 'en' ? 'Successfully logged in' : 'تم تسجيل الدخول بنجاح',
        description: language === 'en' ? 'Welcome back!' : 'مرحبًا بعودتك!',
      });
      
      // Redirect to the original destination or dashboard
      const from = (location.state as any)?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    } catch (error: any) {
      console.error("Login failed:", error);
      toast({
        title: language === 'en' ? 'Login failed' : 'فشل تسجيل الدخول',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendOTP = async () => {
    if (!loginEmail) {
      toast({
        title: language === 'en' ? 'Email required' : 'البريد الإلكتروني مطلوب',
        description: language === 'en' ? 'Please enter your email.' : 'يرجى إدخال بريدك الإلكتروني.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log("Sending OTP to:", loginEmail);
      // Send OTP via email
      const { data, error } = await supabase.auth.signInWithOtp({
        email: loginEmail,
        options: {
          shouldCreateUser: true, // Create the user if they don't exist
        }
      });
      
      if (error) {
        console.error("OTP error:", error);
        throw error;
      }
      
      console.log("OTP sent successfully:", data);
      
      if (setEmail) {
        setEmail(loginEmail);
      }
      setOtpSent(true);
      
      toast({
        title: language === 'en' ? 'OTP sent' : 'تم إرسال رمز التحقق',
        description: language === 'en' ? 'Please check your email for the verification code.' : 'يرجى التحقق من بريدك الإلكتروني للحصول على رمز التحقق.',
      });
    } catch (error: any) {
      console.error("Failed to send OTP:", error);
      toast({
        title: language === 'en' ? 'Failed to send OTP' : 'فشل إرسال رمز التحقق',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4 mt-4">
      <div className="space-y-2">
        <Label htmlFor="login-email">
          {language === 'en' ? 'Email' : 'البريد الإلكتروني'}
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="login-email"
            type="email"
            placeholder={language === 'en' ? 'name@example.com' : 'الاسم@مثال.com'}
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
            className="pl-10"
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="login-password">
            {language === 'en' ? 'Password' : 'كلمة المرور'}
          </Label>
          <Link to="/forgot-password" className="text-xs text-primary hover:underline">
            {language === 'en' ? 'Forgot password?' : 'نسيت كلمة المرور؟'}
          </Link>
        </div>
        <div className="relative">
          <Shield className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="login-password"
            type={showPassword ? "text" : "password"}
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            className="pl-10 pr-10"
            required
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1 h-8 w-8"
            onClick={toggleShowPassword}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
      
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading
          ? language === 'en' ? 'Logging in...' : 'جاري تسجيل الدخول...'
          : language === 'en' ? 'Login' : 'تسجيل الدخول'}
      </Button>
      
      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">
            {language === 'en' ? 'Or continue with' : 'أو تابع باستخدام'}
          </span>
        </div>
      </div>
      
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={handleSendOTP}
        disabled={isLoading}
      >
        <Mail className="mr-2 h-4 w-4" />
        {language === 'en' ? 'Login with One-Time Code' : 'الدخول برمز لمرة واحدة'}
      </Button>
    </form>
  );
};

export default LoginForm;
