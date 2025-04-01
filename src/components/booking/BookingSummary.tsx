import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from '@/components/Header';
import { AppointmentDetails } from '@/types/booking';

interface BookingSummaryProps {
  appointmentDetails: AppointmentDetails;
}

export const BookingSummary: React.FC<BookingSummaryProps> = ({ appointmentDetails }) => {
  const { language } = useLanguage();

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {language === 'en' ? 'Booking Summary' : 'ملخص الحجز'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between">
          <span className="text-muted-foreground">
            {language === 'en' ? 'Doctor' : 'الطبيب'}
          </span>
          <span>{appointmentDetails.doctorName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">
            {language === 'en' ? 'Date' : 'التاريخ'}
          </span>
          <span>{appointmentDetails.date?.toLocaleDateString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">
            {language === 'en' ? 'Time' : 'الوقت'}
          </span>
          <span>{appointmentDetails.time}</span>
        </div>
        <div className="flex justify-between font-semibold">
          <span>{language === 'en' ? 'Total Fee' : 'الرسوم'}</span>
          <span>${appointmentDetails.fee}</span>
        </div>
      </CardContent>
    </Card>
  );
};