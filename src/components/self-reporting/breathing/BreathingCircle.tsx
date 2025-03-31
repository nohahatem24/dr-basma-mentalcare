
import React, { useRef, useEffect } from 'react';
import { useLanguage } from '@/components/Header';

type BreathingPhase = 'inhale' | 'hold1' | 'exhale' | 'hold2';

interface BreathingCircleProps {
  currentPhase: BreathingPhase;
  secondsLeft: number;
}

export const BreathingCircle = ({ currentPhase, secondsLeft }: BreathingCircleProps) => {
  const { language } = useLanguage();
  const breathingCircleRef = useRef<HTMLDivElement>(null);
  
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
  
  const getPhaseLabel = (phase: BreathingPhase) => {
    if (phase === 'inhale') {
      return language === 'en' ? 'Inhale' : 'استنشق';
    } else if (phase === 'hold1') {
      return language === 'en' ? 'Hold' : 'احبس';
    } else if (phase === 'exhale') {
      return language === 'en' ? 'Exhale' : 'زفير';
    } else {
      return language === 'en' ? 'Hold' : 'احبس';
    }
  };
  
  return (
    <div 
      ref={breathingCircleRef}
      className="w-32 h-32 rounded-full bg-blue-200 flex items-center justify-center mb-6 transition-all duration-1000"
    >
      <div className="text-center">
        <div className="text-2xl font-bold">{secondsLeft}</div>
        <div className="text-sm">{getPhaseLabel(currentPhase)}</div>
      </div>
    </div>
  );
};
