
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/components/Header';

// Import our new component modules
import TherapeuticExercisesCard from './therapeutic/TherapeuticExercisesCard';
import CBTExerciseTab from './therapeutic/CBTExerciseTab';
import DBTExerciseTab from './therapeutic/DBTExerciseTab';
import MindfulnessExerciseTab from './therapeutic/MindfulnessExerciseTab';

const TherapeuticExercises = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [exerciseCompleted, setExerciseCompleted] = useState(false);

  const handleCompleteExercise = () => {
    setExerciseCompleted(true);
    toast({
      title: language === 'en' ? 'Exercise Completed' : 'تم إكمال التمرين',
      description: language === 'en' ? 'Great job! Your progress has been saved.' : 'عمل رائع! تم حفظ تقدمك.',
    });
  };

  return (
    <TherapeuticExercisesCard>
      <Tabs defaultValue="cbt" className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="cbt">
            {language === 'en' ? 'CBT Techniques' : 'تقنيات CBT'}
          </TabsTrigger>
          <TabsTrigger value="dbt">
            {language === 'en' ? 'DBT Techniques' : 'تقنيات DBT'}
          </TabsTrigger>
          <TabsTrigger value="mindfulness">
            {language === 'en' ? 'Mindfulness' : 'اليقظة الذهنية'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="cbt" className="space-y-4">
          <CBTExerciseTab />
        </TabsContent>

        <TabsContent value="dbt" className="space-y-4">
          <DBTExerciseTab onComplete={handleCompleteExercise} />
        </TabsContent>

        <TabsContent value="mindfulness" className="space-y-4">
          <MindfulnessExerciseTab onComplete={handleCompleteExercise} />
        </TabsContent>
      </Tabs>
    </TherapeuticExercisesCard>
  );
};

export default TherapeuticExercises;
