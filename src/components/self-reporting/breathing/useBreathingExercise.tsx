
import { useState, useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/components/Header';

export type BreathingPhase = 'inhale' | 'hold1' | 'exhale' | 'hold2';
export type BreathingTechnique = 'box' | '4-7-8' | 'deep' | 'calm' | string;

// Breathing technique presets
export const BREATHING_TECHNIQUES = {
  'box': { name: 'Box Breathing', inhale: 4, hold1: 4, exhale: 4, hold2: 4 },
  '4-7-8': { name: '4-7-8 Technique', inhale: 4, hold1: 7, exhale: 8, hold2: 0 },
  'deep': { name: 'Deep Breathing', inhale: 5, hold1: 2, exhale: 5, hold2: 0 },
  'calm': { name: 'Calming Breath', inhale: 4, hold1: 0, exhale: 6, hold2: 0 },
};

export const useBreathingExercise = () => {
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
    
    const settings = isCustom ? customSettings : BREATHING_TECHNIQUES[technique as keyof typeof BREATHING_TECHNIQUES];
    
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
    setSecondsLeft(isCustom ? customSettings.inhale : BREATHING_TECHNIQUES[technique as keyof typeof BREATHING_TECHNIQUES].inhale);
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
      setSecondsLeft(BREATHING_TECHNIQUES[value as keyof typeof BREATHING_TECHNIQUES].inhale);
    }
    
    if (isActive) {
      toggleBreathing();
    }
  };

  const handleCustomSettingsChange = (settings: typeof customSettings) => {
    setCustomSettings(settings);
  };
  
  return {
    isActive,
    technique,
    currentPhase,
    secondsLeft,
    completedCycles,
    totalDuration,
    customSettings,
    isCustom,
    BREATHING_TECHNIQUES,
    toggleBreathing,
    resetBreathing,
    handleTechniqueChange,
    handleCustomSettingsChange
  };
};
