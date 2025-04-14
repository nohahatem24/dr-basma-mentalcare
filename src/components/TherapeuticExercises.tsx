
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/components/Header';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/lib/supabase';
import DBTExerciseTab from './therapeutic/DBTExerciseTab';
import ACTExerciseTab from './therapeutic/ACTExerciseTab';

interface ExerciseLog {
  id: string;
  user_id: string;
  exercise_type: 'dbt' | 'act';
  exercise_id: string;
  completed_at: string;
  notes: string;
}

const TherapeuticExercises = () => {
  const { language } = useLanguage();
  const { session } = useAuth();
  const [activeTab, setActiveTab] = useState('dbt');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
      setError(language === 'en' 
        ? 'Missing Supabase configuration. Please check your environment variables.' 
        : 'إعدادات Supabase مفقودة. يرجى التحقق من المتغيرات البيئية.');
    }
  }, [language]);

  const handleExerciseComplete = async (exerciseType: 'dbt' | 'act', exerciseId: string, notes: string) => {
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
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="dbt">
              {language === 'en' ? 'DBT Exercises' : 'تمارين DBT'}
            </TabsTrigger>
            <TabsTrigger value="act">
              {language === 'en' ? 'ACT Exercises' : 'تمارين ACT'}
            </TabsTrigger>
          </TabsList>
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
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TherapeuticExercises;
