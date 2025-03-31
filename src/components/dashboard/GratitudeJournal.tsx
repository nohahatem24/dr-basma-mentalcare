
import React from 'react';
import { useLanguage } from '@/components/Header';
import { Card, CardContent } from '@/components/ui/card';

const GratitudeJournal = () => {
  const { language } = useLanguage();

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-2xl font-semibold mb-4">
          {language === 'en' ? 'Gratitude Journal' : 'مذكرات الامتنان'}
        </h2>
        <p className="text-muted-foreground mb-4">
          {language === 'en' 
            ? 'Record what you\'re grateful for to improve your mental well-being.' 
            : 'سجل ما أنت ممتن له لتحسين صحتك النفسية.'}
        </p>
        {/* Placeholder for gratitude entries */}
        <div className="bg-accent/10 rounded-lg p-6 text-center">
          <p>{language === 'en' ? 'No gratitude entries yet.' : 'لا توجد مدخلات امتنان حتى الآن.'}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default GratitudeJournal;
