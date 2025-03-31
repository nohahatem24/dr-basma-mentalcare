
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/components/Header';

interface BreathingTechnique {
  name: string;
  inhale: number;
  hold1: number;
  exhale: number;
  hold2: number;
}

interface TechniqueSelectorProps {
  technique: string;
  isCustom: boolean;
  onTechniqueChange: (value: string) => void;
  techniques: Record<string, BreathingTechnique>;
}

export const TechniqueSelector = ({
  technique,
  isCustom,
  onTechniqueChange,
  techniques
}: TechniqueSelectorProps) => {
  const { language } = useLanguage();
  
  return (
    <div className="space-y-2">
      <Label className={language === 'ar' ? 'text-right block' : ''}>
        {language === 'en' ? 'Breathing Technique' : 'تقنية التنفس'}
      </Label>
      <Select 
        value={isCustom ? 'custom' : technique} 
        onValueChange={onTechniqueChange}
      >
        <SelectTrigger>
          <SelectValue placeholder={language === 'en' ? 'Select technique' : 'اختر التقنية'} />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(techniques).map(([key, { name }]) => (
            <SelectItem key={key} value={key}>
              {name}
            </SelectItem>
          ))}
          <SelectItem value="custom">
            {language === 'en' ? 'Custom' : 'مخصص'}
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
