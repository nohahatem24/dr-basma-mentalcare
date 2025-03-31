
import React from 'react';
import { useLanguage } from '@/components/Header';

export const BreathingBenefits = () => {
  const { language } = useLanguage();
  
  return (
    <div className="bg-muted/20 p-4 rounded-lg">
      <h3 className={`font-medium mb-2 ${language === 'ar' ? 'text-right' : ''}`}>
        {language === 'en' ? 'Benefits of Breathing Exercises' : 'فوائد تمارين التنفس'}
      </h3>
      <ul className={`text-sm space-y-1 list-disc ${language === 'ar' ? 'text-right pr-6' : 'list-inside'} text-muted-foreground`}>
        <li>
          {language === 'en' 
            ? 'Reduces stress and anxiety' 
            : 'تقليل التوتر والقلق'}
        </li>
        <li>
          {language === 'en' 
            ? 'Lowers blood pressure and heart rate' 
            : 'خفض ضغط الدم ومعدل ضربات القلب'}
        </li>
        <li>
          {language === 'en' 
            ? 'Improves focus and mental clarity' 
            : 'تحسين التركيز والوضوح الذهني'}
        </li>
        <li>
          {language === 'en' 
            ? 'Helps manage emotional responses' 
            : 'يساعد في إدارة الاستجابات العاطفية'}
        </li>
      </ul>
    </div>
  );
};
