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
  
  const handleCardInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCardInfo((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleBookingComplete = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    try {
      // Make sure user is authenticated
      if (!authSession.user) {
        throw new Error('You must be logged in to book an appointment');
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
        created_at: new Date().toISOString()
      };
      
      // Insert the session into Supabase
      const { data, error } = await supabase
        .from('sessions')
        .insert([newSession])
        .select('*');
      
      if (error) throw error;
      
      if (!data || data.length === 0) {
        throw new Error('Failed to create session');
      }
      
      console.log('Session saved successfully:', data[0]);
      
      setIsProcessing(false);
      setIsComplete(true);
      
      toast({
        title: language === 'en' ? "Booking Successful" : "تم الحجز بنجاح",
        description: language === 'en' 
          ? "Your appointment has been confirmed" 
          : "تم تأكيد موعدك",
      });
      
      // After a short delay to allow users to see the confirmation screen
      setTimeout(() => {
        // Navigate to profile with activeTab set to upcoming and trigger a refresh
        navigate('/profile', { 
          state: { 
            activeTab: 'upcoming',
            newBooking: true,
            sessionId: data[0].id
          }
        });
      }, 2000);
    } catch (error: any) {
      console.error('Error saving booking:', error);
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
