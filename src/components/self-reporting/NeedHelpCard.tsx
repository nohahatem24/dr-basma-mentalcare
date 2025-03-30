
import React from 'react';
import { useLanguage } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card-component';
import { Link } from 'react-router-dom';

const NeedHelpCard = () => {
  const { language } = useLanguage();

  return (
    <Card className="p-6 bg-accent/10 rounded-lg">
      <h3 className="text-xl font-semibold mb-3">
        {language === 'en' ? 'Need Professional Help?' : 'بحاجة إلى مساعدة مهنية؟'}
      </h3>
      <p className="text-sm text-muted-foreground mb-4">
        {language === 'en'
          ? 'Self-reporting is helpful, but sometimes talking to a professional can make a big difference.'
          : 'التقييم الذاتي مفيد، ولكن أحيانًا يمكن أن يحدث التحدث مع مختص فرقًا كبيرًا.'}
      </p>
      <Button asChild className="w-full">
        <Link to="/book-appointment">
          {language === 'en' ? 'Book an Appointment' : 'حجز موعد'}
        </Link>
      </Button>
    </Card>
  );
};

export default NeedHelpCard;
