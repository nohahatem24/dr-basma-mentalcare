
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/components/Header';
import { Target, Plus, CheckCircle, Calendar } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { Goal } from '@/types/mindtrack';
import GoalForm from './GoalsForm';

const Goals = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const { session } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingGoal, setIsAddingGoal] = useState(false);

  useEffect(() => {
    const fetchGoals = async () => {
      if (!session?.user) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('goals')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Convert database data to Goal type with proper type validation
        if (data) {
          const typedGoals: Goal[] = data.map(goal => ({
            ...goal,
            // Ensure status is one of the allowed values
            status: (goal.status === 'active' || goal.status === 'completed' || goal.status === 'abandoned') 
              ? goal.status as 'active' | 'completed' | 'abandoned'
              : 'active' // Default to active if invalid status
          }));
          
          setGoals(typedGoals);
        }
      } catch (error) {
        console.error('Error fetching goals:', error);
        toast({
          title: language === 'en' ? 'Error' : 'خطأ',
          description: language === 'en' ? 'Failed to load your goals' : 'فشل في تحميل أهدافك',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchGoals();
  }, [session?.user, language, toast]);

  const handleAddGoalSuccess = () => {
    setIsAddingGoal(false);
    // Refresh goals list
    if (session?.user) {
      supabase
        .from('goals')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .then(({ data, error }) => {
          if (error) {
            console.error('Error fetching updated goals:', error);
            return;
          }
          
          if (data) {
            const typedGoals: Goal[] = data.map(goal => ({
              ...goal,
              // Ensure status is one of the allowed values
              status: (goal.status === 'active' || goal.status === 'completed' || goal.status === 'abandoned') 
                ? goal.status as 'active' | 'completed' | 'abandoned'
                : 'active' // Default to active if invalid status
            }));
            
            setGoals(typedGoals);
          }
        });
    }
  };

  const handleUpdateGoalStatus = async (goalId: string, newStatus: 'active' | 'completed' | 'abandoned') => {
    try {
      const { error } = await supabase
        .from('goals')
        .update({ 
          status: newStatus,
          progress: newStatus === 'completed' ? 100 : (newStatus === 'abandoned' ? 0 : 50)
        })
        .eq('id', goalId);
        
      if (error) throw error;
      
      // Update local state
      setGoals(
        goals.map(goal => 
          goal.id === goalId 
            ? { 
                ...goal, 
                status: newStatus,
                progress: newStatus === 'completed' ? 100 : (newStatus === 'abandoned' ? 0 : goal.progress)
              } 
            : goal
        )
      );
      
      toast({
        title: language === 'en' ? 'Goal Updated' : 'تم تحديث الهدف',
        description: language === 'en' ? 'Your goal status was updated' : 'تم تحديث حالة هدفك',
      });
    } catch (error) {
      console.error('Error updating goal:', error);
      toast({
        title: language === 'en' ? 'Error' : 'خطأ',
        description: language === 'en' ? 'Failed to update goal status' : 'فشل في تحديث حالة الهدف',
        variant: 'destructive',
      });
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(language === 'en' ? 'en-US' : 'ar-EG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          {language === 'en' ? 'Goals Tracker' : 'متتبع الأهداف'}
        </CardTitle>
        <CardDescription>
          {language === 'en'
            ? 'Set and track your therapy and personal growth goals'
            : 'ضع وتتبع أهداف العلاج والنمو الشخصي الخاصة بك'}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {isAddingGoal ? (
          <GoalForm 
            onSuccess={handleAddGoalSuccess} 
            onCancel={() => setIsAddingGoal(false)}
          />
        ) : (
          <Button 
            onClick={() => setIsAddingGoal(true)}
            className="w-full flex items-center justify-center gap-2"
          >
            <Plus size={16} />
            {language === 'en' ? 'Add New Goal' : 'إضافة هدف جديد'}
          </Button>
        )}
        
        {isLoading ? (
          <div className="py-8 text-center text-muted-foreground">
            {language === 'en' ? 'Loading goals...' : 'جاري تحميل الأهداف...'}
          </div>
        ) : goals.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            {language === 'en' 
              ? 'No goals added yet. Add your first goal to start tracking your progress!' 
              : 'لم تتم إضافة أهداف حتى الآن. أضف هدفك الأول لبدء تتبع تقدمك!'}
          </div>
        ) : (
          <div className="space-y-4">
            {goals.map(goal => (
              <Card key={goal.id} className={`border-l-4 ${
                goal.status === 'completed' 
                  ? 'border-l-green-500' 
                  : goal.status === 'abandoned' 
                    ? 'border-l-gray-400' 
                    : 'border-l-blue-500'
              }`}>
                <CardContent className="p-4">
                  <div className="flex flex-col space-y-2">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium text-lg">{goal.title}</h3>
                      <div className={`px-2 py-1 rounded-full text-xs 
                        ${goal.status === 'completed' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                          : goal.status === 'abandoned' 
                            ? 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200' 
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        }`}
                      >
                        {language === 'en' 
                          ? goal.status.charAt(0).toUpperCase() + goal.status.slice(1) 
                          : goal.status === 'active' 
                            ? 'نشط' 
                            : goal.status === 'completed' 
                              ? 'مكتمل' 
                              : 'متروك'
                        }
                      </div>
                    </div>
                    
                    {goal.description && (
                      <p className="text-sm text-muted-foreground">{goal.description}</p>
                    )}
                    
                    {goal.target_date && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar size={12} />
                        <span>
                          {language === 'en' ? 'Target: ' : 'الهدف: '}
                          {formatDate(goal.target_date)}
                        </span>
                      </div>
                    )}
                    
                    {/* Progress bar */}
                    <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                      <div 
                        className={`h-2 rounded-full ${
                          goal.status === 'completed' 
                            ? 'bg-green-500' 
                            : goal.status === 'abandoned' 
                              ? 'bg-gray-400' 
                              : 'bg-blue-500'
                        }`}
                        style={{ width: `${goal.progress}%` }}
                      ></div>
                    </div>
                    
                    {/* Status change buttons */}
                    {goal.status !== 'completed' && (
                      <div className="flex justify-end gap-2 mt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs"
                          onClick={() => handleUpdateGoalStatus(goal.id, 'completed')}
                        >
                          <CheckCircle size={14} className="mr-1" />
                          {language === 'en' ? 'Mark as Completed' : 'وضع علامة كمكتمل'}
                        </Button>
                        
                        {goal.status !== 'abandoned' && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs text-gray-500 border-gray-300"
                            onClick={() => handleUpdateGoalStatus(goal.id, 'abandoned')}
                          >
                            {language === 'en' ? 'Abandon' : 'مهجور'}
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
      
      <CardFooter>
        <div className="w-full text-xs text-muted-foreground text-center">
          {language === 'en'
            ? 'Tip: Setting SMART goals (Specific, Measurable, Achievable, Relevant, Time-bound) increases your chance of success.'
            : 'نصيحة: تحديد أهداف SMART (محددة، قابلة للقياس، قابلة للتحقيق، ذات صلة، محددة بوقت) يزيد من فرصة نجاحك.'}
        </div>
      </CardFooter>
    </Card>
  );
};

export default Goals;
