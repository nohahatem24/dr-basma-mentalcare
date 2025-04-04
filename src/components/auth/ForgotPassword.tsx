
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Phone } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ForgotPasswordProps {
  language: string;
  onBack: () => void;
}

const ForgotPassword = ({ language, onBack }: ForgotPasswordProps) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [activeTab, setActiveTab] = useState<'email' | 'phone'>('email');
  const [resetSent, setResetSent] = useState(false);

  const handleSendResetLink = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (activeTab === 'email' && !email) {
      toast.error(language === 'en' ? 'Email required' : 'البريد الإلكتروني مطلوب');
      return;
    }
    
    if (activeTab === 'phone' && !phone) {
      toast.error(language === 'en' ? 'Phone number required' : 'رقم الهاتف مطلوب');
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (activeTab === 'email') {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth?reset=true`,
        });
        
        if (error) throw error;
        
        toast(language === 'en' 
          ? 'Password reset link sent to your email' 
          : 'تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني'
        );
      } else {
        // For phone, we'll send an OTP instead
        const { error } = await supabase.auth.signInWithOtp({
          phone,
        });
        
        if (error) throw error;
        
        toast(language === 'en' 
          ? 'Verification code sent to your phone' 
          : 'تم إرسال رمز التحقق إلى هاتفك'
        );
      }
      
      setResetSent(true);
    } catch (error: any) {
      console.error("Failed to send reset link:", error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (resetSent) {
    return (
      <div className="space-y-4 text-center">
        <h3 className="text-lg font-semibold">
          {language === 'en' ? 'Check Your Inbox' : 'تحقق من صندوق البريد الوارد الخاص بك'}
        </h3>
        <p className="text-muted-foreground">
          {activeTab === 'email' 
            ? (language === 'en' 
                ? 'We have sent a password reset link to your email.' 
                : 'لقد أرسلنا رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني.')
            : (language === 'en' 
                ? 'We have sent a verification code to your phone.' 
                : 'لقد أرسلنا رمز التحقق إلى هاتفك.')
          }
        </p>
        <Button className="w-full" onClick={onBack}>
          {language === 'en' ? 'Back to Login' : 'العودة إلى تسجيل الدخول'}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4 mt-4">
      <h3 className="text-lg font-semibold text-center">
        {language === 'en' ? 'Reset Your Password' : 'إعادة تعيين كلمة المرور الخاصة بك'}
      </h3>
      
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
          <form onSubmit={handleSendResetLink} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reset-email">
                {language === 'en' ? 'Email' : 'البريد الإلكتروني'}
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="reset-email"
                  type="email"
                  placeholder={language === 'en' ? 'name@example.com' : 'الاسم@مثال.com'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading
                ? language === 'en' ? 'Sending...' : 'جاري الإرسال...'
                : language === 'en' ? 'Send Reset Link' : 'إرسال رابط إعادة التعيين'}
            </Button>
          </form>
        </TabsContent>
        
        <TabsContent value="phone">
          <form onSubmit={handleSendResetLink} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reset-phone">
                {language === 'en' ? 'Phone Number' : 'رقم الهاتف'}
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="reset-phone"
                  type="tel"
                  placeholder={language === 'en' ? '+1 (555) 000-0000' : '+٩٦٦ ٥٥ ٠٠٠ ٠٠٠٠'}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading
                ? language === 'en' ? 'Sending...' : 'جاري الإرسال...'
                : language === 'en' ? 'Send Verification Code' : 'إرسال رمز التحقق'}
            </Button>
          </form>
        </TabsContent>
      </Tabs>
      
      <Button variant="ghost" className="w-full" onClick={onBack}>
        {language === 'en' ? 'Back to Login' : 'العودة إلى تسجيل الدخول'}
      </Button>
    </div>
  );
};

export default ForgotPassword;
