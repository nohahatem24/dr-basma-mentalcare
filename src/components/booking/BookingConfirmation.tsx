import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from 'lucide-react';
import { useLanguage } from '@/components/Header';
import { AppointmentDetails } from '@/types/booking';

interface BookingConfirmationProps {
  appointmentDetails: AppointmentDetails;
  onDashboardClick: () => void;
}

export const BookingConfirmation: React.FC<BookingConfirmationProps> = ({
  appointmentDetails,
  onDashboardClick,
}) => {
  const { language } = useLanguage();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-center mb-4">
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
            <Check className="w-6 h-6 text-green-600" />
          </div>
        </div>
        <CardTitle className="text-center">
          {language === 'en' ? 'Booking Confirmed!' : 'تم تأكيد الحجز!'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="text-center text-muted-foreground">
            {language === 'en'
              ? 'Your appointment has been successfully booked.'
              : 'تم حجز موعدك بنجاح.'}
          </p>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              {language === 'en' ? 'Date:' : 'التاريخ:'} {appointmentDetails.date?.toLocaleDateString()}
            </p>
            <p className="text-sm text-muted-foreground">
              {language === 'en' ? 'Time:' : 'الوقت:'} {appointmentDetails.time}
            </p>
          </div>
        </div>
        <Button onClick={onDashboardClick} className="w-full">
          {language === 'en' ? 'Go to Dashboard' : 'الذهاب إلى لوحة التحكم'}
        </Button>
      </CardContent>
    </Card>
  );
};