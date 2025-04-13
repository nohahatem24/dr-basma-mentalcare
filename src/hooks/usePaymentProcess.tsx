import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from '@/components/Header';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

interface AppointmentDetails {
  date?: Date;
  doctorName: string;
  fee: number;
  duration: string;
  appointmentType: 'standard' | 'custom' | 'immediate';
  startTime?: string;
  endTime?: string;
  notes?: string;
  currency: string;
}

interface CardValidation {
  isValid: boolean;
  error?: string;
}

export const usePaymentProcess = (appointmentDetails: AppointmentDetails) => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { session: authSession } = useAuth();
  
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [cardInfo, setCardInfo] = useState({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  
  const validateCardInfo = (): CardValidation => {
    // Validate card number (simple Luhn algorithm check)
    const cardNumber = cardInfo.cardNumber.replace(/\s/g, '');
    if (!/^\d{16}$/.test(cardNumber)) {
      return {
        isValid: false,
        error: language === 'en' 
          ? 'Invalid card number' 
          : 'رقم البطاقة غير صحيح'
      };
    }

    // Validate card name
    if (!cardInfo.cardName.trim()) {
      return {
        isValid: false,
        error: language === 'en' 
          ? 'Cardholder name is required' 
          : 'اسم حامل البطاقة مطلوب'
      };
    }

    // Validate expiry date
    const [month, year] = cardInfo.expiry.split('/');
    const now = new Date();
    const expiry = new Date(2000 + parseInt(year), parseInt(month) - 1);
    if (!month || !year || expiry <= now) {
      return {
        isValid: false,
        error: language === 'en' 
          ? 'Invalid expiry date' 
          : 'تاريخ انتهاء الصلاحية غير صحيح'
      };
    }

    // Validate CVV
    if (!/^\d{3,4}$/.test(cardInfo.cvv)) {
      return {
        isValid: false,
        error: language === 'en' 
          ? 'Invalid CVV' 
          : 'رمز التحقق غير صحيح'
      };
    }

    return { isValid: true };
  };

  const processPayment = async () => {
    // Simulate payment processing
    return new Promise<boolean>((resolve) => {
      setTimeout(() => {
        // For testing, approve payments for cards ending in even numbers
        const lastDigit = parseInt(cardInfo.cardNumber.slice(-1));
        resolve(lastDigit % 2 === 0);
      }, 2000);
    });
  };
  
  const handleCardInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;
    
    // Format card number with spaces
    if (name === 'cardNumber') {
      formattedValue = value
        .replace(/\s/g, '')
        .replace(/(\d{4})/g, '$1 ')
        .trim();
    }
    
    setCardInfo((prev) => ({ ...prev, [name]: formattedValue }));
  };
  
  const handleBookingComplete = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    try {
      // Make sure user is authenticated
      if (!authSession.user) {
        throw new Error(language === 'en' 
          ? 'You must be logged in to book an appointment'
          : 'يجب تسجيل الدخول لحجز موعد'
        );
      }

      // Validate card information
      if (paymentMethod === 'credit_card') {
        const validation = validateCardInfo();
        if (!validation.isValid) {
          throw new Error(validation.error);
        }

        // Process payment
        const paymentSuccessful = await processPayment();
        if (!paymentSuccessful) {
          throw new Error(language === 'en'
            ? 'Payment was declined. Please try a different card.'
            : 'تم رفض الدفع. يرجى استخدام بطاقة أخرى.'
          );
        }
      }
      
      // Calculate session end time (assuming duration in minutes)
      const durationMinutes = parseInt(appointmentDetails.duration) || 60;
      const formattedDate = appointmentDetails.date 
        ? format(appointmentDetails.date, 'yyyy-MM-dd')
        : format(new Date(), 'yyyy-MM-dd');
      
      // Create new booking session in database
      const newSession = {
        user_id: authSession.user.id,
        doctor_id: "basma_adel_123", // Using fixed doctor ID for Dr. Basma
        date: formattedDate,
        start_time: appointmentDetails.startTime,
        end_time: appointmentDetails.endTime,
        duration: durationMinutes,
        type: appointmentDetails.appointmentType === 'standard' ? 'video' : 'in-person',
        status: 'upcoming',
        fee: appointmentDetails.fee,
        payment_status: 'completed',
        created_at: new Date().toISOString()
      };
      
      // Insert the session into Supabase
      const { data, error } = await supabase
        .from('sessions')
        .insert([newSession])
        .select('*');
      
      if (error) throw error;
      
      if (!data || data.length === 0) {
        throw new Error(language === 'en'
          ? 'Failed to create session'
          : 'فشل في إنشاء الجلسة'
        );
      }
      
      console.log('Session saved successfully:', data[0]);
      
      // Verify that the session was saved by fetching it again
      const { data: verifyData, error: verifyError } = await supabase
        .from('sessions')
        .select('*')
        .eq('id', data[0].id)
        .single();
        
      if (verifyError || !verifyData) {
        throw new Error(language === 'en'
          ? 'Failed to verify session creation'
          : 'فشل في التحقق من إنشاء الجلسة'
        );
      }
      
      setIsProcessing(false);
      setIsComplete(true);
      
      toast({
        title: language === 'en' ? "Booking Successful" : "تم الحجز بنجاح",
        description: language === 'en' 
          ? "Your appointment has been confirmed" 
          : "تم تأكيد موعدك",
      });
      
      // Navigate immediately to profile with upcoming sessions
      navigate('/profile', { 
        state: { 
          activeTab: 'upcoming',
          newBooking: true,
          sessionId: data[0].id,
          shouldRefresh: true
        },
        replace: true
      });
    } catch (error: any) {
      console.error('Error processing payment/booking:', error);
      setIsProcessing(false);
      
      toast({
        title: language === 'en' ? "Booking Failed" : "فشل الحجز",
        description: error.message || (language === 'en' 
          ? "There was an error processing your booking" 
          : "حدث خطأ أثناء معالجة حجزك"),
        variant: "destructive",
      });
    }
  };
  
  const goBack = () => {
    navigate('/book-appointment');
  };

  return {
    paymentMethod,
    setPaymentMethod,
    cardInfo,
    handleCardInfoChange,
    isProcessing,
    isComplete,
    handleBookingComplete,
    goBack
  };
};
