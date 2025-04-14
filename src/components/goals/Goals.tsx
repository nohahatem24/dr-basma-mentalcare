import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/auth/AuthProvider';
import { Goal } from '@/types/mindtrack';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/components/Header';

const Goals = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const { session } = useAuth();
  const { toast } = useToast();
  const { language } = useLanguage();

  useEffect(() => {
    const fetchGoals = async () => {
      if (!session?.user?.id) return;
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('goals')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        if (data) {
          // Type cast the data to ensure status is of the correct type
          const typedGoals: Goal[] = data.map(goal => ({
            ...goal,
            status: (goal.status as 'active' | 'completed' | 'abandoned') || 'active'
          }));
          setGoals(typedGoals);
        }
      } catch (error) {
        console.error('Error fetching goals:', error);
        toast({
          title: language === 'en' ? 'Error' : 'خطأ',
          description: language === 'en' ? 'Failed to load goals' : 'فشل في تحميل الأهداف',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchGoals();
  }, [session, toast, language]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {language === 'en' ? 'My Goals' : 'أهدافي'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p>{language === 'en' ? 'Loading goals...' : 'جاري تحميل الأهداف...'}</p>
        ) : goals.length > 0 ? (
          goals.map((goal) => (
            <div key={goal.id} className="mb-4">
              <h3 className="text-lg font-semibold">{goal.title}</h3>
              <p className="text-sm text-muted-foreground">{goal.description}</p>
              <div className="mt-2">
                <Progress value={goal.progress || 0} />
                <p className="text-xs text-muted-foreground">
                  {language === 'en' ? 'Progress:' : 'التقدم:'} {goal.progress}%
                </p>
              </div>
            </div>
          ))
        ) : (
          <p>{language === 'en' ? 'No goals set yet.' : 'لم يتم تعيين أهداف بعد.'}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default Goals;
