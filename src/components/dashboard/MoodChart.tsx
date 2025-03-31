
import React from 'react';
import { useLanguage } from '@/components/Header';
import { Card, CardContent } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock data for the mood chart
const mockMoodData = [
  { day: 'Mon', mood: 3 },
  { day: 'Tue', mood: 4 },
  { day: 'Wed', mood: 2 },
  { day: 'Thu', mood: 5 },
  { day: 'Fri', mood: 3 },
  { day: 'Sat', mood: 4 },
  { day: 'Sun', mood: 5 },
];

const MoodChart = () => {
  const { language } = useLanguage();
  
  // Week days translated
  const weekDays = {
    en: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    ar: ['الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت', 'الأحد']
  };
  
  // Translated mood data
  const moodDataTranslated = mockMoodData.map((item, index) => ({
    ...item,
    day: language === 'en' ? weekDays.en[index] : weekDays.ar[index]
  }));

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4">
          {language === 'en' ? 'Mood Trends' : 'اتجاهات المزاج'}
        </h2>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={moodDataTranslated}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="mood"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={{ strokeWidth: 2 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
        <div className="flex justify-between text-xs text-muted-foreground mt-2">
          <span>{language === 'en' ? '1 - Very Low' : '١ - منخفض جداً'}</span>
          <span>{language === 'en' ? '3 - Neutral' : '٣ - محايد'}</span>
          <span>{language === 'en' ? '5 - Excellent' : '٥ - ممتاز'}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default MoodChart;
