
import React from 'react';
import { useLanguage } from '@/components/Header';
import { Card, CardContent } from '@/components/ui/card';

const AIInsights = () => {
  const { language } = useLanguage();

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4">
          {language === 'en' ? 'AI Insights' : 'رؤى الذكاء الاصطناعي'}
        </h2>
        <div className="bg-accent/10 p-4 rounded-lg">
          <p className="text-sm italic text-muted-foreground">
            {language === 'en' 
              ? '"Based on your recent mood patterns, you seem to experience higher moods on weekends. Consider activities that bring you joy during weekdays to maintain more balanced emotions."'
              : '"بناءً على أنماط مزاجك الأخيرة، يبدو أنك تشعر بمزاج أفضل في عطلات نهاية الأسبوع. فكر في أنشطة تجلب لك الفرح خلال أيام الأسبوع للحفاظ على مشاعر أكثر توازناً."'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIInsights;
