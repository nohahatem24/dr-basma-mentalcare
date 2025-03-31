
import React from 'react';
import { Clock, BarChart } from 'lucide-react';
import { useLanguage } from '@/components/Header';

interface BreathingStatsProps {
  totalDuration: number;
  completedCycles: number;
}

export const BreathingStats = ({ totalDuration, completedCycles }: BreathingStatsProps) => {
  const { language } = useLanguage();
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className={`flex justify-between items-center ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
      <div className={`flex items-center gap-1 text-sm ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
        <Clock className="h-4 w-4 text-muted-foreground" />
        <span>
          {language === 'en' ? 'Total Time: ' : 'الوقت الإجمالي: '}
          {formatTime(totalDuration)}
        </span>
      </div>
      <div className={`flex items-center gap-1 text-sm ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
        <BarChart className="h-4 w-4 text-muted-foreground" />
        <span>
          {language === 'en' ? 'Cycles: ' : 'الدورات: '}
          {completedCycles}
        </span>
      </div>
    </div>
  );
};
