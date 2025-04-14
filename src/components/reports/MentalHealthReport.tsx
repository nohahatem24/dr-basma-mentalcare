import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Calendar, Download, Printer, Send, BarChart2, LineChart, PieChart, Activity, Brain, Heart, Users, Target } from 'lucide-react';
import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { Line, Bar, Pie } from 'react-chartjs-2';
import 'chart.js/auto';

interface ReportConfig {
  frequency: 'daily' | 'weekly' | 'monthly';
  startDate: Date;
  endDate: Date;
  sections: string[];
}

interface MoodEntry {
  id: string;
  created_at: string;
  mood_score: number;
  notes?: string;
  triggers?: string[];
}

interface TherapeuticExercise {
  id: string;
  created_at: string;
  exercise_type: string;
  user_id: string;
  exercise_id: string;
  notes?: string;
  completed_at: string;
}

interface GoalData {
  id: string;
  title: string;
  progress: number;
}

const MentalHealthReport = () => {
  const { language } = useLanguage();
  const { session } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [moodData, setMoodData] = useState<MoodEntry[]>([]);
  const [exerciseData, setExerciseData] = useState<TherapeuticExercise[]>([]);
  const [goalData, setGoalData] = useState<GoalData[]>([]);
  
  const [config, setConfig] = useState<ReportConfig>({
    frequency: 'weekly',
    startDate: startOfWeek(new Date()),
    endDate: endOfWeek(new Date()),
    sections: [
      'mood_patterns',
      'gratitude',
      'cbt_exercises',
      'emotional_triggers',
      'ai_insights',
      'dbt_exercises',
      'goal_progress',
      'relationships'
    ]
  });

  useEffect(() => {
    if (!session.user) return;
    
    const fetchData = async () => {
      setIsLoading(true);
      
      try {
        const { data: moodData, error: moodError } = await supabase
          .from('mood_entries')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false });
          
        if (moodError) throw moodError;
        setMoodData(moodData || []);
        
        const { data: exerciseData, error: exerciseError } = await supabase
          .from('therapeutic_exercises_logs')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false });
          
        if (exerciseError) throw exerciseError;
        setExerciseData(exerciseData as TherapeuticExercise[] || []);
        
        const { data: goalData, error: goalError } = await supabase
          .from('goals')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false });
          
        if (goalError) throw goalError;
        setGoalData(goalData || []);
        
      } catch (error) {
        console.error('Error fetching report data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [session.user]);

  const reportSections = [
    { id: 'mood_patterns', icon: LineChart, label: { en: 'Mood Patterns', ar: 'أنماط المزاج' } },
    { id: 'gratitude', icon: Heart, label: { en: 'Gratitude Journal', ar: 'يوميات الامتنان' } },
    { id: 'cbt_exercises', icon: Brain, label: { en: 'CBT Exercises', ar: 'تمارين CBT' } },
    { id: 'emotional_triggers', icon: Activity, label: { en: 'Emotional Triggers', ar: 'المحفزات العاطفية' } },
    { id: 'ai_insights', icon: BarChart2, label: { en: 'AI Insights', ar: 'تحليلات الذكاء الاصطناعي' } },
    { id: 'dbt_exercises', icon: Brain, label: { en: 'DBT Exercises', ar: 'تمارين DBT' } },
    { id: 'goal_progress', icon: PieChart, label: { en: 'Goal Progress', ar: 'تقدم الأهداف' } },
    { id: 'relationships', icon: Users, label: { en: 'Relationships', ar: 'العلاقات' } }
  ];

  const updateDateRange = (frequency: string) => {
    const today = new Date();
    let start: Date, end: Date;

    switch (frequency) {
      case 'daily':
        start = today;
        end = today;
        break;
      case 'weekly':
        start = startOfWeek(today);
        end = endOfWeek(today);
        break;
      case 'monthly':
        start = startOfMonth(today);
        end = endOfMonth(today);
        break;
      default:
        start = today;
        end = today;
    }

    setConfig(prev => ({
      ...prev,
      frequency: frequency as 'daily' | 'weekly' | 'monthly',
      startDate: start,
      endDate: end
    }));
  };

  const toggleSection = (sectionId: string) => {
    setConfig(prev => ({
      ...prev,
      sections: prev.sections.includes(sectionId)
        ? prev.sections.filter(id => id !== sectionId)
        : [...prev.sections, sectionId]
    }));
  };

  const formatDate = (date: Date) => {
    return format(date, language === 'en' ? 'MMMM d, yyyy' : 'yyyy/MM/dd');
  };

  const getMoodChartData = () => {
    if (!moodData.length) return null;
    
    const last14Days = moodData
      .filter(entry => new Date(entry.created_at) >= subDays(new Date(), 14))
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
      
    return {
      labels: last14Days.map(entry => format(new Date(entry.created_at), 'MMM d')),
      datasets: [
        {
          label: language === 'en' ? 'Mood Score' : 'مقياس المزاج',
          data: last14Days.map(entry => entry.mood_score),
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          tension: 0.4,
          fill: true
        }
      ]
    };
  };

  const getExerciseChartData = () => {
    if (!exerciseData.length) return null;
    
    const exerciseCounts: Record<string, number> = {};
    exerciseData.forEach(exercise => {
      exerciseCounts[exercise.exercise_type] = (exerciseCounts[exercise.exercise_type] || 0) + 1;
    });
    
    const labels = Object.keys(exerciseCounts).map(type => {
      switch (type) {
        case 'cbt': return language === 'en' ? 'CBT' : 'العلاج المعرفي السلوكي';
        case 'dbt': return language === 'en' ? 'DBT' : 'العلاج السلوكي الجدلي';
        case 'act': return language === 'en' ? 'ACT' : 'العلاج بالقبول والالتزام';
        case 'mindfulness': return language === 'en' ? 'Mindfulness' : 'اليقظة الذهنية';
        default: return type;
      }
    });
    
    return {
      labels,
      datasets: [
        {
          label: language === 'en' ? 'Exercises Completed' : 'التمارين المكتملة',
          data: Object.values(exerciseCounts),
          backgroundColor: [
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)',
            'rgba(255, 159, 64, 0.6)',
            'rgba(54, 162, 235, 0.6)'
          ]
        }
      ]
    };
  };

  const getGoalChartData = () => {
    if (!goalData.length) return null;
    
    return {
      labels: goalData.map(goal => goal.title),
      datasets: [
        {
          label: language === 'en' ? 'Progress (%)' : 'التقدم (٪)',
          data: goalData.map(goal => goal.progress),
          backgroundColor: 'rgba(153, 102, 255, 0.6)'
        }
      ]
    };
  };

  const generateReport = () => {
    console.log('Generating report with config:', config);
    setActiveTab('report');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>
            {language === 'en' ? 'Mental Health Report' : 'تقرير الصحة النفسية'}
          </CardTitle>
          <CardDescription>
            {language === 'en'
              ? 'Generate comprehensive reports about your mental health journey'
              : 'إنشاء تقارير شاملة عن رحلة صحتك النفسية'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="overview">
                {language === 'en' ? 'Overview' : 'نظرة عامة'}
              </TabsTrigger>
              <TabsTrigger value="customize">
                {language === 'en' ? 'Customize Report' : 'تخصيص التقرير'}
              </TabsTrigger>
              <TabsTrigger value="report">
                {language === 'en' ? 'Report' : 'التقرير'}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6">
              {isLoading ? (
                <div className="flex justify-center p-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <LineChart className="mr-2 h-5 w-5" />
                        {language === 'en' ? 'Mood Trends' : 'اتجاهات المزاج'}
                      </CardTitle>
                      <CardDescription>
                        {language === 'en' ? 'Your mood patterns over the last 14 days' : 'أنماط مزاجك خلال الـ 14 يومًا الماضية'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px] flex items-center justify-center">
                      {getMoodChartData() ? (
                        <Line 
                          data={getMoodChartData() as any} 
                          options={{
                            maintainAspectRatio: false,
                            scales: {
                              y: {
                                min: -10,
                                max: 10,
                                title: {
                                  display: true,
                                  text: language === 'en' ? 'Mood Scale' : 'مقياس المزاج'
                                }
                              }
                            }
                          }} 
                        />
                      ) : (
                        <div className="text-muted-foreground text-center">
                          {language === 'en' ? 'No mood data available' : 'لا توجد بيانات مزاج متاحة'}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Activity className="mr-2 h-5 w-5" />
                          {language === 'en' ? 'Exercises Completed' : 'التمارين المكتملة'}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="h-[250px] flex items-center justify-center">
                        {getExerciseChartData() ? (
                          <Pie 
                            data={getExerciseChartData() as any}
                            options={{ maintainAspectRatio: false }} 
                          />
                        ) : (
                          <div className="text-muted-foreground text-center">
                            {language === 'en' ? 'No exercise data available' : 'لا توجد بيانات تمارين متاحة'}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Target className="mr-2 h-5 w-5" />
                          {language === 'en' ? 'Goals Progress' : 'تقدم الأهداف'}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="h-[250px] flex items-center justify-center">
                        {getGoalChartData() ? (
                          <Bar 
                            data={getGoalChartData() as any}
                            options={{
                              maintainAspectRatio: false,
                              scales: {
                                y: {
                                  min: 0,
                                  max: 100,
                                  title: {
                                    display: true,
                                    text: '%'
                                  }
                                }
                              }
                            }} 
                          />
                        ) : (
                          <div className="text-muted-foreground text-center">
                            {language === 'en' ? 'No goal data available' : 'لا توجد بيانات أهداف متاحة'}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button onClick={() => setActiveTab('customize')}>
                      {language === 'en' ? 'Customize Report' : 'تخصيص التقرير'}
                    </Button>
                  </div>
                </>
              )}
            </TabsContent>
            
            <TabsContent value="customize" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>
                      {language === 'en' ? 'Report Frequency' : 'تكرار التقرير'}
                    </Label>
                    <Select
                      value={config.frequency}
                      onValueChange={updateDateRange}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">
                          {language === 'en' ? 'Daily' : 'يومي'}
                        </SelectItem>
                        <SelectItem value="weekly">
                          {language === 'en' ? 'Weekly' : 'أسبوعي'}
                        </SelectItem>
                        <SelectItem value="monthly">
                          {language === 'en' ? 'Monthly' : 'شهري'}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>
                        {language === 'en' ? 'Start Date' : 'تاريخ البدء'}
                      </Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left">
                            <Calendar className="mr-2 h-4 w-4" />
                            {formatDate(config.startDate)}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <CalendarComponent
                            mode="single"
                            selected={config.startDate}
                            onSelect={(date) => date && setConfig(prev => ({ ...prev, startDate: date }))}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <Label>
                        {language === 'en' ? 'End Date' : 'تاريخ الانتهاء'}
                      </Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left">
                            <Calendar className="mr-2 h-4 w-4" />
                            {formatDate(config.endDate)}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <CalendarComponent
                            mode="single"
                            selected={config.endDate}
                            onSelect={(date) => date && setConfig(prev => ({ ...prev, endDate: date }))}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>
                    {language === 'en' ? 'Report Content' : 'محتوى التقرير'}
                  </Label>
                  <ScrollArea className="h-[200px] rounded-md border p-4">
                    <div className="space-y-4">
                      {reportSections.map(section => (
                        <div key={section.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={section.id}
                            checked={config.sections.includes(section.id)}
                            onCheckedChange={() => toggleSection(section.id)}
                          />
                          <div className="flex items-center gap-2">
                            <section.icon className="h-4 w-4 text-muted-foreground" />
                            <Label htmlFor={section.id} className="cursor-pointer">
                              {language === 'en' ? section.label.en : section.label.ar}
                            </Label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setActiveTab('overview')}>
                  {language === 'en' ? 'Back' : 'رجوع'}
                </Button>
                <Button onClick={generateReport}>
                  {language === 'en' ? 'Generate Report' : 'إنشاء التقرير'}
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="report" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>
                      {language === 'en' ? 'Mental Health Report' : 'تقرير الصحة النفسية'}
                    </CardTitle>
                    <div className="text-sm text-muted-foreground">
                      {formatDate(config.startDate)} - {formatDate(config.endDate)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-8">
                  {isLoading ? (
                    <div className="flex justify-center p-8">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                    </div>
                  ) : (
                    <>
                      {config.sections.includes('mood_patterns') && (
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold flex items-center">
                            <LineChart className="mr-2 h-5 w-5" />
                            {language === 'en' ? 'Mood Patterns' : 'أنماط المزاج'}
                          </h3>
                          <div className="h-[300px]">
                            {getMoodChartData() ? (
                              <Line 
                                data={getMoodChartData() as any} 
                                options={{
                                  maintainAspectRatio: false,
                                  scales: {
                                    y: {
                                      min: -10,
                                      max: 10
                                    }
                                  }
                                }} 
                              />
                            ) : (
                              <div className="text-muted-foreground text-center p-12">
                                {language === 'en' ? 'No mood data available' : 'لا توجد بيانات مزاج متاحة'}
                              </div>
                            )}
                          </div>
                          <div className="bg-muted p-4 rounded-md">
                            <div className="text-sm font-medium mb-1">
                              {language === 'en' ? 'Analysis:' : 'التحليل:'}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {language === 'en' 
                                ? 'Your mood has shown general stability with minor fluctuations. Consider noting events that correspond with mood changes.'
                                : 'أظهر مزاجك استقرارًا عامًا مع تقلبات طفيفة. فكر في تدوين الأحداث التي تتوافق مع تغيرات المزاج.'}
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {config.sections.includes('dbt_exercises') && config.sections.includes('cbt_exercises') && (
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold flex items-center">
                            <Activity className="mr-2 h-5 w-5" />
                            {language === 'en' ? 'Therapeutic Exercises' : 'التمارين العلاجية'}
                          </h3>
                          <div className="h-[250px]">
                            {getExerciseChartData() ? (
                              <Pie 
                                data={getExerciseChartData() as any}
                                options={{ maintainAspectRatio: false }} 
                              />
                            ) : (
                              <div className="text-muted-foreground text-center p-12">
                                {language === 'en' ? 'No exercise data available' : 'لا توجد بيانات تمارين متاحة'}
                              </div>
                            )}
                          </div>
                          <div className="bg-muted p-4 rounded-md">
                            <div className="text-sm font-medium mb-1">
                              {language === 'en' ? 'Insights:' : 'الرؤى:'}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {language === 'en' 
                                ? 'You\'ve engaged most with CBT exercises. Consider exploring other therapeutic approaches for a balanced practice.'
                                : 'لقد تفاعلت أكثر مع تمارين العلاج المعرفي السلوكي. فكر في استكشاف مناهج علاجية أخرى لممارسة متوازنة.'}
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {config.sections.includes('goal_progress') && (
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold flex items-center">
                            <Target className="mr-2 h-5 w-5" />
                            {language === 'en' ? 'Goal Progress' : 'تقدم الأهداف'}
                          </h3>
                          <div className="h-[250px]">
                            {getGoalChartData() ? (
                              <Bar 
                                data={getGoalChartData() as any}
                                options={{
                                  maintainAspectRatio: false,
                                  scales: {
                                    y: {
                                      min: 0,
                                      max: 100
                                    }
                                  }
                                }} 
                              />
                            ) : (
                              <div className="text-muted-foreground text-center p-12">
                                {language === 'en' ? 'No goal data available' : 'لا توجد بيانات أهداف متاحة'}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                  
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setActiveTab('customize')}>
                      {language === 'en' ? 'Back' : 'رجوع'}
                    </Button>
                    <Button variant="outline" onClick={() => window.print()}>
                      <Printer className="mr-2 h-4 w-4" />
                      {language === 'en' ? 'Print' : 'طباعة'}
                    </Button>
                    <Button onClick={() => {}}>
                      <Download className="mr-2 h-4 w-4" />
                      {language === 'en' ? 'Download Report' : 'تحميل التقرير'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default MentalHealthReport;
