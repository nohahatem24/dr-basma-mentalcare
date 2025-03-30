
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from '@/components/Header';

interface AppointmentSummaryProps {
  appointment: {
    doctorName: string;
    date: string;
    time: string;
    fee: number;
  };
}

const AppointmentSummary: React.FC<AppointmentSummaryProps> = ({ appointment }) => {
  const { language } = useLanguage();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {language === 'en' ? "Appointment Summary" : "ملخص الموعد"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex justify-between">
          <span className="text-muted-foreground">
            {language === 'en' ? "Doctor" : "الطبيب"}:
          </span>
          <span className="font-medium">{appointment.doctorName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">
            {language === 'en' ? "Date" : "التاريخ"}:
          </span>
          <span className="font-medium">{appointment.date}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">
            {language === 'en' ? "Time" : "الوقت"}:
          </span>
          <span className="font-medium">{appointment.time}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">
            {language === 'en' ? "Fee" : "الرسوم"}:
          </span>
          <span className="font-medium">${appointment.fee}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default AppointmentSummary;
