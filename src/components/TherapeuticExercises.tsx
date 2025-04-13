import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// Import our component modules
import TherapeuticExercisesCard from './therapeutic/TherapeuticExercisesCard';
import CBTExerciseTab from './therapeutic/CBTExerciseTab';
import DBTExerciseTab from './therapeutic/DBTExerciseTab';
import ACTExerciseTab from './therapeutic/ACTExerciseTab';
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
    <div className="container py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">
          {language === 'en' ? 'Therapeutic Exercises' : 'التمارين العلاجية'}
        </h1>
        <p className="text-muted-foreground">
          {language === 'en' 
            ? 'Evidence-based techniques from CBT, DBT, and ACT to improve your mental well-being'
            : 'تقنيات قائمة على الأدلة من CBT و DBT و ACT لتحسين صحتك النفسية'}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {language === 'en' ? 'Choose Your Practice' : 'اختر تمرينك'}
          </CardTitle>
          <CardDescription>
            {language === 'en'
              ? 'Select a therapeutic approach that resonates with your needs'
              : 'اختر النهج العلاجي الذي يتناسب مع احتياجاتك'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="cbt" className="w-full">
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="cbt">
                {language === 'en' ? 'CBT' : 'العلاج المعرفي السلوكي'}
              </TabsTrigger>
              <TabsTrigger value="dbt">
                {language === 'en' ? 'DBT' : 'العلاج السلوكي الجدلي'}
              </TabsTrigger>
              <TabsTrigger value="act">
                {language === 'en' ? 'ACT' : 'العلاج بالقبول والالتزام'}
              </TabsTrigger>
              <TabsTrigger value="mindfulness">
                {language === 'en' ? 'Mindfulness' : 'اليقظة الذهنية'}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="cbt" className="space-y-4">
              <CBTExerciseTab onComplete={handleCompleteExercise} />
            </TabsContent>

            <TabsContent value="dbt" className="space-y-4">
              <DBTExerciseTab onComplete={handleCompleteExercise} />
            </TabsContent>

            <TabsContent value="act" className="space-y-4">
              <ACTExerciseTab onComplete={handleCompleteExercise} />
            </TabsContent>

            <TabsContent value="mindfulness" className="space-y-4">
              <MindfulnessExerciseTab onComplete={handleCompleteExercise} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default TherapeuticExercises;
