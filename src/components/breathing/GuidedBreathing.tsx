
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/components/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Play, Pause, RotateCw, Wind } from 'lucide-react';
import AnimatedBreathingCircle from './AnimatedBreathingCircle';

interface BreathingExercise {
  id: string;
  name: string;
  inhale: number;
  hold1: number;
  exhale: number;
  hold2: number;
  cycles: number;
  description: {
    en: string;
    ar: string;
  };
  benefits: {
    en: string[];
    ar: string[];
  };
}

const GuidedBreathing = () => {
  const { language } = useLanguage();
  const [selectedExercise, setSelectedExercise] = useState<BreathingExercise | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<'inhale' | 'hold1' | 'exhale' | 'hold2'>('inhale');
  const [timer, setTimer] = useState(0);
  const [totalSeconds, setTotalSeconds] = useState(4); // For the progress animation
  const [currentCycle, setCurrentCycle] = useState(1);
  const [customInhale, setCustomInhale] = useState(4);
  const [customHold1, setCustomHold1] = useState(4);
  const [customExhale, setCustomExhale] = useState(4);
  const [customHold2, setCustomHold2] = useState(0);
  const [customCycles, setCustomCycles] = useState(5);

  const breathingExercises: BreathingExercise[] = [
    {
      id: 'box',
      name: language === 'en' ? 'Box Breathing' : 'تنفس الصندوق',
      inhale: 4,
      hold1: 4,
      exhale: 4,
      hold2: 4,
      cycles: 5,
      description: {
        en: 'Box breathing is a technique used to calm the nervous system. It helps to clear the mind, relax the body, and improve focus.',
        ar: 'تنفس الصندوق هو تقنية تستخدم لتهدئة الجهاز العصبي. يساعد على تصفية العقل واسترخاء الجسم وتحسين التركيز.'
      },
      benefits: {
        en: ['Reduces stress', 'Improves concentration', 'Helps manage anxiety'],
        ar: ['يقلل التوتر', 'يحسن التركيز', 'يساعد في إدارة القلق']
      }
    },
    {
      id: '478',
      name: language === 'en' ? '4-7-8 Breathing' : 'تنفس 4-7-8',
      inhale: 4,
      hold1: 7,
      exhale: 8,
      hold2: 0,
      cycles: 4,
      description: {
        en: 'The 4-7-8 breathing technique is a breathing pattern developed to help people fall asleep quicker and reduce anxiety.',
        ar: 'تقنية التنفس 4-7-8 هي نمط تنفس تم تطويره لمساعدة الناس على النوم بشكل أسرع وتقليل القلق.'
      },
      benefits: {
        en: ['Promotes better sleep', 'Reduces anxiety', 'Manages stress', 'Improves mood'],
        ar: ['يعزز نوم أفضل', 'يقلل القلق', 'يدير التوتر', 'يحسن المزاج']
      }
    },
    {
      id: 'custom',
      name: language === 'en' ? 'Custom Exercise' : 'تمرين مخصص',
      inhale: customInhale,
      hold1: customHold1,
      exhale: customExhale,
      hold2: customHold2,
      cycles: customCycles,
      description: {
        en: 'Create your own custom breathing pattern based on your needs.',
        ar: 'أنشئ نمط التنفس المخصص الخاص بك بناءً على احتياجاتك.'
      },
      benefits: {
        en: ['Personalized experience', 'Adapt to your specific needs'],
        ar: ['تجربة مخصصة', 'التكيف مع احتياجاتك الخاصة']
      }
    }
  ];

  // Initialize with box breathing
  useEffect(() => {
    if (!selectedExercise && breathingExercises.length > 0) {
      setSelectedExercise(breathingExercises[0]);
      setTimer(breathingExercises[0].inhale);
      setTotalSeconds(breathingExercises[0].inhale);
    }
  }, []);

  // Reset timer when changing exercises
  useEffect(() => {
    if (selectedExercise) {
      setTimer(selectedExercise.inhale);
      setTotalSeconds(selectedExercise.inhale);
      setCurrentPhase('inhale');
      setCurrentCycle(1);
    }
  }, [selectedExercise]);

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && selectedExercise) {
      interval = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer <= 0) {
            // Move to next phase
            let nextPhase: 'inhale' | 'hold1' | 'exhale' | 'hold2' = 'inhale';
            let nextTimer = 0;
            let nextCycle = currentCycle;

            switch (currentPhase) {
              case 'inhale':
                nextPhase = 'hold1';
                nextTimer = selectedExercise.hold1;
                setTotalSeconds(selectedExercise.hold1);
                break;
              case 'hold1':
                nextPhase = 'exhale';
                nextTimer = selectedExercise.exhale;
                setTotalSeconds(selectedExercise.exhale);
                break;
              case 'exhale':
                if (selectedExercise.hold2 > 0) {
                  nextPhase = 'hold2';
                  nextTimer = selectedExercise.hold2;
                  setTotalSeconds(selectedExercise.hold2);
                } else {
                  nextPhase = 'inhale';
                  nextTimer = selectedExercise.inhale;
                  setTotalSeconds(selectedExercise.inhale);
                  if (currentCycle >= selectedExercise.cycles) {
                    setIsRunning(false);
                    return 0;
                  }
                  nextCycle += 1;
                }
                break;
              case 'hold2':
                nextPhase = 'inhale';
                nextTimer = selectedExercise.inhale;
                setTotalSeconds(selectedExercise.inhale);
                if (currentCycle >= selectedExercise.cycles) {
                  setIsRunning(false);
                  return 0;
                }
                nextCycle += 1;
                break;
            }

            setCurrentPhase(nextPhase);
            setCurrentCycle(nextCycle);
            return nextTimer;
          }
          return prevTimer - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, currentPhase, currentCycle, selectedExercise]);

  // Update custom exercise when sliders change
  useEffect(() => {
    if (selectedExercise?.id === 'custom') {
      setSelectedExercise({
        ...selectedExercise,
        inhale: customInhale,
        hold1: customHold1,
        exhale: customExhale,
        hold2: customHold2,
        cycles: customCycles
      });
    }
  }, [customInhale, customHold1, customExhale, customHold2, customCycles]);

  const handleStart = () => {
    if (!selectedExercise) return;
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    if (selectedExercise) {
      setTimer(selectedExercise.inhale);
      setTotalSeconds(selectedExercise.inhale);
      setCurrentPhase('inhale');
      setCurrentCycle(1);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {breathingExercises.map((exercise) => (
          <Card
            key={exercise.id}
            className={`cursor-pointer transition-all ${
              selectedExercise?.id === exercise.id
                ? 'border-primary bg-primary/5'
                : 'hover:border-primary/50'
            }`}
            onClick={() => setSelectedExercise(exercise)}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">{exercise.name}</h3>
                <Wind className="h-5 w-5 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                {language === 'en' ? exercise.description.en : exercise.description.ar}
              </p>
              <div className="text-xs">
                {language === 'en' ? 'Pattern: ' : 'النمط: '}
                <span className="font-medium">
                  {exercise.inhale}-{exercise.hold1}-{exercise.exhale}
                  {exercise.hold2 > 0 ? `-${exercise.hold2}` : ''}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedExercise?.id === 'custom' && (
        <Card className="p-6">
          <h3 className="font-semibold mb-4">
            {language === 'en' ? 'Customize Your Breathing' : 'تخصيص التنفس الخاص بك'}
          </h3>
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>
                  {language === 'en' ? 'Inhale (seconds)' : 'استنشاق (ثوان)'}
                </Label>
                <span>{customInhale}</span>
              </div>
              <Slider
                value={[customInhale]}
                min={2}
                max={10}
                step={1}
                onValueChange={(value) => setCustomInhale(value[0])}
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>
                  {language === 'en' ? 'Hold (seconds)' : 'امسك (ثوان)'}
                </Label>
                <span>{customHold1}</span>
              </div>
              <Slider
                value={[customHold1]}
                min={0}
                max={10}
                step={1}
                onValueChange={(value) => setCustomHold1(value[0])}
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>
                  {language === 'en' ? 'Exhale (seconds)' : 'زفير (ثوان)'}
                </Label>
                <span>{customExhale}</span>
              </div>
              <Slider
                value={[customExhale]}
                min={2}
                max={12}
                step={1}
                onValueChange={(value) => setCustomExhale(value[0])}
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>
                  {language === 'en' ? 'Hold after exhale (seconds)' : 'امسك بعد الزفير (ثوان)'}
                </Label>
                <span>{customHold2}</span>
              </div>
              <Slider
                value={[customHold2]}
                min={0}
                max={10}
                step={1}
                onValueChange={(value) => setCustomHold2(value[0])}
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>
                  {language === 'en' ? 'Number of cycles' : 'عدد الدورات'}
                </Label>
                <span>{customCycles}</span>
              </div>
              <Slider
                value={[customCycles]}
                min={1}
                max={10}
                step={1}
                onValueChange={(value) => setCustomCycles(value[0])}
              />
            </div>
          </div>
        </Card>
      )}

      {selectedExercise && (
        <Card className="p-6">
          <div className="flex flex-col items-center justify-center">
            {/* Animated Breathing Circle */}
            <AnimatedBreathingCircle 
              currentPhase={currentPhase}
              secondsLeft={timer}
              totalSeconds={totalSeconds}
            />
            
            <div className="flex justify-center space-x-4 my-6">
              {!isRunning ? (
                <Button onClick={handleStart} size="lg">
                  <Play className="h-5 w-5 mr-2" />
                  {language === 'en' ? 'Start' : 'ابدأ'}
                </Button>
              ) : (
                <Button onClick={handlePause} size="lg" variant="outline">
                  <Pause className="h-5 w-5 mr-2" />
                  {language === 'en' ? 'Pause' : 'إيقاف مؤقت'}
                </Button>
              )}
              <Button onClick={handleReset} size="lg" variant="outline">
                <RotateCw className="h-5 w-5 mr-2" />
                {language === 'en' ? 'Reset' : 'إعادة ضبط'}
              </Button>
            </div>
            <div className="text-sm text-muted-foreground">
              {language === 'en' 
                ? `Cycle ${currentCycle} of ${selectedExercise.cycles}` 
                : `الدورة ${currentCycle} من ${selectedExercise.cycles}`}
            </div>
          </div>
        </Card>
      )}

      {selectedExercise && (
        <Card className="p-6">
          <h3 className="font-semibold mb-4">
            {language === 'en' ? 'Benefits' : 'الفوائد'}
          </h3>
          <ul className="list-disc list-inside space-y-2">
            {(language === 'en' ? selectedExercise.benefits.en : selectedExercise.benefits.ar).map((benefit, index) => (
              <li key={index} className="text-sm">{benefit}</li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
};

export default GuidedBreathing;
