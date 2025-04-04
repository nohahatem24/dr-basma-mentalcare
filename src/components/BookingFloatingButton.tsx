
import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/components/Header';

const BookingFloatingButton = () => {
  const { language } = useLanguage();

  return (
    <Button
      className="fixed bottom-20 right-6 md:right-10 shadow-lg rounded-full h-14 w-14 p-0 bg-gradient-to-r from-mindtrack-blue to-mindtrack-green hover:opacity-90 z-50"
      asChild
    >
      <Link to="/book-appointment" aria-label={language === 'en' ? 'Book a session' : 'حجز جلسة'}>
        <Calendar className="h-6 w-6 text-white" />
      </Link>
    </Button>
  );
};

export default BookingFloatingButton;
