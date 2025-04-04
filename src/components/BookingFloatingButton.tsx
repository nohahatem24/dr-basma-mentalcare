
import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/components/Header';

const BookingFloatingButton = () => {
  const { language } = useLanguage();

  return (
    <Button
      className="fixed bottom-24 right-6 rounded-full h-16 w-16 shadow-lg z-50 bg-primary hover:bg-primary/90"
      asChild
    >
      <Link to="/book-appointment" aria-label={language === 'en' ? 'Book a session' : 'حجز جلسة'}>
        <Calendar className="h-6 w-6 text-white" />
      </Link>
    </Button>
  );
};

export default BookingFloatingButton;
