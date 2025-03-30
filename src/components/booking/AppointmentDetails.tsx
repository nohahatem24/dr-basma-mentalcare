
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from '@/components/Header';

interface AppointmentDetailsProps {
  appointmentInfo: {
    reason: string;
    notes: string;
  };
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const AppointmentDetails: React.FC<AppointmentDetailsProps> = ({ 
  appointmentInfo, 
  onChange 
}) => {
  const { language } = useLanguage();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {language === 'en' ? "Appointment Details" : "تفاصيل الموعد"}
        </CardTitle>
        <CardDescription>
          {language === 'en' 
            ? "Please provide additional information for your session" 
            : "يرجى تقديم معلومات إضافية لجلستك"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="reason">
            {language === 'en' ? "Reason for Visit" : "سبب الزيارة"}
          </Label>
          <Textarea 
            id="reason"
            name="reason"
            value={appointmentInfo.reason}
            onChange={onChange}
            placeholder={language === 'en' ? "Briefly describe your reason for this appointment" : "صف بإيجاز سبب هذا الموعد"}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="notes">
            {language === 'en' ? "Additional Notes" : "ملاحظات إضافية"}
          </Label>
          <Textarea 
            id="notes"
            name="notes"
            value={appointmentInfo.notes}
            onChange={onChange}
            placeholder={language === 'en' ? "Any other information you'd like to share (optional)" : "أي معلومات أخرى ترغب في مشاركتها (اختياري)"}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default AppointmentDetails;
