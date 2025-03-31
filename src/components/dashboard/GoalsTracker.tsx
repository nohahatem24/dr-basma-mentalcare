
import React from 'react';
import { useLanguage } from '@/components/Header';
import { Card, CardContent } from '@/components/ui/card';

const GoalsTracker = () => {
  const { language } = useLanguage();

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-2xl font-semibold mb-4">
          {language === 'en' ? 'Your Goals' : 'أهدافك'}
        </h2>
        <p className="text-muted-foreground mb-4">
          {language === 'en' 
            ? 'Set and track your personal growth goals.' 
            : 'حدد وتتبع أهداف نموك الشخصي.'}
        </p>
        {/* Placeholder for goals */}
        <div className="bg-accent/10 rounded-lg p-6 text-center">
          <p>{language === 'en' ? 'No goals set yet.' : 'لم يتم تحديد أهداف بعد.'}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default GoalsTracker;
