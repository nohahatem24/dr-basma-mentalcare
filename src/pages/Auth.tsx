
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/components/Header';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import LoginForm from '@/components/auth/LoginForm';
import OTPVerification from '@/components/auth/OTPVerification';
import SignupForm from '@/components/auth/SignupForm';
import ForgotPassword from '@/components/auth/ForgotPassword';

const Auth = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const reset = searchParams.get('reset');
  
  const [otpSent, setOtpSent] = useState(false);
  const [email, setEmail] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        // User is already logged in, redirect to dashboard
        const from = (location.state as any)?.from?.pathname || '/dashboard';
        navigate(from, { replace: true });
      }
    };
    
    checkSession();
  }, [navigate, location]);

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
          {showForgotPassword ? (
            <ForgotPassword 
              language={language} 
              onBack={() => setShowForgotPassword(false)} 
            />
          ) : (
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
                  <LoginForm 
                    language={language} 
                    setOtpSent={setOtpSent}
                    setEmail={setEmail}
                  />
                ) : (
                  <OTPVerification 
                    language={language} 
                    email={email} 
                    setOtpSent={setOtpSent} 
                  />
                )}
              </TabsContent>
              
              {/* Sign Up Tab */}
              <TabsContent value="signup">
                <SignupForm language={language} />
              </TabsContent>
            </Tabs>
          )}
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
