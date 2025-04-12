
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from '@/components/Header';
import { useAuth } from '@/components/auth/AuthProvider';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ChevronLeft, Check } from 'lucide-react';
import PaymentForm from '@/components/booking/PaymentForm';
import { format, addMinutes, parse } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';

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

const PaymentPage = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const { session: authSession } = useAuth();
  
  // Get appointment details from location state
  const appointmentDetails = location.state as AppointmentDetails;
  
  // If no appointment details, redirect back to doctor profile
  if (!appointmentDetails) {
    navigate('/doctor');
    return null;
  }
  
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
        notes: appointmentDetails.notes || null
      };
      
      // Insert the session into Supabase
      const { data, error } = await supabase
        .from('sessions')
        .insert([newSession])
        .select();
      
      if (error) throw error;
      
      console.log('Session saved successfully:', data);
      
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
        // Navigate to profile with activeTab set to upcoming
        navigate('/profile', { 
          state: { 
            activeTab: 'upcoming'
          }
        });
      }, 3000);
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
  
  const getAppointmentTypeDisplay = () => {
    switch (appointmentDetails.appointmentType) {
      case 'immediate':
        return language === 'en' ? "Immediate Session" : "جلسة فورية";
      case 'custom':
        return language === 'en' ? "Custom Appointment" : "موعد مخصص";
      default:
        return language === 'en' ? "Standard Appointment" : "موعد قياسي";
    }
  };
  
  const formatDate = (date?: Date) => {
    if (!date) return "";
    return format(date, language === 'en' ? 'MMMM d, yyyy' : 'yyyy/MM/dd');
  };
  
  const goBack = () => {
    navigate('/book-appointment');
  };
  
  return (
    <div className="container py-8 max-w-2xl">
      <Button variant="ghost" className="mb-6" onClick={goBack}>
        <ChevronLeft className="h-4 w-4 mr-2" />
        {language === 'en' ? "Back to Doctor Profile" : "العودة إلى ملف الطبيب"}
      </Button>
      
      <h1 className="text-3xl font-bold mb-6">
        {language === 'en' ? "Complete Your Booking" : "إكمال الحجز"}
      </h1>
      
      {isComplete ? (
        <Card className="border-green-500">
          <CardContent className="pt-6 pb-6 text-center">
            <div className="mx-auto mb-4 bg-green-100 h-16 w-16 rounded-full flex items-center justify-center">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">
              {language === 'en' ? "Booking Confirmed!" : "تم تأكيد الحجز!"}
            </h2>
            <p className="text-muted-foreground mb-6">
              {language === 'en' 
                ? `Your appointment with ${appointmentDetails.doctorName} has been scheduled.` 
                : `تم جدولة موعدك مع ${appointmentDetails.doctorName}.`}
            </p>
            <Button onClick={() => navigate('/dashboard')}>
              {language === 'en' ? "Go to Dashboard" : "الذهاب إلى لوحة التحكم"}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Appointment Summary */}
          <Card>
            <CardHeader>
              <CardTitle>
                {language === 'en' ? "Booking Summary" : "ملخص الحجز"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  {language === 'en' ? "Doctor" : "الطبيب"}
                </p>
                <p className="font-medium">{appointmentDetails.doctorName}</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  {language === 'en' ? "Appointment Type" : "نوع الموعد"}
                </p>
                <p className="font-medium">{getAppointmentTypeDisplay()}</p>
              </div>
              
              {appointmentDetails.date && appointmentDetails.startTime && appointmentDetails.endTime && (
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    {language === 'en' ? "Date & Time" : "التاريخ والوقت"}
                  </p>
                  <p className="font-medium">
                    {formatDate(appointmentDetails.date)} - {appointmentDetails.startTime} to {appointmentDetails.endTime}
                  </p>
                </div>
              )}
              
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  {language === 'en' ? "Duration" : "المدة"}
                </p>
                <p className="font-medium">
                  {appointmentDetails.duration} {language === 'en' ? "Minutes" : "دقيقة"}
                </p>
              </div>
              
              {appointmentDetails.notes && (
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    {language === 'en' ? "Notes" : "ملاحظات"}
                  </p>
                  <p className="font-medium">{appointmentDetails.notes}</p>
                </div>
              )}
              
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  {language === 'en' ? "Fee" : "الرسوم"}
                </p>
                <p className="font-medium">
                  {appointmentDetails.fee} {language === 'en' ? "EGP" : "جنيه مصري"}
                </p>
              </div>
            </CardContent>
          </Card>
          
          {/* Payment Form */}
          <PaymentForm 
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
            cardInfo={cardInfo}
            handleCardInfoChange={handleCardInfoChange}
            isProcessing={isProcessing}
            handleBookingComplete={handleBookingComplete}
            fee={appointmentDetails.fee}
            currency={appointmentDetails.currency || 'EGP'}
          />
        </div>
      )}
    </div>
  );
};

export default PaymentPage;
