import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '@/components/Header';
import { Brain, BookOpen, Heart, Target, Wind, Activity, BarChart3, FileText, Sparkles, Leaf } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/auth/AuthProvider';
import MoodTracker from '@/components/MoodTracker';
import CPTTechniques from '@/components/CPTTechniques';
import RelationshipTracker from '@/components/RelationshipTracker';
import MentalHealthReport from '@/components/reports/MentalHealthReport';
import GuidedBreathing from '@/components/breathing/GuidedBreathing';
import Journal from '@/components/journal/Journal';
import Gratitude from '@/components/gratitude/Gratitude';
import Goals from '@/components/goals/Goals';
import DBTExerciseTab from '@/components/therapeutic/DBTExerciseTab';
import ACTExerciseTab from '@/components/therapeutic/ACTExerciseTab';

const MindTrackTools = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const { session } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('mood');

  const handleExerciseComplete = () => {
    // يمكن إضافة منطق إضافي هنا عند اكتمال التمارين
    console.log('Exercise completed');
  };

  // Get tab from URL query parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab && ['mood', 'journal', 'gratitude', 'breathing', 'cpt', 'dbt', 'act', 'relationship', 'goals', 'report'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [location.search]);

  // Update URL when tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    navigate(`/mindtrack?tab=${value}`, { replace: true });
  };

  const tools = [
    {
      id: 'mood',
      title: language === 'en' ? 'Mood Tracker' : 'متتبع المزاج',
      icon: <Brain className="h-6 w-6" />,
      description: language === 'en' 
        ? 'Track your daily mood patterns and emotional trends' 
        : 'تتبع أنماط مزاجك اليومية واتجاهات المشاعر',
      component: <MoodTracker />
    },
    {
      id: 'journal',
      title: language === 'en' ? 'Journal' : 'المذكرات',
      icon: <BookOpen className="h-6 w-6" />,
      description: language === 'en' 
        ? 'Express your thoughts and feelings through journaling' 
        : 'عبر عن أفكارك ومشاعرك من خلال كتابة المذكرات',
      component: <Journal />
    },
    {
      id: 'gratitude',
      title: language === 'en' ? 'Gratitude' : 'الامتنان',
      icon: <Heart className="h-6 w-6" />,
      description: language === 'en' 
        ? 'Practice gratitude to improve your mental well-being' 
        : 'مارس الامتنان لتحسين صحتك النفسية',
      component: <Gratitude />
    },
    {
      id: 'breathing',
      title: language === 'en' ? 'Guided Breathing' : 'التنفس الموجّه',
      icon: <Wind className="h-6 w-6" />,
      description: language === 'en' 
        ? 'Reduce stress with guided breathing exercises' 
        : 'قلل التوتر من خلال تمارين التنفس الموجهة',
      component: <GuidedBreathing />
    },
    {
      id: 'cpt',
      title: language === 'en' ? 'CPT Techniques' : 'تقنيات المعالجة المعرفية',
      icon: <Activity className="h-6 w-6" />,
      description: language === 'en' 
        ? 'Cognitive Processing Therapy techniques for trauma and stress' 
        : 'تقنيات العلاج المعرفي للصدمات والتوتر',
      component: <CPTTechniques />
    },
    {
      id: 'dbt',
      title: language === 'en' ? 'DBT Skills' : 'مهارات DBT',
      icon: <Leaf className="h-6 w-6" />,
      description: language === 'en'
        ? 'Practice Dialectical Behavior Therapy skills'
        : 'تمرن على مهارات العلاج السلوكي الجدلي',
      component: <DBTExerciseTab onComplete={handleExerciseComplete} />
    },
    {
      id: 'act',
      title: language === 'en' ? 'ACT Exercises' : 'تمارين ACT',
      icon: <Sparkles className="h-6 w-6" />,
      description: language === 'en'
        ? 'Acceptance and Commitment Therapy exercises'
        : 'تمارين العلاج بالقبول والالتزام',
      component: <ACTExerciseTab onComplete={handleExerciseComplete} />
    },
    {
      id: 'relationship',
      title: language === 'en' ? 'Relationship Tracker' : 'متتبع العلاقات',
      icon: <BarChart3 className="h-6 w-6" />,
      description: language === 'en' 
        ? 'Monitor and improve your relationships' 
        : 'راقب وحسن علاقاتك',
      component: <RelationshipTracker />
    },
    {
      id: 'goals',
      title: language === 'en' ? 'Goals' : 'الأهداف',
      icon: <Target className="h-6 w-6" />,
      description: language === 'en' 
        ? 'Set and track personal development goals' 
        : 'حدد وتتبع أهداف التطوير الشخصي',
      component: <Goals />
    },
    {
      id: 'report',
      title: language === 'en' ? 'Mental Health Report' : 'تقرير الصحة النفسية',
      icon: <FileText className="h-6 w-6" />,
      description: language === 'en' 
        ? 'View your comprehensive mental health report' 
        : 'اعرض تقرير صحتك النفسية الشامل',
      component: <MentalHealthReport />
    }
  ];

  // Check if user is authenticated
  if (!session.isAuthenticated) {
    return (
      <div className="container max-w-6xl py-8">
        <Card className="p-8 text-center">
          <CardHeader>
            <CardTitle>
              {language === 'en' ? 'Sign In Required' : 'مطلوب تسجيل الدخول'}
            </CardTitle>
            <CardDescription>
              {language === 'en' 
                ? 'Please sign in to access the MindTrack tools' 
                : 'يرجى تسجيل الدخول للوصول إلى أدوات MindTrack'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/auth')}>
              {language === 'en' ? 'Sign In' : 'تسجيل الدخول'}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl py-8">
      <div className="flex flex-col gap-4 md:flex-row">
        {/* Tools Navigation */}
        <div className="md:w-1/4">
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle>
                {language === 'en' ? 'MindTrack Tools' : 'أدوات مايند تراك'}
              </CardTitle>
              <CardDescription>
                {language === 'en' 
                  ? 'Tools to support your mental wellness journey' 
                  : 'أدوات لدعم رحلة صحتك النفسية'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {tools.map(tool => (
                  <Button 
                    key={tool.id} 
                    variant={activeTab === tool.id ? "default" : "outline"} 
                    className="justify-start"
                    onClick={() => handleTabChange(tool.id)}
                  >
                    <div className="flex items-center">
                      <div className="mr-2">
                        {tool.icon}
                      </div>
                      <div className="text-start">
                        {tool.title}
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tool Content */}
        <div className="md:w-3/4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {tools.find(t => t.id === activeTab)?.icon}
                  <CardTitle>{tools.find(t => t.id === activeTab)?.title}</CardTitle>
                </div>
                <Badge variant="outline">
                  {language === 'en' ? 'Interactive Tool' : 'أداة تفاعلية'}
                </Badge>
              </div>
              <CardDescription>
                {tools.find(t => t.id === activeTab)?.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="min-h-[500px]">
                {tools.find(t => t.id === activeTab)?.component}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MindTrackTools; 