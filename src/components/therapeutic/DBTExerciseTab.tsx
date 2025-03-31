
import React from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/components/Header';

interface DBTExerciseTabProps {
  onComplete: () => void;
}

const DBTExerciseTab = ({ onComplete }: DBTExerciseTabProps) => {
  const { language } = useLanguage();
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">
        {language === 'en' ? 'Emotion Regulation Exercise' : 'تمرين تنظيم العواطف'}
      </h3>
      
      <div className="bg-accent/10 p-4 rounded-lg">
        <p className="text-sm mb-4">
          {language === 'en'
            ? 'This exercise helps you identify and regulate your emotions in difficult situations. Follow the steps below:'
            : 'يساعدك هذا التمرين على تحديد وتنظيم عواطفك في المواقف الصعبة. اتبع الخطوات أدناه:'}
        </p>
        
        <ol className="space-y-4 list-decimal list-inside">
          <li>
            {language === 'en'
              ? 'Identify the emotion you are feeling'
              : 'حدد العاطفة التي تشعر بها'}
          </li>
          <li>
            {language === 'en'
              ? 'Rate the intensity from 1-10'
              : 'قيم شدتها من ١-١٠'}
          </li>
          <li>
            {language === 'en'
              ? 'Identify the triggers of this emotion'
              : 'حدد محفزات هذه العاطفة'}
          </li>
          <li>
            {language === 'en'
              ? 'Apply opposite action: do the opposite of what the emotion urges you to do'
              : 'طبق الإجراء المعاكس: افعل عكس ما تحثك العاطفة على فعله'}
          </li>
          <li>
            {language === 'en'
              ? 'Practice self-soothing techniques'
              : 'مارس تقنيات تهدئة الذات'}
          </li>
        </ol>
      </div>
      
      <Button onClick={onComplete} className="w-full">
        {language === 'en' ? 'Start Exercise' : 'ابدأ التمرين'}
      </Button>
    </div>
  );
};

export default DBTExerciseTab;
