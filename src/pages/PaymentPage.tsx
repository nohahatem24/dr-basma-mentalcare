
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ChevronLeft } from 'lucide-react';
import { useLanguage } from '@/components/Header';
import { format } from 'date-fns';
import PaymentForm from '@/components/booking/PaymentForm';
import BookingSummary from '@/components/payment/BookingSummary';
import PaymentConfirmation from '@/components/payment/PaymentConfirmation';
import { usePaymentProcess } from '@/hooks/usePaymentProcess';

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
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get appointment details from location state
  const appointmentDetails = location.state as AppointmentDetails;
  
  // If no appointment details, redirect back to doctor profile
  if (!appointmentDetails) {
    navigate('/doctor');
    return null;
  }
  
  const {
    paymentMethod,
    setPaymentMethod,
    cardInfo,
    handleCardInfoChange,
    isProcessing,
    isComplete,
    handleBookingComplete,
    goBack
  } = usePaymentProcess(appointmentDetails);
  
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
        <PaymentConfirmation doctorName={appointmentDetails.doctorName} />
      ) : (
        <div className="space-y-6">
          {/* Appointment Summary */}
          <BookingSummary appointmentDetails={appointmentDetails} />
          
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
