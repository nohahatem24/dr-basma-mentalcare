
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';

// Import our component modules
import TherapeuticExercisesCard from './therapeutic/TherapeuticExercisesCard';
import CBTExerciseTab from './therapeutic/CBTExerciseTab';
import DBTExerciseTab from './therapeutic/DBTExerciseTab';
import ACTExerciseTab from './therapeutic/ACTExerciseTab';
import MindfulnessExerciseTab from './therapeutic/MindfulnessExerciseTab';

// Create a custom type for exercise logging
interface TherapeuticExerciseLog {
  user_id: string;
  exercise_type: string;
  notes?: string;
}

const TherapeuticExercises = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const { session } = useAuth();
  const [exerciseCompleted, setExerciseCompleted] = useState(false);

  const handleCompleteExercise = async (exerciseType: string, notes?: string) => {
    if (!session?.user) {
      toast({
        title: language === 'en' ? 'Authentication Required' : 'مطلوب المصادقة',
        description: language === 'en' ? 'Please sign in to save your progress.' : 'الرجاء تسجيل الدخول لحفظ تقدمك.',
        variant: 'destructive'
      });
      return;
    }

    try {
      // Save exercise completion to database
      const { error } = await supabase
        .from('therapeutic_exercises_logs')
        .insert({
          user_id: session.user.id,
          exercise_type: exerciseType,
          notes: notes || '',
        });

      if (error) {
        console.error("Error logging exercise:", error);
        throw error;
      }
      
      setExerciseCompleted(true);
      toast({
        title: language === 'en' ? 'Exercise Completed' : 'تم إكمال التمرين',
        description: language === 'en' ? 'Great job! Your progress has been saved.' : 'عمل رائع! تم حفظ تقدمك.',
      });
    } catch (error) {
      console.error("Error saving exercise completion:", error);
      toast({
        title: language === 'en' ? 'Error' : 'خطأ',
        description: language === 'en' ? 'Failed to save your progress.' : 'فشل في حفظ تقدمك.',
        variant: 'destructive'
      });
    }
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
          <Tabs defaultValue="mindfulness" className="w-full">
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
              <CBTExerciseTab onComplete={(notes) => handleCompleteExercise('cbt', notes)} />
            </TabsContent>

            <TabsContent value="dbt" className="space-y-4">
              <DBTExerciseTab onComplete={(notes) => handleCompleteExercise('dbt', notes)} />
            </TabsContent>

            <TabsContent value="act" className="space-y-4">
              <ACTExerciseTab onComplete={(notes) => handleCompleteExercise('act', notes)} />
            </TabsContent>

            <TabsContent value="mindfulness" className="space-y-4">
              <MindfulnessExerciseTab onComplete={(notes) => handleCompleteExercise('mindfulness', notes)} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default TherapeuticExercises;
