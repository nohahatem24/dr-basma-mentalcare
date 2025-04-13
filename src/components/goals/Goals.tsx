import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { Target, Plus, Edit2, Trash2, Calendar, CheckCircle2, Circle } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';

interface Goal {
  id: string;
  title: string;
  description: string;
  category: string;
  targetDate: Date;
  progress: number;
  milestones: Milestone[];
  createdAt: Date;
}

interface Milestone {
  id: string;
  description: string;
  completed: boolean;
}

const categories = [
  { value: 'mental-health', label: { en: 'Mental Health', ar: 'الصحة النفسية' } },
  { value: 'personal-growth', label: { en: 'Personal Growth', ar: 'النمو الشخصي' } },
  { value: 'relationships', label: { en: 'Relationships', ar: 'العلاقات' } },
  { value: 'career', label: { en: 'Career', ar: 'المهنة' } },
  { value: 'health', label: { en: 'Health', ar: 'الصحة' } },
  { value: 'other', label: { en: 'Other', ar: 'أخرى' } },
];

const Goals = () => {
  const { language } = useLanguage();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [activeTab, setActiveTab] = useState('create');
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [newGoal, setNewGoal] = useState<Goal>({
    id: '',
    title: '',
    description: '',
    category: '',
    targetDate: new Date(),
    progress: 0,
    milestones: [],
    createdAt: new Date()
  });
  const [newMilestone, setNewMilestone] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  useEffect(() => {
    const savedGoals = localStorage.getItem('goals');
    if (savedGoals) {
      try {
        const parsed = JSON.parse(savedGoals);
        setGoals(parsed.map((goal: any) => ({
          ...goal,
          targetDate: new Date(goal.targetDate),
          createdAt: new Date(goal.createdAt)
        })));
      } catch (error) {
        console.error('Error loading goals:', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('goals', JSON.stringify(goals));
  }, [goals]);

  const resetForm = () => {
    setNewGoal({
      id: '',
      title: '',
      description: '',
      category: '',
      targetDate: new Date(),
      progress: 0,
      milestones: [],
      createdAt: new Date()
    });
    setEditingGoal(null);
  };

  const addMilestone = () => {
    if (!newMilestone.trim()) return;
    const milestone: Milestone = {
      id: Date.now().toString(),
      description: newMilestone.trim(),
      completed: false
    };
    if (editingGoal) {
      setEditingGoal({
        ...editingGoal,
        milestones: [...editingGoal.milestones, milestone]
      });
    } else {
      setNewGoal({
        ...newGoal,
        milestones: [...newGoal.milestones, milestone]
      });
    }
    setNewMilestone('');
  };

  const toggleMilestone = (goalId: string, milestoneId: string) => {
    setGoals(prevGoals => prevGoals.map(goal => {
      if (goal.id !== goalId) return goal;
      const updatedMilestones = goal.milestones.map(milestone => {
        if (milestone.id !== milestoneId) return milestone;
        return { ...milestone, completed: !milestone.completed };
      });
      const progress = Math.round((updatedMilestones.filter(m => m.completed).length / updatedMilestones.length) * 100);
      return { ...goal, milestones: updatedMilestones, progress };
    }));
  };

  const saveGoal = () => {
    if (!newGoal.title || !newGoal.category) return;

    if (editingGoal) {
      setGoals(prevGoals => prevGoals.map(goal => 
        goal.id === editingGoal.id ? { ...editingGoal, progress: calculateProgress(editingGoal.milestones) } : goal
      ));
    } else {
      const goalToSave = {
        ...newGoal,
        id: Date.now().toString(),
        createdAt: new Date(),
        progress: calculateProgress(newGoal.milestones)
      };
      setGoals(prevGoals => [...prevGoals, goalToSave]);
    }

    resetForm();
    setActiveTab('list');
  };

  const calculateProgress = (milestones: Milestone[]) => {
    if (milestones.length === 0) return 0;
    return Math.round((milestones.filter(m => m.completed).length / milestones.length) * 100);
  };

  const deleteGoal = (id: string) => {
    setGoals(prevGoals => prevGoals.filter(goal => goal.id !== id));
  };

  const editGoal = (goal: Goal) => {
    setEditingGoal(goal);
    setNewGoal(goal);
    setActiveTab('create');
  };

  const removeMilestone = (milestoneId: string) => {
    if (editingGoal) {
      setEditingGoal({
        ...editingGoal,
        milestones: editingGoal.milestones.filter(m => m.id !== milestoneId)
      });
    } else {
      setNewGoal({
        ...newGoal,
        milestones: newGoal.milestones.filter(m => m.id !== milestoneId)
      });
    }
  };

  const formatDate = (date: Date) => {
    return format(date, language === 'en' ? 'MMMM d, yyyy' : 'yyyy/MM/dd');
  };

  const getCategoryLabel = (value: string) => {
    const category = categories.find(c => c.value === value);
    return category ? (language === 'en' ? category.label.en : category.label.ar) : value;
  };

  const filteredGoals = goals
    .filter(goal => !categoryFilter || goal.category === categoryFilter)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="create">
            {language === 'en' ? 'Create Goal' : 'إنشاء هدف'}
          </TabsTrigger>
          <TabsTrigger value="list">
            {language === 'en' ? 'My Goals' : 'أهدافي'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>
                {editingGoal 
                  ? (language === 'en' ? 'Edit Goal' : 'تعديل الهدف')
                  : (language === 'en' ? 'Create New Goal' : 'إنشاء هدف جديد')}
              </CardTitle>
              <CardDescription>
                {language === 'en'
                  ? 'Set clear, achievable goals with milestones'
                  : 'حدد أهدافًا واضحة وقابلة للتحقيق مع معالم'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">
                  {language === 'en' ? 'Goal Title' : 'عنوان الهدف'}
                </Label>
                <Input
                  id="title"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                  placeholder={language === 'en' ? 'Enter goal title' : 'أدخل عنوان الهدف'}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">
                  {language === 'en' ? 'Category' : 'الفئة'}
                </Label>
                <Select
                  value={newGoal.category}
                  onValueChange={(value) => setNewGoal({ ...newGoal, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={language === 'en' ? 'Select category' : 'اختر الفئة'} />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {language === 'en' ? category.label.en : category.label.ar}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">
                  {language === 'en' ? 'Description' : 'الوصف'}
                </Label>
                <Textarea
                  id="description"
                  value={newGoal.description}
                  onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                  placeholder={language === 'en' ? 'Describe your goal...' : 'صف هدفك...'}
                />
              </div>

              <div className="space-y-2">
                <Label>
                  {language === 'en' ? 'Target Date' : 'تاريخ الهدف'}
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left">
                      <Calendar className="mr-2 h-4 w-4" />
                      {formatDate(newGoal.targetDate)}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={newGoal.targetDate}
                      onSelect={(date) => date && setNewGoal({ ...newGoal, targetDate: date })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-4">
                <Label>
                  {language === 'en' ? 'Milestones' : 'المعالم'}
                </Label>
                <div className="flex gap-2">
                  <Input
                    value={newMilestone}
                    onChange={(e) => setNewMilestone(e.target.value)}
                    placeholder={language === 'en' ? 'Add a milestone...' : 'أضف معلمًا...'}
                    onKeyDown={(e) => e.key === 'Enter' && addMilestone()}
                  />
                  <Button onClick={addMilestone} size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    {language === 'en' ? 'Add' : 'إضافة'}
                  </Button>
                </div>
                <ul className="space-y-2">
                  {(editingGoal ? editingGoal.milestones : newGoal.milestones).map((milestone) => (
                    <li key={milestone.id} className="flex items-center justify-between gap-2 bg-muted p-2 rounded-md">
                      <span>{milestone.description}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeMilestone(milestone.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={resetForm}>
                  {language === 'en' ? 'Cancel' : 'إلغاء'}
                </Button>
                <Button onClick={saveGoal}>
                  {editingGoal
                    ? (language === 'en' ? 'Update Goal' : 'تحديث الهدف')
                    : (language === 'en' ? 'Create Goal' : 'إنشاء الهدف')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="list">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>
                  {language === 'en' ? 'My Goals' : 'أهدافي'}
                </CardTitle>
                <Button variant="outline" onClick={() => {
                  resetForm();
                  setActiveTab('create');
                }}>
                  <Plus className="h-4 w-4 mr-2" />
                  {language === 'en' ? 'New Goal' : 'هدف جديد'}
                </Button>
              </div>
              <div className="flex items-center gap-4">
                <Select
                  value={categoryFilter}
                  onValueChange={setCategoryFilter}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder={language === 'en' ? 'All Categories' : 'جميع الفئات'} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">
                      {language === 'en' ? '- All Categories -' : '- جميع الفئات -'}
                    </SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {language === 'en' ? category.label.en : category.label.ar}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-4">
                  {filteredGoals.length === 0 ? (
                    <div className="text-center py-12">
                      <Target className="h-12 w-12 mx-auto opacity-30 mb-4" />
                      <p className="text-muted-foreground">
                        {language === 'en'
                          ? 'No goals set yet.'
                          : 'لم يتم تحديد أهداف بعد.'}
                      </p>
                      <Button
                        variant="link"
                        onClick={() => setActiveTab('create')}
                      >
                        {language === 'en'
                          ? 'Create your first goal!'
                          : 'أنشئ هدفك الأول!'}
                      </Button>
                    </div>
                  ) : (
                    filteredGoals.map(goal => (
                      <Card key={goal.id} className="relative">
                        <CardContent className="pt-6">
                          <div className="absolute top-2 right-2 flex gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => editGoal(goal)}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => deleteGoal(goal.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="space-y-4">
                            <div>
                              <h3 className="text-lg font-semibold">{goal.title}</h3>
                              <div className="flex gap-2 text-sm text-muted-foreground">
                                <span>{getCategoryLabel(goal.category)}</span>
                                <span>•</span>
                                <span>{language === 'en' ? 'Due' : 'الموعد النهائي'}: {formatDate(goal.targetDate)}</span>
                              </div>
                            </div>

                            {goal.description && (
                              <p className="text-sm">{goal.description}</p>
                            )}

                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>{language === 'en' ? 'Progress' : 'التقدم'}</span>
                                <span>{goal.progress}%</span>
                              </div>
                              <Progress value={goal.progress} className="h-2" />
                            </div>

                            <div className="space-y-2">
                              <Label>
                                {language === 'en' ? 'Milestones' : 'المعالم'}
                              </Label>
                              <ul className="space-y-2">
                                {goal.milestones.map(milestone => (
                                  <li
                                    key={milestone.id}
                                    className="flex items-center gap-2 text-sm"
                                  >
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-6 w-6"
                                      onClick={() => toggleMilestone(goal.id, milestone.id)}
                                    >
                                      {milestone.completed ? (
                                        <CheckCircle2 className="h-4 w-4 text-primary" />
                                      ) : (
                                        <Circle className="h-4 w-4" />
                                      )}
                                    </Button>
                                    <span className={milestone.completed ? 'line-through text-muted-foreground' : ''}>
                                      {milestone.description}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Goals; 