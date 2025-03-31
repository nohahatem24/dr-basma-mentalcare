
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/components/Header';

interface CustomSettingsProps {
  settings: {
    inhale: number;
    hold1: number;
    exhale: number;
    hold2: number;
  };
  onSettingsChange: (settings: { inhale: number; hold1: number; exhale: number; hold2: number }) => void;
}

export const CustomSettings = ({ settings, onSettingsChange }: CustomSettingsProps) => {
  const { language } = useLanguage();
  
  return (
    <div className="space-y-3">
      <h3 className={`text-sm font-medium ${language === 'ar' ? 'text-right' : ''}`}>
        {language === 'en' ? 'Custom Settings (seconds)' : 'الإعدادات المخصصة (ثواني)'}
      </h3>
      
      <div className="space-y-2">
        <Label className={language === 'ar' ? 'text-right block' : ''}>
          {language === 'en' ? 'Inhale' : 'استنشاق'} ({settings.inhale}s)
        </Label>
        <Slider
          value={[settings.inhale]}
          min={1}
          max={10}
          step={1}
          onValueChange={(value) => onSettingsChange({...settings, inhale: value[0]})}
        />
      </div>
      
      <div className="space-y-2">
        <Label className={language === 'ar' ? 'text-right block' : ''}>
          {language === 'en' ? 'Hold After Inhale' : 'احبس بعد الاستنشاق'} ({settings.hold1}s)
        </Label>
        <Slider
          value={[settings.hold1]}
          min={0}
          max={10}
          step={1}
          onValueChange={(value) => onSettingsChange({...settings, hold1: value[0]})}
        />
      </div>
      
      <div className="space-y-2">
        <Label className={language === 'ar' ? 'text-right block' : ''}>
          {language === 'en' ? 'Exhale' : 'زفير'} ({settings.exhale}s)
        </Label>
        <Slider
          value={[settings.exhale]}
          min={1}
          max={10}
          step={1}
          onValueChange={(value) => onSettingsChange({...settings, exhale: value[0]})}
        />
      </div>
      
      <div className="space-y-2">
        <Label className={language === 'ar' ? 'text-right block' : ''}>
          {language === 'en' ? 'Hold After Exhale' : 'احبس بعد الزفير'} ({settings.hold2}s)
        </Label>
        <Slider
          value={[settings.hold2]}
          min={0}
          max={10}
          step={1}
          onValueChange={(value) => onSettingsChange({...settings, hold2: value[0]})}
        />
      </div>
    </div>
  );
};
