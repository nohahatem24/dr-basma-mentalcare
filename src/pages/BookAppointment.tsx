
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from '@/components/Header';
import AppointmentSummary from '@/components/booking/AppointmentSummary';
import AppointmentDetails from '@/components/booking/AppointmentDetails';
import PaymentForm from '@/components/booking/PaymentForm';

const BookAppointment = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // State for appointment details
  const [appointmentInfo, setAppointmentInfo] = useState({
    date: '',
    time: '',
    reason: '',
    notes: '',
  });
  
  // State for payment
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [cardInfo, setCardInfo] = useState({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: '',
  });
  
  // State for processing payment
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Selected appointment from previous page (would come from context/state in a real app)
  const selectedAppointment = {
    date: '2023-10-15',
    time: '10:00 AM',
    doctorName: 'Dr. Bassma Adel',
    fee: 120
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAppointmentInfo((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleCardInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCardInfo((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleBookingComplete = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      
      toast({
        title: language === 'en' ? "Payment Successful" : "تمت عملية الدفع بنجاح",
        description: language === 'en' 
          ? "Your appointment has been confirmed" 
          : "تم تأكيد موعدك",
      });
      
      // Redirect to confirmation page or dashboard
      navigate('/dashboard');
    }, 2000);
  };
  
  return (
    <div className="container py-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6 text-center">
        {language === 'en' ? "Complete Your Booking" : "إكمال الحجز"}
      </h1>
      
      <div className="grid gap-6">
        {/* Appointment Summary */}
        <AppointmentSummary appointment={selectedAppointment} />
        
        {/* Appointment Details */}
        <AppointmentDetails 
          appointmentInfo={appointmentInfo}
          onChange={handleInputChange}
        />
        
        {/* Payment Information */}
        <PaymentForm 
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          cardInfo={cardInfo}
          handleCardInfoChange={handleCardInfoChange}
          isProcessing={isProcessing}
          handleBookingComplete={handleBookingComplete}
          fee={selectedAppointment.fee}
        />
      </div>
    </div>
  );
};

export default BookAppointment;
