
import React from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/components/Header';

interface MindfulnessExerciseTabProps {
  onComplete: () => void;
}

const MindfulnessExerciseTab = ({ onComplete }: MindfulnessExerciseTabProps) => {
  const { language } = useLanguage();
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">
        {language === 'en' ? 'Breathing Exercise (5-5-5)' : 'تمرين التنفس (٥-٥-٥)'}
      </h3>
      
      <div className="bg-accent/10 p-6 rounded-lg flex flex-col items-center">
        <div className="text-center mb-6">
          <p className="text-xl mb-2">
            {language === 'en' ? 'Breathe in' : 'استنشق'}
          </p>
          <div className="text-4xl font-bold text-primary">5</div>
          <p className="text-sm text-muted-foreground">
            {language === 'en' ? 'seconds' : 'ثوان'}
          </p>
        </div>
        
        <div className="text-center mb-6">
          <p className="text-xl mb-2">
            {language === 'en' ? 'Hold' : 'امسك'}
          </p>
          <div className="text-4xl font-bold text-primary">5</div>
          <p className="text-sm text-muted-foreground">
            {language === 'en' ? 'seconds' : 'ثوان'}
          </p>
        </div>
        
        <div className="text-center">
          <p className="text-xl mb-2">
            {language === 'en' ? 'Breathe out' : 'ازفر'}
          </p>
          <div className="text-4xl font-bold text-primary">5</div>
          <p className="text-sm text-muted-foreground">
            {language === 'en' ? 'seconds' : 'ثوان'}
          </p>
        </div>
      </div>
      
      <p className="text-sm text-muted-foreground">
        {language === 'en'
          ? 'Practice this breathing exercise for 5 minutes. It helps reduce anxiety and improve focus.'
          : 'مارس تمرين التنفس هذا لمدة ٥ دقائق. يساعد على تقليل القلق وتحسين التركيز.'}
      </p>
      
      <Button onClick={onComplete} className="w-full">
        {language === 'en' ? 'Start Guided Breathing' : 'ابدأ التنفس الموجه'}
      </Button>
    </div>
  );
};

export default MindfulnessExerciseTab;
