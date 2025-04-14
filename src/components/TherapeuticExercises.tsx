import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/components/Header';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/lib/supabase';
import DBTExerciseTab from './therapeutic/DBTExerciseTab';
import ACTExerciseTab from './therapeutic/ACTExerciseTab';
import CBTExerciseTab from './therapeutic/CBTExerciseTab';
import PositivePsychologyTab from './therapeutic/PositivePsychologyTab';

interface ExerciseLog {
  id: string;
  user_id: string;
  exercise_type: 'dbt' | 'act' | 'cbt' | 'positive';
  exercise_id: string;
  completed_at: string;
  notes: string;
}

const TherapeuticExercises = () => {
  const { language } = useLanguage();
  const { session } = useAuth();
  const [activeTab, setActiveTab] = useState('cbt');
  const [error, setError] = useState<string | null>(null);

  const handleExerciseComplete = async (exerciseType: 'dbt' | 'act' | 'cbt' | 'positive', exerciseId: string, notes: string) => {
    if (!session?.user?.id) return;

    try {
      const { error } = await supabase
        .from('therapeutic_exercises_logs')
        .insert({
          user_id: session.user.id,
          exercise_type: exerciseType,
          exercise_id: exerciseId,
          completed_at: new Date().toISOString(),
          notes
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error saving exercise log:', error);
      setError(language === 'en' 
        ? 'Failed to save exercise log. Please try again.' 
        : 'فشل في حفظ سجل التمرين. يرجى المحاولة مرة أخرى.');
    }
  };

  if (error) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-destructive">
            {language === 'en' ? 'Error' : 'خطأ'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>
          {language === 'en' ? 'Therapeutic Exercises' : 'التمارين العلاجية'}
        </CardTitle>
        <CardDescription>
          {language === 'en' 
            ? 'Evidence-based therapeutic approaches for mental well-being'
            : 'أساليب علاجية مبنية على الأدلة للصحة النفسية'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="cbt">
              {language === 'en' ? 'CBT' : 'العلاج المعرفي السلوكي'}
            </TabsTrigger>
            <TabsTrigger value="dbt">
              {language === 'en' ? 'DBT' : 'العلاج السلوكي الجدلي'}
            </TabsTrigger>
            <TabsTrigger value="act">
              {language === 'en' ? 'ACT' : 'العلاج بالقبول والالتزام'}
            </TabsTrigger>
            <TabsTrigger value="positive">
              {language === 'en' ? 'Positive Psychology' : 'علم النفس الإيجابي'}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="cbt">
            <CBTExerciseTab onComplete={(exerciseId, notes) => {
              handleExerciseComplete('cbt', exerciseId, notes);
            }} />
          </TabsContent>
          <TabsContent value="dbt">
            <DBTExerciseTab onComplete={(exerciseId, notes) => {
              handleExerciseComplete('dbt', exerciseId, notes);
            }} />
          </TabsContent>
          <TabsContent value="act">
            <ACTExerciseTab onComplete={(exerciseId, notes) => {
              handleExerciseComplete('act', exerciseId, notes);
            }} />
          </TabsContent>
          <TabsContent value="positive">
            <PositivePsychologyTab onComplete={(exerciseId, notes) => {
              handleExerciseComplete('positive', exerciseId, notes);
            }} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TherapeuticExercises;
