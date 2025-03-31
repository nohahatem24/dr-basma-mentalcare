
import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, RefreshCw } from 'lucide-react';
import { useLanguage } from '@/components/Header';

interface BreathingControlsProps {
  isActive: boolean;
  onToggle: () => void;
  onReset: () => void;
}

export const BreathingControls = ({ isActive, onToggle, onReset }: BreathingControlsProps) => {
  const { language } = useLanguage();
  
  return (
    <div className="flex gap-3 mb-6">
      <Button 
        onClick={onToggle} 
        size="lg"
        className={isActive ? 'bg-amber-500 hover:bg-amber-600' : 'bg-emerald-500 hover:bg-emerald-600'}
      >
        {isActive 
          ? <><Pause className={`${language === 'ar' ? 'ml-2' : 'mr-2'} h-4 w-4`} /> {language === 'en' ? 'Pause' : 'توقف'}</>
          : <><Play className={`${language === 'ar' ? 'ml-2' : 'mr-2'} h-4 w-4`} /> {language === 'en' ? 'Start' : 'ابدأ'}</>
        }
      </Button>
      <Button onClick={onReset} variant="outline" size="lg">
        <RefreshCw className={`${language === 'ar' ? 'ml-2' : 'mr-2'} h-4 w-4`} />
        {language === 'en' ? 'Reset' : 'إعادة تعيين'}
      </Button>
    </div>
  );
};
