import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from '@/components/Header';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AppointmentDetails } from '@/types/booking';
import { BookingSummary } from '@/components/booking/BookingSummary';
import { PaymentForm } from '@/components/booking/PaymentForm';
import { BookingConfirmation } from '@/components/booking/BookingConfirmation';

const PaymentPage = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  
  const appointmentDetails = location.state as AppointmentDetails;
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  
  if (!appointmentDetails) {
    navigate('/doctor');
    return null;
  }

  const handlePaymentComplete = async () => {
    setIsProcessing(true);
    
    try {
      // Add your payment processing logic here
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsComplete(true);
      toast({
        title: language === 'en' ? "Booking Successful" : "تم الحجز بنجاح",
        description: language === 'en' 
          ? "Your appointment has been confirmed" 
          : "تم تأكيد موعدك",
      });
    } catch (error) {
      toast({
        title: language === 'en' ? "Payment Failed" : "فشل الدفع",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container py-8 max-w-2xl">
      <Button variant="ghost" className="mb-6" onClick={() => navigate('/doctor')}>
        {language === 'en' ? "Back to Doctor Profile" : "العودة إلى ملف الطبيب"}
      </Button>
      
      <h1 className="text-3xl font-bold mb-6">
        {language === 'en' ? "Complete Your Booking" : "إكمال الحجز"}
      </h1>
      
      {isComplete ? (
        <BookingConfirmation
          appointmentDetails={appointmentDetails}
          onDashboardClick={() => navigate('/dashboard')}
        />
      ) : (
        <div className="space-y-6">
          <BookingSummary appointmentDetails={appointmentDetails} />
          <PaymentForm
            fee={appointmentDetails.fee}
            isProcessing={isProcessing}
            onPaymentComplete={handlePaymentComplete}
          />
        </div>
      )}
    </div>
  );
};

export default PaymentPage;
