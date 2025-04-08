
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface OTPVerificationProps {
  language: string;
  email: string;
  setOtpSent: (value: boolean) => void;
}

const OTPVerification = ({ language, email, setOtpSent }: OTPVerificationProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [otp, setOtp] = useState('');

  const handleVerifyOTP = async () => {
    if (!otp || !email) {
      toast({
        title: language === 'en' ? 'Verification code required' : 'رمز التحقق مطلوب',
        description: language === 'en' ? 'Please enter the verification code.' : 'يرجى إدخال رمز التحقق.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email: email,
        token: otp,
        type: 'email',
      });
      
      if (error) throw error;
      
      toast({
        title: language === 'en' ? 'Successfully verified' : 'تم التحقق بنجاح',
        description: language === 'en' ? 'Welcome to Dr. Basma Mental Hub!' : 'مرحبًا بك في مركز د. بسمة للصحة النفسية!',
      });
      
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (error: any) {
      toast({
        title: language === 'en' ? 'Verification failed' : 'فشل التحقق',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
  );
};

export default OTPVerification;
