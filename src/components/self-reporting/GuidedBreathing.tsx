
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/components/Header';
import { Wind } from 'lucide-react';

// Import the smaller components 
import { BreathingCircle } from './breathing/BreathingCircle';
import { BreathingControls } from './breathing/BreathingControls';
import { BreathingStats } from './breathing/BreathingStats';
import { TechniqueSelector } from './breathing/TechniqueSelector';
import { CustomSettings } from './breathing/CustomSettings';
import { BreathingBenefits } from './breathing/BreathingBenefits';
import { useBreathingExercise, BREATHING_TECHNIQUES } from './breathing/useBreathingExercise';

const GuidedBreathing = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const {
    isActive,
    currentPhase,
    secondsLeft,
    completedCycles,
    totalDuration,
    customSettings,
    isCustom,
    technique,
    toggleBreathing,
    resetBreathing,
    handleTechniqueChange,
    handleCustomSettingsChange
  } = useBreathingExercise();
  
  return (
    <Card className="w-full">
      <CardHeader className={language === 'ar' ? 'text-right' : ''}>
        <CardTitle className={`flex items-center gap-2 ${language === 'ar' ? 'flex-row-reverse justify-end' : ''}`}>
          <Wind className="h-5 w-5 text-primary" />
          {language === 'en' ? 'Guided Breathing Exercise' : 'تمرين التنفس الموجّه'}
        </CardTitle>
        <CardDescription className={language === 'ar' ? 'text-right' : ''}>
          {language === 'en'
            ? 'Follow the visual cues to practice mindful breathing and reduce stress'
            : 'اتبع الإشارات المرئية لممارسة التنفس اليقظ وتقليل التوتر'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center justify-center">
          <BreathingCircle 
            currentPhase={currentPhase} 
            secondsLeft={secondsLeft} 
          />
          
          <BreathingControls 
            isActive={isActive} 
            onToggle={toggleBreathing} 
            onReset={resetBreathing} 
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <BreathingStats 
              totalDuration={totalDuration} 
              completedCycles={completedCycles} 
            />
            
            <TechniqueSelector 
              technique={technique}
              isCustom={isCustom}
              onTechniqueChange={handleTechniqueChange}
              techniques={BREATHING_TECHNIQUES}
            />
          </div>
          
          {isCustom && (
            <CustomSettings 
              settings={customSettings}
              onSettingsChange={handleCustomSettingsChange}
            />
          )}
        </div>
        
        <BreathingBenefits />
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" onClick={() => {
          toast({
            title: language === 'en' ? 'Quick Tip' : 'نصيحة سريعة',
            description: language === 'en' 
              ? 'For best results, practice breathing exercises daily for at least 5 minutes.' 
              : 'للحصول على أفضل النتائج، مارس تمارين التنفس يوميًا لمدة 5 دقائق على الأقل.',
          });
        }}>
          {language === 'en' ? 'View Breathing Tips' : 'عرض نصائح التنفس'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default GuidedBreathing;
