import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/components/Header';
import { Play, Pause, RefreshCw, Wind, Clock, BarChart } from 'lucide-react';

// Breathing technique presets
const BREATHING_TECHNIQUES = {
  'box': { name: 'Box Breathing', inhale: 4, hold1: 4, exhale: 4, hold2: 4 },
  '4-7-8': { name: '4-7-8 Technique', inhale: 4, hold1: 7, exhale: 8, hold2: 0 },
  'deep': { name: 'Deep Breathing', inhale: 5, hold1: 2, exhale: 5, hold2: 0 },
  'calm': { name: 'Calming Breath', inhale: 4, hold1: 0, exhale: 6, hold2: 0 },
};

type BreathingPhase = 'inhale' | 'hold1' | 'exhale' | 'hold2';
type BreathingTechnique = keyof typeof BREATHING_TECHNIQUES;

const GuidedBreathing = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [isActive, setIsActive] = useState(false);
  const [technique, setTechnique] = useState<BreathingTechnique>('box');
  const [currentPhase, setCurrentPhase] = useState<BreathingPhase>('inhale');
  const [secondsLeft, setSecondsLeft] = useState(4);
  const [completedCycles, setCompletedCycles] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [customSettings, setCustomSettings] = useState({
    inhale: 4,
    hold1: 4,
    exhale: 4,
    hold2: 4,
  });
  const [isCustom, setIsCustom] = useState(false);
  
  const breathingCircleRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<number | null>(null);
  
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
    };
  }, []);
  
  useEffect(() => {
    if (!isActive) return;
    
    const settings = isCustom ? customSettings : BREATHING_TECHNIQUES[technique];
    
    if (currentPhase === 'inhale') {
      setSecondsLeft(settings.inhale);
    } else if (currentPhase === 'hold1') {
      setSecondsLeft(settings.hold1);
    } else if (currentPhase === 'exhale') {
      setSecondsLeft(settings.exhale);
    } else if (currentPhase === 'hold2') {
      setSecondsLeft(settings.hold2);
    }
    
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
    }
    
    timerRef.current = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          const nextPhase = getNextPhase(currentPhase, settings);
          setCurrentPhase(nextPhase);
          
          if (nextPhase === 'inhale') {
            setCompletedCycles(cycles => cycles + 1);
            
            if ((completedCycles + 1) % 5 === 0) {
              toast({
                title: language === 'en' ? `${completedCycles + 1} cycles completed` : `${completedCycles + 1} دورات مكتملة`,
                description: language === 'en' ? 'Great job! Keep breathing.' : 'عمل رائع! استمر في التنفس.',
              });
            }
          }
          
          if (timerRef.current) {
            window.clearInterval(timerRef.current);
          }
          
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
    };
  }, [currentPhase, isActive, technique, isCustom, customSettings, language, completedCycles, toast]);
  
  useEffect(() => {
    if (isActive) {
      const durationInterval = setInterval(() => {
        setTotalDuration(prev => prev + 1);
      }, 1000);
      
      return () => clearInterval(durationInterval);
    }
  }, [isActive]);
  
  useEffect(() => {
    if (!breathingCircleRef.current) return;
    
    const circle = breathingCircleRef.current;
    
    if (currentPhase === 'inhale') {
      circle.style.transform = 'scale(1.5)';
      circle.style.backgroundColor = 'rgba(72, 149, 239, 0.2)';
    } else if (currentPhase === 'hold1' || currentPhase === 'hold2') {
      circle.style.backgroundColor = 'rgba(72, 149, 239, 0.6)';
    } else if (currentPhase === 'exhale') {
      circle.style.transform = 'scale(1.0)';
      circle.style.backgroundColor = 'rgba(72, 149, 239, 0.3)';
    }
  }, [currentPhase]);
  
  const getNextPhase = (phase: BreathingPhase, settings: typeof customSettings): BreathingPhase => {
    if (phase === 'inhale') {
      return settings.hold1 > 0 ? 'hold1' : 'exhale';
    } else if (phase === 'hold1') {
      return 'exhale';
    } else if (phase === 'exhale') {
      return settings.hold2 > 0 ? 'hold2' : 'inhale';
    } else {
      return 'inhale';
    }
  };
  
  const toggleBreathing = () => {
    if (isActive) {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
      setIsActive(false);
    } else {
      setIsActive(true);
      setCurrentPhase('inhale');
    }
  };
  
  const resetBreathing = () => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
    }
    setIsActive(false);
    setCurrentPhase('inhale');
    setSecondsLeft(isCustom ? customSettings.inhale : BREATHING_TECHNIQUES[technique].inhale);
    setCompletedCycles(0);
    setTotalDuration(0);
    
    toast({
      title: language === 'en' ? 'Session Reset' : 'إعادة تعيين الجلسة',
      description: language === 'en' ? 'Breathing exercise has been reset.' : 'تم إعادة تعيين تمرين التنفس.',
    });
  };
  
  const handleTechniqueChange = (value: string) => {
    if (value === 'custom') {
      setIsCustom(true);
    } else {
      setIsCustom(false);
      setTechnique(value as BreathingTechnique);
      setSecondsLeft(BREATHING_TECHNIQUES[value as BreathingTechnique].inhale);
    }
    
    if (isActive) {
      toggleBreathing();
    }
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const getPhaseLabel = (phase: BreathingPhase) => {
    if (phase === 'inhale') {
      return language === 'en' ? 'Inhale' : 'استنشق';
    } else if (phase === 'hold1') {
      return language === 'en' ? 'Hold' : 'ا��بس';
    } else if (phase === 'exhale') {
      return language === 'en' ? 'Exhale' : 'زفير';
    } else {
      return language === 'en' ? 'Hold' : 'احبس';
    }
  };
  
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
          <div 
            ref={breathingCircleRef}
            className="w-32 h-32 rounded-full bg-blue-200 flex items-center justify-center mb-6 transition-all duration-1000"
          >
            <div className="text-center">
              <div className="text-2xl font-bold">{secondsLeft}</div>
              <div className="text-sm">{getPhaseLabel(currentPhase)}</div>
            </div>
          </div>
          
          <div className="flex gap-3 mb-6">
            <Button 
              onClick={toggleBreathing} 
              size="lg"
              className={isActive ? 'bg-amber-500 hover:bg-amber-600' : 'bg-emerald-500 hover:bg-emerald-600'}
            >
              {isActive 
                ? <><Pause className={`${language === 'ar' ? 'ml-2' : 'mr-2'} h-4 w-4`} /> {language === 'en' ? 'Pause' : 'توقف'}</>
                : <><Play className={`${language === 'ar' ? 'ml-2' : 'mr-2'} h-4 w-4`} /> {language === 'en' ? 'Start' : 'ابدأ'}</>
              }
            </Button>
            <Button onClick={resetBreathing} variant="outline" size="lg">
              <RefreshCw className={`${language === 'ar' ? 'ml-2' : 'mr-2'} h-4 w-4`} />
              {language === 'en' ? 'Reset' : 'إعادة تعيين'}
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className={`flex justify-between items-center ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
              <div className={`flex items-center gap-1 text-sm ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>
                  {language === 'en' ? 'Total Time: ' : 'الوقت الإجمالي: '}
                  {formatTime(totalDuration)}
                </span>
              </div>
              <div className={`flex items-center gap-1 text-sm ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                <BarChart className="h-4 w-4 text-muted-foreground" />
                <span>
                  {language === 'en' ? 'Cycles: ' : 'الدورات: '}
                  {completedCycles}
                </span>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className={language === 'ar' ? 'text-right block' : ''}>
                {language === 'en' ? 'Breathing Technique' : 'تقنية التنفس'}
              </Label>
              <Select 
                value={isCustom ? 'custom' : technique} 
                onValueChange={handleTechniqueChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder={language === 'en' ? 'Select technique' : 'اختر التقنية'} />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(BREATHING_TECHNIQUES).map(([key, { name }]) => (
                    <SelectItem key={key} value={key}>
                      {name}
                    </SelectItem>
                  ))}
                  <SelectItem value="custom">
                    {language === 'en' ? 'Custom' : 'مخصص'}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {isCustom && (
            <div className="space-y-3">
              <h3 className={`text-sm font-medium ${language === 'ar' ? 'text-right' : ''}`}>
                {language === 'en' ? 'Custom Settings (seconds)' : 'الإعدادات المخصصة (ثواني)'}
              </h3>
              
              <div className="space-y-2">
                <Label className={language === 'ar' ? 'text-right block' : ''}>
                  {language === 'en' ? 'Inhale' : 'استنشاق'} ({customSettings.inhale}s)
                </Label>
                <Slider
                  value={[customSettings.inhale]}
                  min={1}
                  max={10}
                  step={1}
                  onValueChange={(value) => setCustomSettings({...customSettings, inhale: value[0]})}
                />
              </div>
              
              <div className="space-y-2">
                <Label className={language === 'ar' ? 'text-right block' : ''}>
                  {language === 'en' ? 'Hold After Inhale' : 'احبس بعد الاستنشاق'} ({customSettings.hold1}s)
                </Label>
                <Slider
                  value={[customSettings.hold1]}
                  min={0}
                  max={10}
                  step={1}
                  onValueChange={(value) => setCustomSettings({...customSettings, hold1: value[0]})}
                />
              </div>
              
              <div className="space-y-2">
                <Label className={language === 'ar' ? 'text-right block' : ''}>
                  {language === 'en' ? 'Exhale' : 'زفير'} ({customSettings.exhale}s)
                </Label>
                <Slider
                  value={[customSettings.exhale]}
                  min={1}
                  max={10}
                  step={1}
                  onValueChange={(value) => setCustomSettings({...customSettings, exhale: value[0]})}
                />
              </div>
              
              <div className="space-y-2">
                <Label className={language === 'ar' ? 'text-right block' : ''}>
                  {language === 'en' ? 'Hold After Exhale' : 'احبس بعد الزفير'} ({customSettings.hold2}s)
                </Label>
                <Slider
                  value={[customSettings.hold2]}
                  min={0}
                  max={10}
                  step={1}
                  onValueChange={(value) => setCustomSettings({...customSettings, hold2: value[0]})}
                />
              </div>
            </div>
          )}
        </div>
        
        <div className="bg-muted/20 p-4 rounded-lg">
          <h3 className={`font-medium mb-2 ${language === 'ar' ? 'text-right' : ''}`}>
            {language === 'en' ? 'Benefits of Breathing Exercises' : 'فوائد تمارين التنفس'}
          </h3>
          <ul className={`text-sm space-y-1 list-disc ${language === 'ar' ? 'text-right pr-6' : 'list-inside'} text-muted-foreground`}>
            <li>
              {language === 'en' 
                ? 'Reduces stress and anxiety' 
                : 'تقليل التوتر والقلق'}
            </li>
            <li>
              {language === 'en' 
                ? 'Lowers blood pressure and heart rate' 
                : 'خفض ضغط الدم ومعدل ضربات القلب'}
            </li>
            <li>
              {language === 'en' 
                ? 'Improves focus and mental clarity' 
                : 'تحسين التركيز والوضوح الذهني'}
            </li>
            <li>
              {language === 'en' 
                ? 'Helps manage emotional responses' 
                : 'يساعد في إدارة الاستجابات العاطفية'}
            </li>
          </ul>
        </div>
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
