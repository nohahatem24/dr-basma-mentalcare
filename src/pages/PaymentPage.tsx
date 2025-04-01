import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from '@/components/Header';
import { Button } from "@/components/ui/button";
import { AppointmentDetails } from '@/types/booking';
import { BookingSummary } from '@/components/booking/BookingSummary';
import { BookingConfirmation } from '@/components/booking/BookingConfirmation';

type PaymentFormProps = {
  fee: number;
  isProcessing: boolean;
  onPaymentComplete: () => Promise<void>;
};

const PaymentForm: React.FC<PaymentFormProps> = ({ fee, isProcessing, onPaymentComplete }) => {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onPaymentComplete();
      }}
      className="space-y-4"
    >
      <div>
        <label className="block text-sm font-medium">Card Number</label>
        <input
          type="text"
          placeholder="Enter your card number"
          className="w-full p-2 border rounded-md"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Expiry Date</label>
        <input
          type="text"
          placeholder="MM/YY"
          className="w-full p-2 border rounded-md"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">CVV</label>
        <input
          type="text"
          placeholder="Enter CVV"
          className="w-full p-2 border rounded-md"
        />
      </div>
      <button
        type="submit"
        disabled={isProcessing}
        className="w-full bg-primary text-white py-2 rounded-md"
      >
        {isProcessing ? "Processing..." : `Pay $${fee}`}
      </button>
    </form>
  );
};

export const PaymentPage = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const appointmentDetails = location.state as AppointmentDetails;

  if (!appointmentDetails) {
    return (
      <div className="container py-8 max-w-2xl">
        <div className="text-center">
          <p className="text-red-500">
            {language === 'en' ? "No appointment details found" : "لم يتم العثور على تفاصيل الموعد"}
          </p>
          <Button className="mt-4" onClick={() => navigate('/doctor')}>
            {language === 'en' ? "Go Back" : "العودة"}
          </Button>
        </div>
      </div>
    );
  }

  const handlePaymentComplete = async () => {
    setIsProcessing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
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
