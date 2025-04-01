import React from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from '@/components/Header';

interface CustomBookingFormProps {
  customDate: Date;
  onDateSelect: (date: Date) => void;
  customTime: string;
  onTimeChange: (time: string) => void;
  customNotes: string;
  onNotesChange: (notes: string) => void;
  onSubmit: () => void;
}

export const CustomBookingForm: React.FC<CustomBookingFormProps> = ({
  customDate,
  onDateSelect,
  customTime,
  onTimeChange,
  customNotes,
  onNotesChange,
  onSubmit,
}) => {
  const { language } = useLanguage();

  return (
    <div className="space-y-6">
      <Calendar
        mode="single"
        selected={customDate}
        onSelect={(date) => date && onDateSelect(date)}
        className="rounded-md border"
      />

      <Input
        type="time"
        value={customTime}
        onChange={(e) => onTimeChange(e.target.value)}
        placeholder={language === 'en' ? "Select Time" : "اختر الوقت"}
      />

      <Textarea
        value={customNotes}
        onChange={(e) => onNotesChange(e.target.value)}
        placeholder={language === 'en' ? "Additional Notes" : "ملاحظات إضافية"}
      />

      <Button onClick={onSubmit} className="w-full">
        {language === 'en' ? "Request Appointment" : "طلب موعد"}
      </Button>
    </div>
  );
};