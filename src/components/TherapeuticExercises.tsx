
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/components/Header';
import { BookOpen } from 'lucide-react';
import CBTExerciseTab from './therapeutic/CBTExerciseTab';
import MindfulnessExerciseTab from './therapeutic/MindfulnessExerciseTab';
import ACTExerciseTab from './therapeutic/ACTExerciseTab';
import DBTExerciseTab from './therapeutic/DBTExerciseTab';
import PositivePsychologyTab from './therapeutic/PositivePsychologyTab';
import { useAuth } from './auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';

const TherapeuticExercises = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const { session } = useAuth();
  const [activeTab, setActiveTab] = useState('mindfulness');

  // Handler for completing exercises, modified to match the expected signature in tabs
  const handleExerciseComplete = (exerciseId: string, notes?: string) => {
    if (!session?.user) {
      toast({
        title: language === 'en' ? 'Sign in required' : 'تسجيل الدخول مطلوب',
        description: language === 'en' 
          ? 'Please sign in to save your progress' 
          : 'يرجى تسجيل الدخول لحفظ تقدمك',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      // Log completion in database
      const exerciseLog = {
        user_id: session.user.id,
        exercise_id: exerciseId,
        exercise_type: activeTab,
        notes: notes || '',
        completed_at: new Date().toISOString(),
      };
      
      // Save to Supabase - fixed table name to therapeutic_exercises_logs (plural)
      supabase.from('therapeutic_exercises_logs').insert(exerciseLog).then(({ error }) => {
        if (error) {
          console.error('Error logging exercise:', error);
          toast({
            title: language === 'en' ? 'Error' : 'خطأ',
            description: language === 'en' 
              ? 'Failed to save exercise completion' 
              : 'فشل في حفظ إكمال التمرين',
            variant: 'destructive',
          });
          return;
        }
        
        toast({
          title: language === 'en' ? 'Exercise Completed' : 'اكتمل التمرين',
          description: language === 'en'
            ? 'Your progress has been saved'
            : 'تم حفظ تقدمك',
        });
      });
    } catch (error) {
      console.error('Exercise completion error:', error);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className={language === 'ar' ? 'text-right' : ''}>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          {language === 'en' ? 'Therapeutic Exercises' : 'تمارين علاجية'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full mb-4">
            <TabsTrigger value="mindfulness">
              {language === 'en' ? 'Mindfulness' : 'اليقظة الذهنية'}
            </TabsTrigger>
            <TabsTrigger value="cbt">
              {language === 'en' ? 'CBT' : 'العلاج المعرفي'}
            </TabsTrigger>
            <TabsTrigger value="act">
              {language === 'en' ? 'ACT' : 'العلاج بالقبول'}
            </TabsTrigger>
            <TabsTrigger value="dbt">
              {language === 'en' ? 'DBT' : 'العلاج الجدلي'}
            </TabsTrigger>
            <TabsTrigger value="positive">
              {language === 'en' ? 'Positive Psychology' : 'علم النفس الإيجابي'}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="mindfulness" className="mt-0">
            <MindfulnessExerciseTab onComplete={handleExerciseComplete} />
          </TabsContent>
          
          <TabsContent value="cbt" className="mt-0">
            <CBTExerciseTab onComplete={handleExerciseComplete} />
          </TabsContent>
          
          <TabsContent value="act" className="mt-0">
            <ACTExerciseTab onComplete={handleExerciseComplete} />
          </TabsContent>
          
          <TabsContent value="dbt" className="mt-0">
            <DBTExerciseTab onComplete={handleExerciseComplete} />
          </TabsContent>
          
          <TabsContent value="positive" className="mt-0">
            <PositivePsychologyTab onComplete={handleExerciseComplete} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TherapeuticExercises;
