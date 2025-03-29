import React, { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { LockIcon, CreditCardIcon, CheckCircleIcon, AlertCircleIcon } from 'lucide-react';

interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  startTime: Date;
  endTime: Date;
  type: 'immediate' | 'scheduled';
  price: number;
}

interface SecurePaymentProps {
  appointment: Appointment;
  onPaymentComplete: (success: boolean) => void;
}

export const SecurePayment: React.FC<SecurePaymentProps> = ({
  appointment,
  onPaymentComplete,
}) => {
  const { t, isRTL } = useTranslation();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState<boolean | null>(null);
  const [cardDetails, setCardDetails] = useState({
    cardholderName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    saveCard: false,
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setCardDetails({
      ...cardDetails,
      [name]: type === 'checkbox' ? checked : value,
    });
  };
  
  const formatCardNumber = (value: string) => {
    // Remove any non-digit characters
    const cleaned = value.replace(/\D/g, '');
    
    // Format with spaces every 4 digits
    const formatted = cleaned.replace(/(\d{4})(?=\d)/g, '$1 ');
    
    // Limit to 19 characters (16 digits + 3 spaces)
    return formatted.substring(0, 19);
  };
  
  const formatExpiryDate = (value: string) => {
    // Remove any non-digit characters
    const cleaned = value.replace(/\D/g, '');
    
    // Format as MM/YY
    if (cleaned.length > 2) {
      return `${cleaned.substring(0, 2)}/${cleaned.substring(2, 4)}`;
    }
    
    return cleaned;
  };
  
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setCardDetails({ ...cardDetails, cardNumber: formatted });
  };
  
  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiryDate(e.target.value);
    setCardDetails({ ...cardDetails, expiryDate: formatted });
  };
  
  const validateForm = () => {
    // Simple validation for demo purposes
    return (
      cardDetails.cardholderName.trim() !== '' &&
      cardDetails.cardNumber.replace(/\s/g, '').length === 16 &&
      cardDetails.expiryDate.length === 5 &&
      cardDetails.cvv.length === 3
    );
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsProcessing(true);
    setPaymentSuccess(null);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real app, this would be an API call to a payment processor
      // For demo, we'll simulate a successful payment 90% of the time
      const success = Math.random() < 0.9;
      
      setPaymentSuccess(success);
      
      // Wait a moment before notifying parent
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onPaymentComplete(success);
    } catch (error) {
      console.error('Payment error:', error);
      setPaymentSuccess(false);
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Format appointment duration in minutes
  const getDurationMinutes = () => {
    const start = new Date(appointment.startTime);
    const end = new Date(appointment.endTime);
    return Math.round((end.getTime() - start.getTime()) / (1000 * 60));
  };
  
  // Format date for display
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  
  // Format time for display
  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString(isRTL ? 'ar-SA' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">{t('payment')}</h2>
        
        {/* Appointment summary */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="font-medium text-gray-700 mb-2">{t('appointmentDetails')}</h3>
          <div className="space-y-2 text-sm">
            <p className="flex justify-between">
              <span className="text-gray-600">{t('doctorName')}:</span>
              <span className="font-medium">{appointment.doctorName}</span>
            </p>
            <p className="flex justify-between">
              <span className="text-gray-600">{t('date')}:</span>
              <span className="font-medium">{formatDate(appointment.startTime)}</span>
            </p>
            <p className="flex justify-between">
              <span className="text-gray-600">{t('time')}:</span>
              <span className="font-medium">
                {formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}
              </span>
            </p>
            <p className="flex justify-between">
              <span className="text-gray-600">{t('duration')}:</span>
              <span className="font-medium">{getDurationMinutes()} {t('minutes')}</span>
            </p>
            <p className="flex justify-between">
              <span className="text-gray-600">{t('type')}:</span>
              <span className="font-medium">
                {appointment.type === 'immediate' ? t('instantSession') : t('scheduledSession')}
              </span>
            </p>
            <div className="border-t pt-2 mt-2">
              <p className="flex justify-between font-semibold">
                <span>{t('totalAmount')}:</span>
                <span>${appointment.price.toFixed(2)}</span>
              </p>
            </div>
          </div>
        </div>
        
        {/* Payment status messages */}
        {paymentSuccess === true && (
          <div className="bg-green-50 text-green-700 p-4 rounded-lg mb-6 flex items-start">
            <CheckCircleIcon className="w-6 h-6 text-green-500 mr-2 flex-shrink-0" />
            <div>
              <h3 className="font-medium">{t('paymentSuccessful')}</h3>
              <p className="text-sm mt-1">{t('paymentConfirmationMessage')}</p>
            </div>
          </div>
        )}
        
        {paymentSuccess === false && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 flex items-start">
            <AlertCircleIcon className="w-6 h-6 text-red-500 mr-2 flex-shrink-0" />
            <div>
              <h3 className="font-medium">{t('paymentFailed')}</h3>
              <p className="text-sm mt-1">{t('paymentFailureMessage')}</p>
            </div>
          </div>
        )}
        
        {/* Payment form */}
        {paymentSuccess === null && (
          <form onSubmit={handleSubmit}>
            {/* Card details section */}
            <div className="space-y-4">
              <div>
                <label htmlFor="cardholderName" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('cardholderName')}
                </label>
                <input
                  type="text"
                  id="cardholderName"
                  name="cardholderName"
                  value={cardDetails.cardholderName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              
              <div>
                <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('cardNumber')}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="cardNumber"
                    name="cardNumber"
                    value={cardDetails.cardNumber}
                    onChange={handleCardNumberChange}
                    placeholder="XXXX XXXX XXXX XXXX"
                    required
                    maxLength={19}
                    className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <CreditCardIcon className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('expiryDate')}
                  </label>
                  <input
                    type="text"
                    id="expiryDate"
                    name="expiryDate"
                    value={cardDetails.expiryDate}
                    onChange={handleExpiryDateChange}
                    placeholder="MM/YY"
                    required
                    maxLength={5}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('cvv')}
                  </label>
                  <input
                    type="text"
                    id="cvv"
                    name="cvv"
                    value={cardDetails.cvv}
                    onChange={handleInputChange}
                    placeholder="XXX"
                    required
                    maxLength={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="saveCard"
                  name="saveCard"
                  checked={cardDetails.saveCard}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor="saveCard" className="ml-2 block text-sm text-gray-700">
                  {t('saveCardForFuture')}
                </label>
              </div>
            </div>
            
            {/* Submit button */}
            <div className="mt-6">
              <button
                type="submit"
                disabled={isProcessing}
                className={`w-full py-3 px-4 rounded-lg flex items-center justify-center ${
                  isProcessing
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-primary text-white hover:bg-opacity-90'
                } transition-colors`}
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    {t('processingPayment')}
                  </>
                ) : (
                  <>
                    <LockIcon className="w-5 h-5 mr-2" />
                    {t('payNow')} (${appointment.price.toFixed(2)})
                  </>
                )}
              </button>
            </div>
            
            {/* Security note */}
            <div className="mt-4 text-center text-xs text-gray-500 flex items-center justify-center">
              <LockIcon className="w-3 h-3 mr-1" />
              <span>{t('securePaymentMessage')}</span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}; 