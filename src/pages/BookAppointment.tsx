import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from '@/components/Header';
import { useTheme } from '@/hooks/use-theme';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppointmentSummary from '@/components/booking/AppointmentSummary';
import BookingImageLight from '@/assets/images/BasmaAdelLight.jpg';
import BookingImageDark from '@/assets/images/BasmaAdelDark.jpg';
import { format, addMinutes, parse } from 'date-fns';

interface TimeSlot {
  id: string;
  date: string;
  time: string;
  isAvailable: boolean;
  doctorId: string;
}

const BookAppointment = () => {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { session: authSession } = useAuth();
  
  // State for selected date
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  // State for time slots
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  
  // Fetch time slots when date changes
  useEffect(() => {
    const fetchTimeSlots = async () => {
      if (!selectedDate) return;

      // Here we would normally fetch from Supabase
      // For now, we'll simulate some time slots
      const formattedDate = selectedDate.toISOString().split('T')[0];
      
      // Simulate fetching slots from the database
      const mockTimeSlots: TimeSlot[] = [
        { id: '1', date: formattedDate, time: '09:00 AM', isAvailable: true, doctorId: 'dr-Basma' },
        { id: '2', date: formattedDate, time: '10:00 AM', isAvailable: true, doctorId: 'dr-Basma' },
        { id: '3', date: formattedDate, time: '11:00 AM', isAvailable: false, doctorId: 'dr-Basma' },
        { id: '4', date: formattedDate, time: '01:00 PM', isAvailable: true, doctorId: 'dr-Basma' },
        { id: '5', date: formattedDate, time: '02:00 PM', isAvailable: true, doctorId: 'dr-Basma' },
        { id: '6', date: formattedDate, time: '03:00 PM', isAvailable: false, doctorId: 'dr-Basma' },
      ];
      
      setTimeSlots(mockTimeSlots);
      setSelectedSlot(null); // Reset selected slot when date changes
    };
    
    fetchTimeSlots();
  }, [selectedDate]);
  
  // Check if user is logged in
  useEffect(() => {
    const checkAuth = async () => {
      if (!authSession.isAuthenticated) {
        toast({
          title: language === 'en' ? "Login Required" : "مطلوب تسجيل الدخول",
          description: language === 'en' 
            ? "Please login to book an appointment" 
            : "الرجاء تسجيل الدخول لحجز موعد",
          variant: "default",
        });
        
        navigate('/auth', { state: { from: { pathname: '/book-appointment' } } });
      }
    };
    
    checkAuth();
  }, [authSession.isAuthenticated, navigate, toast, language]);
  
  const handleBookAppointment = () => {
    if (!selectedSlot) {
      toast({
        title: language === 'en' ? "Error" : "خطأ",
        description: language === 'en' 
          ? "Please select a time slot" 
          : "يرجى اختيار موعد",
        variant: "destructive"
      });
      return;
    }
    
    // Calculate session end time (assuming 60 minutes duration)
    const duration = 60;
    const timeFormat = 'h:mm a';
    const startTime = selectedSlot.time;
    const parsedStartTime = parse(startTime, timeFormat, new Date());
    const endTimeDate = addMinutes(parsedStartTime, duration);
    const endTime = format(endTimeDate, timeFormat);
    
    // Navigate to payment page with appointment details
    navigate('/payment', { 
      state: { 
        date: selectedDate,
        doctorName: 'Dr. Basma Adel',
        fee: 120,
        duration: duration.toString(),
        appointmentType: 'standard',
        startTime: startTime,
        endTime: endTime,
        currency: 'EGP'
      } 
    });
  };
  
  return (
    <div className="container py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 text-center">
        {language === 'en' ? "Book an Appointment" : "حجز موعد"}
      </h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        {/* Left Column - Date and Time Selection */}
        <Card>
          <CardHeader>
            <CardTitle>
              {language === 'en' ? "Select Date & Time" : "اختر التاريخ والوقت"}
            </CardTitle>
            <CardDescription>
              {language === 'en' 
                ? "Choose an available slot for your session" 
                : "اختر موعدًا متاحًا لجلستك"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="aspect-video rounded-lg overflow-hidden mb-4">
              <img 
                src={theme === 'dark' ? BookingImageDark : BookingImageLight} 
                alt="Booking Session" 
                className="h-full w-full object-cover" 
              />
            </div>
            {/* Calendar for date selection */}
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border mx-auto"
              disabled={(date) => 
                date < new Date(new Date().setHours(0, 0, 0, 0)) || 
                date > new Date(new Date().setDate(new Date().getDate() + 30))
              }
            />
            
            {/* Time slots */}
            <div className="mt-6">
              <h3 className="font-medium mb-2">
                {language === 'en' ? "Available Times" : "الأوقات المتاحة"}
              </h3>
              
              {timeSlots.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  {language === 'en' 
                    ? "No available slots for this date" 
                    : "لا توجد مواعيد متاحة لهذا التاريخ"}
                </p>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {timeSlots.map((slot) => (
                    <Button
                      key={slot.id}
                      variant={selectedSlot?.id === slot.id ? "default" : "outline"}
                      disabled={!slot.isAvailable}
                      onClick={() => setSelectedSlot(slot)}
                      className="justify-center"
                    >
                      {slot.time}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Right Column - Appointment Details and Payment */}
        <div className="space-y-6">
          {/* Selected appointment summary */}
          {selectedSlot && (
            <AppointmentSummary 
              appointment={{
                date: selectedSlot.date,
                time: selectedSlot.time,
                doctorName: 'Dr. Basma Adel',
                fee: 120
              }} 
            />
          )}
          
          {/* Payment Information - Only show if a slot is selected */}
          {selectedSlot && (
            <Button onClick={handleBookAppointment} className="w-full">
              {language === 'en' ? "Book Now" : "حجز الآن"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;
