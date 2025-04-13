
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/components/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { CalendarIcon, Plus, Target, Trash, Edit, Check, X } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

interface Goal {
  id: string;
  title: string;
  description: string | null;
  target_date: string | null;
  progress: number;
  status: 'active' | 'completed' | 'abandoned';
}

const GoalsTracker = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const { session } = useAuth();
  
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [editingGoalId, setEditingGoalId] = useState<string | null>(null);
  
  // New goal form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetDate, setTargetDate] = useState<Date | undefined>(undefined);
  const [progress, setProgress] = useState(0);
  
  // Fetch goals on component mount
  useEffect(() => {
    fetchGoals();
  }, [session?.user]);
  
  const fetchGoals = async () => {
    if (!session?.user) return;
    
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
        description: language === 'en' ? 'Failed to fetch goals.' : 'فشل في جلب الأهداف.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const resetForm = () => {
    setTitle('');
    setDescription('');
    setTargetDate(undefined);
    setProgress(0);
    setIsAddingGoal(false);
    setEditingGoalId(null);
  };
  
  const handleAddGoal = async () => {
    if (!session?.user) {
      toast({
        title: language === 'en' ? 'Authentication Required' : 'مطلوب المصادقة',
        description: language === 'en' ? 'Please sign in to add goals.' : 'الرجاء تسجيل الدخول لإضافة أهداف.',
        variant: 'destructive'
      });
      return;
    }
    
    if (!title.trim()) {
      toast({
        title: language === 'en' ? 'Error' : 'خطأ',
        description: language === 'en' ? 'Please provide a goal title.' : 'الرجاء تقديم عنوان الهدف.',
        variant: 'destructive'
      });
      return;
    }
    
    try {
      // If editing an existing goal
      if (editingGoalId) {
        const { error } = await supabase
          .from('goals')
          .update({
            title,
            description: description || null,
            target_date: targetDate ? targetDate.toISOString() : null,
            progress,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingGoalId);
          
        if (error) throw error;
        
        toast({
          title: language === 'en' ? 'Goal Updated' : 'تم تحديث الهدف',
          description: language === 'en' ? 'Your goal has been updated.' : 'تم تحديث هدفك.',
        });
      } else {
        // Adding a new goal
        const { data, error } = await supabase
          .from('goals')
          .insert({
            user_id: session.user.id,
            title,
            description: description || null,
            target_date: targetDate ? targetDate.toISOString() : null,
            progress: 0,
            status: 'active'
          })
          .select();
          
        if (error) throw error;
        
        toast({
          title: language === 'en' ? 'Goal Added' : 'تمت إضافة الهدف',
          description: language === 'en' ? 'Your goal has been added.' : 'تمت إضافة هدفك.',
        });
      }
      
      // Refresh goals list
      await fetchGoals();
      resetForm();
    } catch (error) {
      console.error('Error saving goal:', error);
      toast({
        title: language === 'en' ? 'Error' : 'خطأ',
        description: language === 'en' ? 'Failed to save your goal.' : 'فشل في حفظ هدفك.',
        variant: 'destructive'
      });
    }
  };
  
  const handleEditGoal = (goal: Goal) => {
    setEditingGoalId(goal.id);
    setTitle(goal.title);
    setDescription(goal.description || '');
    setTargetDate(goal.target_date ? new Date(goal.target_date) : undefined);
    setProgress(goal.progress);
    setIsAddingGoal(true);
  };
  
  const handleDeleteGoal = async (id: string) => {
    if (!confirm(language === 'en' ? 'Are you sure you want to delete this goal?' : 'هل أنت متأكد أنك تريد حذف هذا الهدف؟')) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('goals')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      toast({
        title: language === 'en' ? 'Goal Deleted' : 'تم حذف الهدف',
        description: language === 'en' ? 'The goal has been deleted.' : 'تم حذف الهدف.',
      });
      
      await fetchGoals();
    } catch (error) {
      console.error('Error deleting goal:', error);
      toast({
        title: language === 'en' ? 'Error' : 'خطأ',
        description: language === 'en' ? 'Failed to delete the goal.' : 'فشل في حذف الهدف.',
        variant: 'destructive'
      });
    }
  };
  
  const handleUpdateProgress = async (id: string, newProgress: number) => {
    try {
      const { error } = await supabase
        .from('goals')
        .update({
          progress: newProgress,
          updated_at: new Date().toISOString(),
          status: newProgress >= 100 ? 'completed' : 'active'
        })
        .eq('id', id);
        
      if (error) throw error;
      
      // Update local state
      setGoals(prev => prev.map(goal => 
        goal.id === id 
          ? { ...goal, progress: newProgress, status: newProgress >= 100 ? 'completed' : 'active' } 
          : goal
      ));
      
      toast({
        title: language === 'en' ? 'Progress Updated' : 'تم تحديث التقدم',
        description: language === 'en' ? 'Goal progress has been updated.' : 'تم تحديث تقدم الهدف.',
      });
    } catch (error) {
      console.error('Error updating goal progress:', error);
      toast({
        title: language === 'en' ? 'Error' : 'خطأ',
        description: language === 'en' ? 'Failed to update goal progress.' : 'فشل في تحديث تقدم الهدف.',
        variant: 'destructive'
      });
    }
  };
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">
            {language === 'en' ? 'Your Goals' : 'أهدافك'}
          </h2>
          
          {!isAddingGoal && (
            <Button onClick={() => setIsAddingGoal(true)} size="sm">
              <Plus className="mr-2 h-4 w-4" />
              {language === 'en' ? 'Add Goal' : 'إضافة هدف'}
            </Button>
          )}
        </div>
        
        {isAddingGoal ? (
          <div className="space-y-4 mb-6 p-4 border rounded-lg">
            <div className="space-y-2">
              <Label htmlFor="goal-title">
                {language === 'en' ? 'Goal Title' : 'عنوان الهدف'}
              </Label>
              <Input
                id="goal-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={language === 'en' ? 'Enter goal title' : 'أدخل عنوان الهدف'}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="goal-description">
                {language === 'en' ? 'Description' : 'الوصف'}
              </Label>
              <Textarea
                id="goal-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={language === 'en' ? 'Describe your goal' : 'صف هدفك'}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="target-date">
                {language === 'en' ? 'Target Date' : 'تاريخ الهدف'}
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !targetDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {targetDate ? format(targetDate, "PPP") : language === 'en' ? "Select a date" : "حدد تاريخًا"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={targetDate}
                    onSelect={setTargetDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            {editingGoalId && (
              <div className="space-y-2">
                <Label htmlFor="goal-progress">
                  {language === 'en' ? 'Progress' : 'التقدم'} ({progress}%)
                </Label>
                <Input
                  id="goal-progress"
                  type="range"
                  min="0"
                  max="100"
                  value={progress}
                  onChange={(e) => setProgress(parseInt(e.target.value))}
                  className="w-full"
                />
                <Progress value={progress} className="h-2" />
              </div>
            )}
            
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={resetForm}>
                {language === 'en' ? 'Cancel' : 'إلغاء'}
              </Button>
              <Button onClick={handleAddGoal}>
                {editingGoalId
                  ? language === 'en' ? 'Update Goal' : 'تحديث الهدف'
                  : language === 'en' ? 'Save Goal' : 'حفظ الهدف'}
              </Button>
            </div>
          </div>
        ) : null}
        
        <div className="space-y-4">
          {isLoading ? (
            <p className="text-center text-muted-foreground py-4">
              {language === 'en' ? 'Loading goals...' : 'جاري تحميل الأهداف...'}
            </p>
          ) : goals.length === 0 ? (
            <div className="bg-accent/10 rounded-lg p-6 text-center">
              <p>{language === 'en' ? 'No goals set yet.' : 'لم يتم تحديد أهداف بعد.'}</p>
              <Button 
                variant="link" 
                onClick={() => setIsAddingGoal(true)}
                className="mt-2"
              >
                {language === 'en' ? 'Create your first goal' : 'أنشئ هدفك الأول'}
              </Button>
            </div>
          ) : (
            goals.map(goal => (
              <div key={goal.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{goal.title}</h3>
                    {goal.description && (
                      <p className="text-sm text-muted-foreground mt-1">{goal.description}</p>
                    )}
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditGoal(goal)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteGoal(goal.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {goal.target_date && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {new Date(goal.target_date).toLocaleDateString()}
                  </div>
                )}
                
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{language === 'en' ? 'Progress' : 'التقدم'}</span>
                    <span>{goal.progress}%</span>
                  </div>
                  <Progress value={goal.progress} className="h-2" />
                  
                  <div className="flex justify-between mt-2">
                    {[0, 25, 50, 75, 100].map(value => (
                      <Button
                        key={value}
                        variant="outline"
                        size="sm"
                        className="h-8 px-2"
                        onClick={() => handleUpdateProgress(goal.id, value)}
                      >
                        {value}%
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default GoalsTracker;
