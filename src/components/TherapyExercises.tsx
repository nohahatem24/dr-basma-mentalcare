
import React from 'react';
import { useLanguage } from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Brain, ArrowRight, Activity, HeartPulse } from 'lucide-react';
import { Link } from 'react-router-dom';

const TherapyExercises = () => {
  const { language } = useLanguage();
  const { toast } = useToast();

  const handleViewAll = () => {
    // This would ideally navigate to a dedicated exercises page
    toast({
      title: language === 'en' ? "Exercises Library" : "مكتبة التمارين",
      description: language === 'en' 
        ? "Navigating to all exercises" 
        : "جاري الانتقال إلى جميع التمارين",
    });
  };

  const handleProgress = () => {
    toast({
      title: language === 'en' ? "My Progress" : "تقدمي",
      description: language === 'en' 
        ? "Tracking feature coming soon" 
        : "ميزة التتبع قادمة قريباً",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Brain className="h-5 w-5 text-primary" />
          <span>
            {language === 'en' ? 'Therapeutic Exercises' : 'التمارين العلاجية'}
          </span>
        </CardTitle>
        <CardDescription>
          {language === 'en' 
            ? 'Practice mental health exercises recommended by Dr. Bassma' 
            : 'مارس تمارين الصحة النفسية الموصى بها من قبل د. بسمة'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="featured" className="space-y-4">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="featured">
              {language === 'en' ? 'Featured' : 'مميزة'}
            </TabsTrigger>
            <TabsTrigger value="recent">
              {language === 'en' ? 'Recent' : 'حديثة'}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="featured" className="space-y-4">
            <div className="bg-accent/20 rounded-md p-3">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">
                  {language === 'en' ? 'Thought Record' : 'سجل الأفكار'}
                </h4>
                <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                  {language === 'en' ? 'Popular' : 'شائع'}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                {language === 'en' 
                  ? 'Challenge negative thoughts by examining evidence and creating balanced perspectives.' 
                  : 'تحدي الأفكار السلبية من خلال فحص الأدلة وخلق وجهات نظر متوازنة.'}
              </p>
              <Button variant="outline" size="sm" asChild>
                <Link to="/self-reporting">
                  {language === 'en' ? 'Start Exercise' : 'ابدأ التمرين'}
                </Link>
              </Button>
            </div>
            
            <div className="bg-accent/20 rounded-md p-3">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">
                  {language === 'en' ? '5-4-3-2-1 Grounding' : 'تقنية التأريض ٥-٤-٣-٢-١'}
                </h4>
                <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                  {language === 'en' ? 'New' : 'جديد'}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                {language === 'en' 
                  ? 'A mindfulness exercise to help manage anxiety and stress in the moment.' 
                  : 'تمرين اليقظة الذهنية للمساعدة في إدارة القلق والتوتر في اللحظة الحالية.'}
              </p>
              <Button variant="outline" size="sm" asChild>
                <Link to="/self-reporting">
                  {language === 'en' ? 'Start Exercise' : 'ابدأ التمرين'}
                </Link>
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="recent" className="space-y-4">
            <div className="bg-accent/20 rounded-md p-3">
              <h4 className="font-medium mb-2">
                {language === 'en' ? 'Deep Breathing' : 'التنفس العميق'}
              </h4>
              <p className="text-sm text-muted-foreground mb-2">
                {language === 'en' 
                  ? 'Practice deep breathing to calm your nervous system and reduce stress.' 
                  : 'مارس التنفس العميق لتهدئة جهازك العصبي وتقليل التوتر.'}
              </p>
              <Button variant="outline" size="sm" asChild>
                <Link to="/self-reporting">
                  {language === 'en' ? 'Continue' : 'المتابعة'}
                </Link>
              </Button>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-between mt-4">
          <Button 
            variant="ghost" 
            onClick={handleViewAll} 
            className="text-primary"
            size="sm"
          >
            {language === 'en' ? 'View All Exercises' : 'عرض جميع التمارين'}
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
          
          <Button 
            variant="ghost" 
            onClick={handleProgress} 
            className="text-primary"
            size="sm"
          >
            {language === 'en' ? 'My Progress' : 'تقدمي'}
            <Activity className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TherapyExercises;
