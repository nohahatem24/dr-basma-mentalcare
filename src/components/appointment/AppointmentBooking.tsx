import React, { useState, useEffect } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { Calendar, Clock, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Appointment } from '@/types/appointment';

interface TimeSlot {
  id: string;
  startTime: Date;
  endTime: Date;
  isAvailable: boolean;
}

interface AppointmentBookingProps {
  doctorId: string;
  onBookingComplete: (appointment: Appointment) => void;
}

export const AppointmentBooking: React.FC<AppointmentBookingProps> = ({
  doctorId,
  onBookingComplete,
}) => {
  const { t, isRTL } = useTranslation();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [dateOptions, setDateOptions] = useState<Date[]>([]);
  
  // Generate date options for the next 14 days
  useEffect(() => {
    const dates: Date[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    
    setDateOptions(dates);
  }, []);
  
  // Format date for display
  const formatDate = (date: Date): string => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.getTime() === today.getTime()) {
      return t('today');
    } else if (date.getTime() === tomorrow.getTime()) {
      return t('tomorrow');
    }
    
    return date.toLocaleDateString(isRTL ? 'ar-SA' : 'en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };
  
  // Format time for display
  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString(isRTL ? 'ar-SA' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  // Fetch time slots for the selected date
  useEffect(() => {
    const fetchTimeSlots = async () => {
      setIsLoading(true);
      setError(null);
      setSelectedTimeSlot(null);
      
      try {
        // For demonstration purposes, we'll generate random time slots
        // In a real application, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
        
        const slots: TimeSlot[] = [];
        const startOfDay = new Date(selectedDate);
        startOfDay.setHours(9, 0, 0, 0); // Start at 9:00 AM
        
        // Generate 10 slots with random availability
        for (let i = 0; i < 10; i++) {
          const startTime = new Date(startOfDay);
          startTime.setMinutes(startTime.getMinutes() + i * 60); // 1-hour slots
          
          const endTime = new Date(startTime);
          endTime.setMinutes(endTime.getMinutes() + 50); // 50-minute duration
          
          slots.push({
            id: `slot-${i}`,
            startTime,
            endTime,
            isAvailable: Math.random() > 0.3, // Random availability
          });
        }
        
        setTimeSlots(slots);
      } catch (error) {
        setError(t('errorOccurred'));
        console.error('Error fetching time slots:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTimeSlots();
  }, [selectedDate, t, isRTL]);
  
  // Handle date selection
  const handleDateSelection = (date: Date) => {
    setSelectedDate(date);
  };
  
  // Handle time slot selection
  const handleTimeSlotSelection = (timeSlot: TimeSlot) => {
    setSelectedTimeSlot(timeSlot);
  };
  
  // Handle booking a scheduled appointment
  const handleScheduledBooking = async () => {
    if (!selectedTimeSlot) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create a new appointment
      const appointment: Appointment = {
        id: `appointment-${Date.now()}`,
        patientId: 'patient-123', // Assuming a logged-in patient
        doctorId,
        timeSlotId: selectedTimeSlot.id,
        startTime: selectedTimeSlot.startTime,
        endTime: selectedTimeSlot.endTime,
        type: 'scheduled',
        status: 'pending',
        paymentStatus: 'pending',
        price: 75, // Example price
        doctorName: 'Dr. Sarah Ahmad', // Example doctor name for display in payment
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      onBookingComplete(appointment);
    } catch (error) {
      setError(t('appointmentFailed'));
      console.error('Error booking appointment:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle booking an immediate appointment
  const handleImmediateBooking = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Start time is now
      const startTime = new Date();
      
      // End time is 50 minutes from now
      const endTime = new Date(startTime);
      endTime.setMinutes(endTime.getMinutes() + 50);
      
      // Create a new immediate appointment
      const appointment: Appointment = {
        id: `immediate-${Date.now()}`,
        patientId: 'patient-123', // Assuming a logged-in patient
        doctorId,
        timeSlotId: `immediate-${Date.now()}`,
        startTime,
        endTime,
        type: 'immediate',
        status: 'confirmed',
        paymentStatus: 'pending',
        price: 100, // Example price (higher for immediate sessions)
        doctorName: 'Dr. Sarah Ahmad', // Example doctor name for display in payment
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      onBookingComplete(appointment);
    } catch (error) {
      setError(t('appointmentFailed'));
      console.error('Error booking immediate appointment:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">{t('appointmentBooking')}</h2>
        
        {/* Date selection */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-2">{t('selectDate')}</h3>
          <div className="flex overflow-x-auto pb-2 space-x-2 rtl:space-x-reverse">
            {dateOptions.map((date) => (
              <button
                key={date.toISOString()}
                onClick={() => handleDateSelection(date)}
                className={`flex flex-col items-center justify-center min-w-[100px] px-3 py-2 rounded-lg border transition-colors ${
                  selectedDate.toDateString() === date.toDateString()
                    ? 'bg-primary text-white border-primary'
                    : 'border-gray-200 hover:border-primary'
                }`}
              >
                <span className={`text-xs ${selectedDate.toDateString() === date.toDateString() ? 'text-white' : 'text-gray-500'}`}>
                  {date.toLocaleDateString(isRTL ? 'ar-SA' : 'en-US', { weekday: 'short' })}
                </span>
                <span className="text-sm font-medium mt-1">
                  {formatDate(date)}
                </span>
              </button>
            ))}
          </div>
        </div>
        
        {/* Time slots */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-2">{t('availableTimeSlots')}</h3>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
              <span className="ml-2 text-gray-600">{t('loading')}</span>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center py-8 text-red-500">
              <XCircle className="w-6 h-6 mr-2" />
              <span>{error}</span>
            </div>
          ) : timeSlots.length === 0 || !timeSlots.some(slot => slot.isAvailable) ? (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="w-12 h-12 mx-auto text-gray-400 mb-2" />
              <p>{t('noAvailableTimeSlots')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {timeSlots
                .filter(slot => slot.isAvailable)
                .map((slot) => (
                  <button
                    key={slot.id}
                    onClick={() => handleTimeSlotSelection(slot)}
                    className={`flex items-center justify-center py-2 px-3 rounded-lg border text-sm transition-colors ${
                      selectedTimeSlot?.id === slot.id
                        ? 'bg-primary text-white border-primary'
                        : 'border-gray-200 hover:border-primary'
                    }`}
                  >
                    <Clock className={`w-4 h-4 ${selectedTimeSlot?.id === slot.id ? 'text-white' : 'text-gray-500'} mr-1`} />
                    <span>
                      {formatTime(slot.startTime)}
                    </span>
                  </button>
                ))}
            </div>
          )}
        </div>
        
        {/* Book immediate session button */}
        <div className="mb-4">
          <button
            onClick={handleImmediateBooking}
            disabled={isLoading}
            className="w-full py-2 px-4 bg-secondary hover:bg-secondary-dark text-white rounded-lg transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                {t('loading')}
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5 mr-2" />
                {t('bookImmediateSession')}
              </>
            )}
          </button>
        </div>
        
        {/* Book scheduled session button */}
        <button
          onClick={handleScheduledBooking}
          disabled={!selectedTimeSlot || isLoading}
          className={`w-full py-2 px-4 rounded-lg transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed ${
            selectedTimeSlot 
              ? 'bg-primary hover:bg-primary-dark text-white' 
              : 'bg-gray-100 text-gray-400'
          }`}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              {t('loading')}
            </>
          ) : (
            <>
              <Calendar className="w-5 h-5 mr-2" />
              {t('bookAppointment')}
            </>
          )}
        </button>
      </div>
    </div>
  );
}; 