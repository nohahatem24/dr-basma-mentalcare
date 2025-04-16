
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/components/Header';
import { useAuth } from '@/components/auth/AuthProvider';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Target, PlusCircle, Calendar, Edit, Trash2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import GoalsForm from './GoalsForm';

interface Goal {
  id: string;
  title: string;
  description?: string;
  target_date?: string;
  progress: number;
  status: 'active' | 'completed' | 'abandoned';
}

const Goals = () => {
  const { language } = useLanguage();
  const { session } = useAuth();
  const { toast } = useToast();
  
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  const fetchGoals = async () => {
    if (!session.user) return;
    
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      setGoals(data || []);
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
  
  useEffect(() => {
    fetchGoals();
  }, [session.user]);
  
  const updateGoalProgress = async (goalId: string, newProgress: number) => {
    if (!session.user) return;
    
    try {
      const { error } = await supabase
        .from('goals')
        .update({ progress: newProgress })
        .eq('id', goalId);
        
      if (error) throw error;
      
      // Update local state
      setGoals(goals.map(goal => 
        goal.id === goalId ? { ...goal, progress: newProgress } : goal
      ));
      
      // If progress is 100%, update status to completed
      if (newProgress === 100) {
        await supabase
          .from('goals')
          .update({ status: 'completed' })
          .eq('id', goalId);
          
        setGoals(goals.map(goal => 
          goal.id === goalId ? { ...goal, status: 'completed' } : goal
        ));
      }
      
      toast({
        title: language === 'en' ? 'Progress Updated' : 'تم تحديث التقدم',
        description: language === 'en' ? 'Goal progress has been updated' : 'تم تحديث تقدم الهدف',
      });
    } catch (error) {
      console.error('Error updating goal progress:', error);
      toast({
        title: language === 'en' ? 'Error' : 'خطأ',
        description: language === 'en' ? 'Failed to update progress' : 'فشل في تحديث التقدم',
        variant: 'destructive',
      });
    }
  };
  
  const deleteGoal = async (goalId: string) => {
    if (!session.user) return;
    
    if (!confirm(language === 'en' ? 'Are you sure you want to delete this goal?' : 'هل أنت متأكد أنك تريد حذف هذا الهدف؟')) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('goals')
        .delete()
        .eq('id', goalId);
        
      if (error) throw error;
      
      // Update local state
      setGoals(goals.filter(goal => goal.id !== goalId));
      
      toast({
        title: language === 'en' ? 'Goal Deleted' : 'تم حذف الهدف',
        description: language === 'en' ? 'Your goal has been deleted' : 'تم حذف هدفك',
      });
    } catch (error) {
      console.error('Error deleting goal:', error);
      toast({
        title: language === 'en' ? 'Error' : 'خطأ',
        description: language === 'en' ? 'Failed to delete the goal' : 'فشل في حذف الهدف',
        variant: 'destructive',
      });
    }
  };
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    
    return new Intl.DateTimeFormat(
      language === 'en' ? 'en-US' : 'ar-SA',
      { year: 'numeric', month: 'short', day: 'numeric' }
    ).format(new Date(dateString));
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            {language === 'en' ? 'Goals Tracker' : 'متتبع الأهداف'}
          </CardTitle>
          <Button 
            size="sm" 
            onClick={() => setShowForm(true)}
            className="gap-1"
          >
            <PlusCircle className="h-4 w-4" />
            {language === 'en' ? 'Add Goal' : 'إضافة هدف'}
          </Button>
        </div>
        <CardDescription>
          {language === 'en'
            ? 'Set and track your personal growth goals'
            : 'حدد وتتبع أهداف نموك الشخصي'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {showForm ? (
          <GoalsForm 
            onSuccess={() => {
              setShowForm(false);
              fetchGoals();
            }}
            onCancel={() => setShowForm(false)}
          />
        ) : (
          <>
            {isLoading ? (
              <div className="flex justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : goals.length === 0 ? (
              <div className="text-center py-12 px-4">
                <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Target className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">
                  {language === 'en' ? 'No Goals Yet' : 'لا توجد أهداف بعد'}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {language === 'en'
                    ? 'Set goals to track your personal development journey'
                    : 'حدد أهدافًا لتتبع رحلة تطورك الشخصي'}
                </p>
                <Button onClick={() => setShowForm(true)}>
                  {language === 'en' ? 'Create Your First Goal' : 'أنشئ هدفك الأول'}
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {goals.map((goal) => (
                  <div 
                    key={goal.id} 
                    className={`border rounded-lg p-4 ${
                      goal.status === 'completed' ? 'bg-green-50 border-green-200' : 'bg-card'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          {goal.status === 'completed' && (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          )}
                          <h3 className="font-medium text-lg">{goal.title}</h3>
                        </div>
                        {goal.description && (
                          <p className="text-muted-foreground text-sm mt-1">{goal.description}</p>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          onClick={() => deleteGoal(goal.id)}
                          className="h-8 w-8"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </div>
                    
                    {goal.target_date && (
                      <div className="flex items-center text-xs text-muted-foreground mb-2">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span>
                          {language === 'en' ? 'Target: ' : 'الهدف: '}
                          {formatDate(goal.target_date)}
                        </span>
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span>
                          {language === 'en' ? 'Progress' : 'التقدم'}
                        </span>
                        <span>
                          {goal.progress}%
                        </span>
                      </div>
                      <Progress value={goal.progress} className="h-2" />
                    </div>
                    
                    {goal.status !== 'completed' && (
                      <div className="grid grid-cols-5 gap-1 mt-4">
                        {[0, 25, 50, 75, 100].map(value => (
                          <Button
                            key={value}
                            size="sm"
                            variant={goal.progress === value ? "default" : "outline"}
                            onClick={() => updateGoalProgress(goal.id, value)}
                            className="h-8"
                          >
                            {value}%
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default Goals;
