
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Phone, Shield, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface SignupFormProps {
  language: string;
}

const SignupForm = ({ language }: SignupFormProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Signup form state
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupName, setSignupName] = useState('');

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Validate passwords match
    if (signupPassword !== signupConfirmPassword) {
      setIsLoading(false);
      toast({
        title: language === 'en' ? 'Passwords do not match' : 'كلمات المرور غير متطابقة',
        description: language === 'en' ? 'Please ensure both passwords are the same.' : 'يرجى التأكد من تطابق كلمتي المرور.',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      console.log("Starting signup process for:", signupEmail);
      // Split the name into first and last name
      const nameParts = signupName.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      
      const { data, error } = await supabase.auth.signUp({
        email: signupEmail,
        password: signupPassword,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            phone: signupPhone,
            role: 'patient', // Default role for new users
            full_name: signupName,
          }
        }
      });
      
      if (error) {
        console.error("Signup error:", error);
        throw error;
      }
      
      console.log("Signup successful:", data);
      
      toast({
        title: language === 'en' ? 'Account created successfully' : 'تم إنشاء الحساب بنجاح',
        description: language === 'en' 
          ? 'Please check your email to confirm your account' 
          : 'يرجى التحقق من بريدك الإلكتروني لتأكيد حسابك',
      });
      
      // If email confirmation is disabled in Supabase, redirect to dashboard
      if (data.session) {
        console.log("Session available, redirecting to dashboard");
        navigate('/dashboard');
      }
    } catch (error: any) {
      console.error("Signup failed:", error);
      toast({
        title: language === 'en' ? 'Signup failed' : 'فشل إنشاء الحساب',
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
    <form onSubmit={handleSignup} className="space-y-4 mt-4">
      <div className="space-y-2">
        <Label htmlFor="signup-name">
          {language === 'en' ? 'Full Name' : 'الاسم الكامل'}
        </Label>
        <Input
          id="signup-name"
          type="text"
          placeholder={language === 'en' ? 'John Doe' : 'محمد أحمد'}
          value={signupName}
          onChange={(e) => setSignupName(e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="signup-email">
          {language === 'en' ? 'Email' : 'البريد الإلكتروني'}
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="signup-email"
            type="email"
            placeholder={language === 'en' ? 'name@example.com' : 'الاسم@مثال.com'}
            value={signupEmail}
            onChange={(e) => setSignupEmail(e.target.value)}
            className="pl-10"
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="signup-phone">
          {language === 'en' ? 'Phone Number' : 'رقم الهاتف'}
        </Label>
        <div className="relative">
          <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="signup-phone"
            type="tel"
            placeholder={language === 'en' ? '+1 (555) 000-0000' : '+٩٦٦ ٥٥ ٠٠٠ ٠٠٠٠'}
            value={signupPhone}
            onChange={(e) => setSignupPhone(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="signup-password">
          {language === 'en' ? 'Password' : 'كلمة المرور'}
        </Label>
        <div className="relative">
          <Shield className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="signup-password"
            type={showPassword ? "text" : "password"}
            value={signupPassword}
            onChange={(e) => setSignupPassword(e.target.value)}
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
      
      <div className="space-y-2">
        <Label htmlFor="signup-confirm-password">
          {language === 'en' ? 'Confirm Password' : 'تأكيد كلمة المرور'}
        </Label>
        <div className="relative">
          <Shield className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="signup-confirm-password"
            type={showPassword ? "text" : "password"}
            value={signupConfirmPassword}
            onChange={(e) => setSignupConfirmPassword(e.target.value)}
            className="pl-10 pr-10"
            required
          />
        </div>
      </div>
      
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading
          ? language === 'en' ? 'Signing up...' : 'جاري إنشاء الحساب...'
          : language === 'en' ? 'Sign Up' : 'إنشاء حساب'}
      </Button>
    </form>
  );
};

export default SignupForm;
