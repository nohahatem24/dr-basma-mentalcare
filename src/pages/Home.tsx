import React, { useState, useEffect } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { AppointmentBooking } from '@/components/appointment/AppointmentBooking';
import { SecurePayment } from '@/components/payment/SecurePayment';
import { DoctorStatus, DoctorStatusType } from '@/components/doctor/DoctorStatus';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';
import { Calendar, Video, CreditCard, Shield, Clock, HeartPulse } from 'lucide-react';
import { Appointment } from '@/types/appointment';

const Home: React.FC = () => {
  const { t, isRTL } = useTranslation();
  const [currentAppointment, setCurrentAppointment] = useState<Appointment | null>(null);
  const [doctorStatus, setDoctorStatus] = useState<DoctorStatusType>('offline');
  const [showPayment, setShowPayment] = useState(false);
  
  // Mock doctor ID for demonstration
  const mockDoctorId = "doctor-123";
  
  // Handle booking completion
  const handleBookingComplete = (appointment: Appointment) => {
    setCurrentAppointment(appointment);
    setShowPayment(true);
  };
  
  // Handle payment completion
  const handlePaymentComplete = (success: boolean) => {
    if (success && currentAppointment) {
      // In a real app, you would navigate to a confirmation screen
      // or show a success message and clear the appointment state
      setTimeout(() => {
        setCurrentAppointment(null);
        setShowPayment(false);
      }, 3000);
    }
  };
  
  // Handle doctor status change
  const handleStatusChange = (status: DoctorStatusType) => {
    setDoctorStatus(status);
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <HeartPulse className="h-8 w-8 text-primary" />
            <h1 className={`text-2xl font-bold text-gray-900 ${isRTL ? 'mr-2' : 'ml-2'}`}>
              {t('mentalCare')}
            </h1>
          </div>
          <LanguageSwitcher variant="full" />
        </div>
      </header>
      
      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            {t('mentalHealthSupport')}
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            {t('homeHeroDescription')}
          </p>
        </div>
        
        {/* Doctor Status and Appointment Booking Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Doctor Status */}
          <div>
            <DoctorStatus 
              initialStatus={doctorStatus}
              doctorId={mockDoctorId}
              onStatusChange={handleStatusChange}
              readonly={false}
            />
          </div>
          
          {/* Appointment Booking or Payment */}
          <div>
            {showPayment && currentAppointment ? (
              <SecurePayment 
                appointment={currentAppointment}
                onPaymentComplete={handlePaymentComplete}
              />
            ) : (
              <AppointmentBooking 
                doctorId={mockDoctorId}
                onBookingComplete={handleBookingComplete}
              />
            )}
          </div>
        </div>
        
        {/* Features Section */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-12">
          <div className="p-6">
            <h2 className="text-2xl font-semibold mb-6 text-center">{t('ourFeatures')}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Feature 1: Instant Sessions */}
              <div className="flex flex-col items-center text-center p-4">
                <div className="bg-primary bg-opacity-10 p-3 rounded-full mb-4">
                  <Video className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-medium mb-2">{t('instantSessions')}</h3>
                <p className="text-gray-600">{t('instantSessionsDescription')}</p>
              </div>
              
              {/* Feature 2: Secure Payment */}
              <div className="flex flex-col items-center text-center p-4">
                <div className="bg-primary bg-opacity-10 p-3 rounded-full mb-4">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-medium mb-2">{t('securePayment')}</h3>
                <p className="text-gray-600">{t('securePaymentDescription')}</p>
              </div>
              
              {/* Feature 3: Doctor Status Tracking */}
              <div className="flex flex-col items-center text-center p-4">
                <div className="bg-primary bg-opacity-10 p-3 rounded-full mb-4">
                  <Clock className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-medium mb-2">{t('statusTracking')}</h3>
                <p className="text-gray-600">{t('statusTrackingDescription')}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* How It Works Section */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6">
            <h2 className="text-2xl font-semibold mb-6 text-center">{t('howItWorks')}</h2>
            
            <div className="flex flex-col space-y-8">
              {/* Step 1 */}
              <div className="flex flex-col md:flex-row items-center">
                <div className="flex-shrink-0 bg-primary text-white rounded-full w-12 h-12 flex items-center justify-center mb-4 md:mb-0 md:mr-6">
                  1
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">{t('step1Title')}</h3>
                  <p className="text-gray-600">{t('step1Description')}</p>
                </div>
              </div>
              
              {/* Step 2 */}
              <div className="flex flex-col md:flex-row items-center">
                <div className="flex-shrink-0 bg-primary text-white rounded-full w-12 h-12 flex items-center justify-center mb-4 md:mb-0 md:mr-6">
                  2
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">{t('step2Title')}</h3>
                  <p className="text-gray-600">{t('step2Description')}</p>
                </div>
              </div>
              
              {/* Step 3 */}
              <div className="flex flex-col md:flex-row items-center">
                <div className="flex-shrink-0 bg-primary text-white rounded-full w-12 h-12 flex items-center justify-center mb-4 md:mb-0 md:mr-6">
                  3
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">{t('step3Title')}</h3>
                  <p className="text-gray-600">{t('step3Description')}</p>
                </div>
              </div>
              
              {/* Step 4 */}
              <div className="flex flex-col md:flex-row items-center">
                <div className="flex-shrink-0 bg-primary text-white rounded-full w-12 h-12 flex items-center justify-center mb-4 md:mb-0 md:mr-6">
                  4
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">{t('step4Title')}</h3>
                  <p className="text-gray-600">{t('step4Description')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-white shadow-inner mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <HeartPulse className="h-6 w-6 text-primary" />
              <h3 className={`text-xl font-semibold text-gray-900 ${isRTL ? 'mr-2' : 'ml-2'}`}>
                {t('mentalCare')}
              </h3>
            </div>
            
            <div className="flex flex-wrap justify-center space-x-4">
              <a href="#" className="text-gray-600 hover:text-primary">{t('aboutUs')}</a>
              <a href="#" className="text-gray-600 hover:text-primary">{t('contactUs')}</a>
              <a href="#" className="text-gray-600 hover:text-primary">{t('privacyPolicy')}</a>
              <a href="#" className="text-gray-600 hover:text-primary">{t('termsOfService')}</a>
            </div>
          </div>
          
          <div className="mt-8 text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Mental Care. {t('allRightsReserved')}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home; 