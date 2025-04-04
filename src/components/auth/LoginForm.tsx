
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Mail, Shield, Eye, EyeOff, Smartphone } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface LoginFormProps {
  language: string;
  setOtpSent: (value: boolean) => void;
  setEmail: (email: string) => void;
}

const LoginForm = ({ language, setOtpSent, setEmail }: LoginFormProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [activeTab, setActiveTab] = useState<'email' | 'phone'>('email');

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
      
      toast(language === 'en' ? 'Successfully logged in' : 'تم تسجيل الدخول بنجاح');
      
      // Redirect to the original destination or dashboard
      const from = (location.state as any)?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    } catch (error: any) {
      console.error("Login failed:", error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendOTP = async () => {
    if (activeTab === 'email' && !loginEmail) {
      toast.error(language === 'en' ? 'Email required' : 'البريد الإلكتروني مطلوب');
      return;
    }
    
    if (activeTab === 'phone' && !phoneNumber) {
      toast.error(language === 'en' ? 'Phone number required' : 'رقم الهاتف مطلوب');
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (activeTab === 'email') {
        console.log("Sending OTP to email:", loginEmail);
        
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
        setEmail(loginEmail);
        
        toast(language === 'en' 
          ? 'Verification code sent to your email' 
          : 'تم إرسال رمز التحقق إلى بريدك الإلكتروني'
        );
      } else {
        console.log("Sending OTP to phone:", phoneNumber);
        
        // Send OTP via phone
        const { data, error } = await supabase.auth.signInWithOtp({
          phone: phoneNumber,
          options: {
            shouldCreateUser: true, // Create the user if they don't exist
          }
        });
        
        if (error) {
          console.error("OTP error:", error);
          throw error;
        }
        
        console.log("OTP sent successfully:", data);
        setEmail(phoneNumber); // We're using the same state for phone/email
        
        toast(language === 'en' 
          ? 'Verification code sent to your phone' 
          : 'تم إرسال رمز التحقق إلى هاتفك'
        );
      }
      
      setOtpSent(true);
    } catch (error: any) {
      console.error("Failed to send OTP:", error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="space-y-4 mt-4">
      <Tabs
        defaultValue="email"
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as 'email' | 'phone')}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="email">
            {language === 'en' ? 'Email' : 'البريد الإلكتروني'}
          </TabsTrigger>
          <TabsTrigger value="phone">
            {language === 'en' ? 'Phone' : 'الهاتف'}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="email">
          <form onSubmit={handleLogin} className="space-y-4">
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
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="remember-me" 
                checked={rememberMe} 
                onCheckedChange={(checked) => setRememberMe(!!checked)} 
              />
              <Label htmlFor="remember-me">
                {language === 'en' ? 'Remember me' : 'تذكرني'}
              </Label>
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
        </TabsContent>
        
        <TabsContent value="phone">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="login-phone">
                {language === 'en' ? 'Phone Number' : 'رقم الهاتف'}
              </Label>
              <div className="relative">
                <Smartphone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="login-phone"
                  type="tel"
                  placeholder={language === 'en' ? '+1 (555) 000-0000' : '+٩٦٦ ٥٥ ٠٠٠ ٠٠٠٠'}
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            
            <Button
              type="button"
              className="w-full"
              onClick={handleSendOTP}
              disabled={isLoading}
            >
              {isLoading
                ? language === 'en' ? 'Sending code...' : 'جاري إرسال الرمز...'
                : language === 'en' ? 'Send verification code' : 'إرسال رمز التحقق'}
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LoginForm;
