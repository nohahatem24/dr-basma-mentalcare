import React from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { useLanguage } from '@/components/Header';

interface BookingCalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  selectedSlot: string | null;
  onSlotSelect: (slot: string) => void;
  availableSlots: readonly string[];
  onBook: () => void;
}

export const BookingCalendar: React.FC<BookingCalendarProps> = ({
  selectedDate,
  onDateSelect,
  selectedSlot,
  onSlotSelect,
  availableSlots,
  onBook,
}) => {
  const { language } = useLanguage();

  return (
    <div className="space-y-6">
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={(date) => date && onDateSelect(date)}
        className="rounded-md border"
      />

      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {availableSlots.map((slot) => (
          <Button
            key={slot}
            variant={selectedSlot === slot ? "default" : "outline"}
            onClick={() => onSlotSelect(slot)}
            className="w-full"
          >
            {slot}
          </Button>
        ))}
      </div>

      <Button onClick={onBook} className="w-full">
        {language === 'en' ? "Book Appointment" : "حجز موعد"}
      </Button>
    </div>
  );
};