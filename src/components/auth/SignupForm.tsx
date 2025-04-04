import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Phone, Shield, Eye, EyeOff, User, Binary } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import DateOfBirthInput from './DateOfBirthInput';

interface SignupFormProps {
  language: string;
}

const SignupForm = ({ language }: SignupFormProps) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupName, setSignupName] = useState('');
  const [signupGender, setSignupGender] = useState<string>('');
  const [signupDateOfBirth, setSignupDateOfBirth] = useState<string>('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  
  const validatePassword = (password: string): { valid: boolean; message: string } => {
    if (password.length < 8) {
      return { valid: false, message: 'Password must be at least 8 characters' };
    }
    if (!/[A-Z]/.test(password)) {
      return { valid: false, message: 'Password must contain at least 1 uppercase letter' };
    }
    if (!/[0-9]/.test(password)) {
      return { valid: false, message: 'Password must contain at least 1 number' };
    }
    if (!/[^A-Za-z0-9]/.test(password)) {
      return { valid: false, message: 'Password must contain at least 1 special character' };
    }
    return { valid: true, message: '' };
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!agreeToTerms) {
      toast.error(language === 'en' 
        ? 'You must agree to the terms and conditions' 
        : 'يجب أن توافق على الشروط والأحكام');
      return;
    }
    
    const passwordValidation = validatePassword(signupPassword);
    if (!passwordValidation.valid) {
      toast.error(passwordValidation.message);
      return;
    }
    
    if (signupPassword !== signupConfirmPassword) {
      toast.error(language === 'en' ? 'Passwords do not match' : 'كلمات المرور غير متطابقة');
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log("Starting signup process for:", signupEmail);
      const nameParts = signupName.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      
      const formattedPhone = signupPhone.startsWith('+') ? signupPhone : `+${signupPhone}`;
      
      const { data, error } = await supabase.auth.signUp({
        email: signupEmail,
        password: signupPassword,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            phone: formattedPhone,
            role: 'patient',
            full_name: signupName,
            gender: signupGender,
            date_of_birth: signupDateOfBirth || null
          }
        }
      });
      
      if (error) {
        console.error("Signup error:", error);
        throw error;
      }
      
      console.log("Signup successful:", data);
      
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: data.user.id,
            first_name: firstName,
            last_name: lastName,
            phone: formattedPhone,
            gender: signupGender,
            date_of_birth: signupDateOfBirth
          })
          .select();
          
        if (profileError) {
          console.error("Error updating profile:", profileError);
        }
      }
      
      toast(language === 'en' 
        ? 'Account created successfully! Please check your email to confirm your account' 
        : 'تم إنشاء الحساب بنجاح! يرجى التحقق من بريدك الإلكتروني لتأكيد حسابك');
      
      if (data.session) {
        console.log("Session available, redirecting to dashboard");
        navigate('/dashboard');
      }
    } catch (error: any) {
      console.error("Signup failed:", error);
      toast.error(error.message);
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
        <div className="relative">
          <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="signup-name"
            type="text"
            placeholder={language === 'en' ? 'John Doe' : 'محمد أحمد'}
            value={signupName}
            onChange={(e) => setSignupName(e.target.value)}
            className="pl-10"
            required
          />
        </div>
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
          {language === 'en' ? 'Phone Number (with country code)' : 'رقم الهاتف (مع رمز البلد)'}
        </Label>
        <div className="relative">
          <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="signup-phone"
            type="tel"
            placeholder={language === 'en' ? '+1 (555) 000-0000' : '+٩٥٥ ٥٥ ٠٠٠ ٠٠٠٠'}
            value={signupPhone}
            onChange={(e) => setSignupPhone(e.target.value)}
            className="pl-10"
            required
          />
        </div>
        <p className="text-xs text-muted-foreground">
          {language === 'en' 
            ? "Include country code (e.g., +1 for US, +44 for UK)"
            : "تضمين رمز البلد (مثل +٩٥٥ للسعودية، +٢٠ لمصر)"}
        </p>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <DateOfBirthInput 
            value={signupDateOfBirth} 
            onChange={setSignupDateOfBirth} 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="signup-gender">
            {language === 'en' ? 'Gender' : 'الجنس'}
          </Label>
          <Select value={signupGender} onValueChange={setSignupGender}>
            <SelectTrigger className="w-full">
              <div className="flex items-center">
                <Binary className="mr-2 h-4 w-4 text-muted-foreground" />
                <SelectValue placeholder={language === 'en' ? 'Select gender' : 'اختر الجنس'} />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">{language === 'en' ? 'Male' : 'ذكر'}</SelectItem>
              <SelectItem value="female">{language === 'en' ? 'Female' : 'أنثى'}</SelectItem>
              <SelectItem value="other">{language === 'en' ? 'Other' : 'آخر'}</SelectItem>
              <SelectItem value="prefer_not_to_say">{language === 'en' ? 'Prefer not to say' : 'أفضل عدم الإجابة'}</SelectItem>
            </SelectContent>
          </Select>
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
        <p className="text-xs text-muted-foreground">
          {language === 'en' 
            ? 'Password must be at least 8 characters and include uppercase, number, and special character'
            : 'يجب أن تتكون كلمة المرور من 8 أحرف على الأقل وتتضمن حرفًا كبيرًا ورقمًا وحرفًا خاصًا'}
        </p>
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
      
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="terms"
          checked={agreeToTerms}
          onCheckedChange={(checked) => setAgreeToTerms(!!checked)}
          required
        />
        <Label htmlFor="terms" className="text-sm">
          {language === 'en' 
            ? 'I agree to the Terms of Service and Privacy Policy'
            : 'أوافق على شروط الخدمة وسياسة الخصوصية'
          }
        </Label>
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
