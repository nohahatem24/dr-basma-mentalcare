
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/components/Header';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/lib/supabase';
import DBTExerciseTab from './therapeutic/DBTExerciseTab';
import ACTExerciseTab from './therapeutic/ACTExerciseTab';
import MindfulnessExerciseTab from './therapeutic/MindfulnessExerciseTab';

interface ExerciseLog {
  id: string;
  user_id: string;
  exercise_type: 'dbt' | 'act' | 'mindfulness';
  exercise_id: string;
  completed_at: string;
  notes: string;
}

const TherapeuticExercises = () => {
  const { language } = useLanguage();
  const { session } = useAuth();
  const [activeTab, setActiveTab] = useState('dbt');

  const handleExerciseComplete = async (exerciseType: 'dbt' | 'act' | 'mindfulness', exerciseId: string, notes: string) => {
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
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>
          {language === 'en' ? 'Therapeutic Exercises' : 'التمارين العلاجية'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="dbt">
              {language === 'en' ? 'DBT Exercises' : 'تمارين DBT'}
            </TabsTrigger>
            <TabsTrigger value="act">
              {language === 'en' ? 'ACT Exercises' : 'تمارين ACT'}
            </TabsTrigger>
            <TabsTrigger value="mindfulness">
              {language === 'en' ? 'Mindfulness' : 'اليقظة الذهنية'}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="dbt">
            <DBTExerciseTab onComplete={(exerciseId, notes) => 
              handleExerciseComplete('dbt', exerciseId, notes)
            } />
          </TabsContent>
          <TabsContent value="act">
            <ACTExerciseTab onComplete={(exerciseId, notes) => 
              handleExerciseComplete('act', exerciseId, notes)
            } />
          </TabsContent>
          <TabsContent value="mindfulness">
            <MindfulnessExerciseTab onComplete={(exerciseId, notes) => 
              handleExerciseComplete('mindfulness', exerciseId, notes)
            } />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TherapeuticExercises;
