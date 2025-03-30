import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import { useLanguage } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const BookingFloatingButton = () => {
  const { language } = useLanguage();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            asChild
            className="fixed bottom-24 right-6 shadow-lg size-16 rounded-full bg-primary text-primary-foreground" // Adjusted bottom position
            aria-label={language === 'en' ? 'Book Appointment' : 'حجز موعد'}
          >
            <Link to="/book-appointment">
              <Calendar className="h-6 w-6" />
            </Link>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{language === 'en' ? 'Book Appointment' : 'حجز موعد'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default BookingFloatingButton;
