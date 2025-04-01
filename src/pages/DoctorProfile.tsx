import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from '@/components/Header';
import { APPOINTMENT_FEES, AVAILABLE_SLOTS } from '@/config/doctor';
import { AppointmentDetails } from '@/types/booking';
import { BookingCalendar } from '@/components/booking/BookingCalendar';
import { CustomBookingForm } from '../components/booking/CustomBookingForm';
import { DoctorHeader } from '@/components/doctor/DoctorHeader';
import { DoctorInfo } from '@/components/doctor/DoctorInfo';

const doctorInfo = {
  name: "Dr. Bassma Adel",
  title: "Clinical Psychologist",
  bio: "Dr. Bassma Adel is a licensed clinical psychologist with over 8 years of experience...",
  certifications: [
    "Master's in Positive Psychology – Mansoura University",
    "Licensed Clinical Psychologist",
    "Certified CBT Specialist",
    "Member of the Egyptian Association for Psychotherapists"
  ],
  rating: 4.9,
  reviewCount: 87
};

const DoctorProfile = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [doctorOnline] = useState(true);
  
  const [customDate, setCustomDate] = useState<Date>(new Date());
  const [customTime, setCustomTime] = useState("");
  const [customNotes, setCustomNotes] = useState("");

  const handleBooking = (details: AppointmentDetails) => {
    console.log('Navigating to payment with details:', details); // Debug log
    navigate('/payment', { state: details });
  };

  const validateAndBook = (type: AppointmentDetails['appointmentType']) => {
    if (type === 'standard' && !selectedSlot) {
      toast({
        title: language === 'en' ? "Select a time slot" : "اختر موعداً",
        variant: "destructive",
      });
      return;
    }

    const details: AppointmentDetails = {
      doctorName: "Dr. Bassma Adel",
      fee: APPOINTMENT_FEES[type],
      appointmentType: type,
      date: type === 'custom' ? customDate : selectedDate,
      time: type === 'custom' ? customTime : selectedSlot || '',
      ...(type === 'custom' && { notes: customNotes }),
    };

    handleBooking(details);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <DoctorHeader 
            doctorInfo={doctorInfo}
            isOnline={doctorOnline}
            onImmediateSession={() => validateAndBook('immediate')}
          />
          
          <Card className="col-span-1 lg:col-span-2">
            <CardHeader>
              <CardTitle>{language === 'en' ? "Book an Appointment" : "حجز موعد"}</CardTitle>
            </CardHeader>
            
            <CardContent>
              <Tabs defaultValue="calendar" className="w-full">
                <TabsList className="mb-4">
                  {/* Tabs triggers */}
                </TabsList>
                
                <TabsContent value="calendar">
                  <BookingCalendar
                    selectedDate={selectedDate}
                    onDateSelect={setSelectedDate}
                    selectedSlot={selectedSlot}
                    onSlotSelect={setSelectedSlot}
                    availableSlots={AVAILABLE_SLOTS}
                    onBook={() => validateAndBook('standard')}
                  />
                </TabsContent>
                
                <TabsContent value="custom">
                  <CustomBookingForm
                    customDate={customDate}
                    onDateSelect={setCustomDate}
                    customTime={customTime}
                    onTimeChange={setCustomTime}
                    customNotes={customNotes}
                    onNotesChange={setCustomNotes}
                    onSubmit={() => validateAndBook('custom')}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          <DoctorInfo doctorInfo={doctorInfo} />
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;
