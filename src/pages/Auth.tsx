
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/components/Header';
import { useToast } from '@/hooks/use-toast';
import { Mail, Phone, Shield, Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Auth = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Signup form state
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupName, setSignupName] = useState('');
  
  // OTP state
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate login process
    setTimeout(() => {
      setIsLoading(false);
      
      // Simulate successful login
      toast({
        title: language === 'en' ? 'Successfully logged in' : 'تم تسجيل الدخول بنجاح',
        description: language === 'en' ? 'Welcome back!' : 'مرحبًا بعودتك!',
      });
      
      // Redirect to dashboard after successful login
      navigate('/dashboard');
    }, 1500);
  };
  
  const handleSignup = (e: React.FormEvent) => {
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
    
    // Simulate signup process
    setTimeout(() => {
      setIsLoading(false);
      
      // Simulate successful signup
      toast({
        title: language === 'en' ? 'Account created successfully' : 'تم إنشاء الحساب بنجاح',
        description: language === 'en' ? 'Welcome to Dr. Besma Mental Hub!' : 'مرحبًا بك في مركز د. بسمة للصحة النفسية!',
      });
      
      // Redirect to dashboard after successful signup
      navigate('/dashboard');
    }, 1500);
  };
  
  const handleSendOTP = () => {
    if (!loginEmail && !signupPhone) {
      toast({
        title: language === 'en' ? 'Email or phone required' : 'البريد الإلكتروني أو الهاتف مطلوب',
        description: language === 'en' ? 'Please enter your email or phone number.' : 'يرجى إدخال بريدك الإلكتروني أو رقم هاتفك.',
        variant: 'destructive',
      });
      return;
    }
    
    setOtpSent(true);
    toast({
      title: language === 'en' ? 'OTP sent' : 'تم إرسال رمز التحقق',
      description: language === 'en' ? 'Please check your email or phone for the verification code.' : 'يرجى التحقق من بريدك الإلكتروني أو هاتفك للحصول على رمز التحقق.',
    });
  };
  
  const handleVerifyOTP = () => {
    setIsLoading(true);
    
    // Simulate OTP verification
    setTimeout(() => {
      setIsLoading(false);
      
      // Simulate successful verification
      toast({
        title: language === 'en' ? 'Successfully verified' : 'تم التحقق بنجاح',
        description: language === 'en' ? 'Welcome to Dr. Besma Mental Hub!' : 'مرحبًا بك في مركز د. بسمة للصحة النفسية!',
      });
      
      // Redirect to dashboard after successful verification
      navigate('/dashboard');
    }, 1500);
  };
  
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="container flex items-center justify-center py-10 md:py-16">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            {language === 'en' ? 'Welcome to Dr. Besma Mental Hub' : 'مرحبًا بك في مركز د. بسمة للصحة النفسية'}
          </CardTitle>
          <CardDescription className="text-center">
            {language === 'en'
              ? 'Sign in to your account or create a new one'
              : 'قم بتسجيل الدخول إلى حسابك أو إنشاء حساب جديد'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">
                {language === 'en' ? 'Login' : 'تسجيل الدخول'}
              </TabsTrigger>
              <TabsTrigger value="signup">
                {language === 'en' ? 'Sign Up' : 'إنشاء حساب'}
              </TabsTrigger>
            </TabsList>
            
            {/* Login Tab */}
            <TabsContent value="login">
              {!otpSent ? (
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
                  >
                    <Phone className="mr-2 h-4 w-4" />
                    {language === 'en' ? 'Login with Phone Number' : 'الدخول برقم الهاتف'}
                  </Button>
                </form>
              ) : (
                <div className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="otp">
                      {language === 'en' ? 'Enter Verification Code' : 'أدخل رمز التحقق'}
                    </Label>
                    <Input
                      id="otp"
                      type="text"
                      placeholder={language === 'en' ? '123456' : '١٢٣٤٥٦'}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      maxLength={6}
                      className="text-center text-lg tracking-widest"
                      required
                    />
                  </div>
                  
                  <Button className="w-full" onClick={handleVerifyOTP} disabled={isLoading}>
                    {isLoading
                      ? language === 'en' ? 'Verifying...' : 'جاري التحقق...'
                      : language === 'en' ? 'Verify' : 'تحقق'}
                  </Button>
                  
                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full"
                    onClick={() => setOtpSent(false)}
                  >
                    {language === 'en' ? 'Back to Login' : 'العودة إلى تسجيل الدخول'}
                  </Button>
                </div>
              )}
            </TabsContent>
            
            {/* Sign Up Tab */}
            <TabsContent value="signup">
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
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex flex-col">
          <p className="text-center text-sm text-muted-foreground">
            {language === 'en'
              ? 'By continuing, you agree to our Terms of Service and Privacy Policy.'
              : 'بالمتابعة، فإنك توافق على شروط الخدمة وسياسة الخصوصية الخاصة بنا.'}
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Auth;
