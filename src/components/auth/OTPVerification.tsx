
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { VerifyOtpParams } from '@supabase/supabase-js';

interface OTPVerificationProps {
  language: string;
  email: string;
  setOtpSent: (value: boolean) => void;
}

const OTPVerification = ({ language, email, setOtpSent }: OTPVerificationProps) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [otp, setOtp] = useState('');
  const isPhone = email.startsWith('+');

  const handleVerifyOTP = async () => {
    if (!otp || !email) {
      toast.error(language === 'en' ? 'Verification code required' : 'رمز التحقق مطلوب');
      return;
    }
    
    setIsLoading(true);
    
    try {
      let verifyData: VerifyOtpParams;
      
      if (isPhone) {
        verifyData = {
          phone: email,
          token: otp,
          type: 'sms'
        };
      } else {
        verifyData = {
          email: email,
          token: otp,
          type: 'email'
        };
      }
        
      const { data, error } = await supabase.auth.verifyOtp(verifyData);
      
      if (error) throw error;
      
      toast(language === 'en' ? 'Successfully verified' : 'تم التحقق بنجاح');
      
      // Create or update profile info if we have metadata from the sign-up
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: data.user.id,
            updated_at: new Date().toISOString()
          })
          .select();
          
        if (profileError) {
          console.error("Error updating profile:", profileError);
        }
      }
      
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (error: any) {
      console.error("Verification failed:", error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsLoading(true);
    
    try {
      const options = { shouldCreateUser: true };
      
      if (isPhone) {
        await supabase.auth.signInWithOtp({ phone: email, options });
        toast(language === 'en' ? 'Code resent to your phone' : 'تم إعادة إرسال الرمز إلى هاتفك');
      } else {
        await supabase.auth.signInWithOtp({ email, options });
        toast(language === 'en' ? 'Code resent to your email' : 'تم إعادة إرسال الرمز إلى بريدك الإلكتروني');
      }
    } catch (error: any) {
      console.error("Failed to resend code:", error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 mt-4">
      <div className="space-y-2">
        <Label htmlFor="otp">
          {language === 'en' ? 'Enter Verification Code' : 'أدخل رمز التحقق'}
        </Label>
        <div className="flex justify-center my-4">
          <InputOTP 
            maxLength={6} 
            value={otp} 
            onChange={(value) => setOtp(value)}
            className="gap-2"
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>
      </div>
      
      <Button className="w-full" onClick={handleVerifyOTP} disabled={isLoading}>
        {isLoading
          ? language === 'en' ? 'Verifying...' : 'جاري التحقق...'
          : language === 'en' ? 'Verify' : 'تحقق'}
      </Button>
      
      <div className="flex flex-col gap-2">
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={handleResendCode}
          disabled={isLoading}
        >
          {language === 'en' ? 'Resend Code' : 'إعادة إرسال الرمز'}
        </Button>
        
        <Button
          type="button"
          variant="ghost"
          className="w-full"
          onClick={() => setOtpSent(false)}
          disabled={isLoading}
        >
          {language === 'en' ? 'Back to Login' : 'العودة إلى تسجيل الدخول'}
        </Button>
      </div>
    </div>
  );
};

export default OTPVerification;
