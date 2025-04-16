
import React, { useRef, useEffect } from 'react';
import { useLanguage } from '@/components/Header';

interface AnimatedBreathingCircleProps {
  currentPhase: 'inhale' | 'hold1' | 'exhale' | 'hold2';
  secondsLeft: number;
  totalSeconds: number;
}

const AnimatedBreathingCircle: React.FC<AnimatedBreathingCircleProps> = ({ 
  currentPhase, 
  secondsLeft,
  totalSeconds 
}) => {
  const { language } = useLanguage();
  const circleRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<SVGCircleElement>(null);
  
  // Animation effect for the circle size based on breathing phase
  useEffect(() => {
    if (!circleRef.current) return;
    
    const circle = circleRef.current;
    
    // Different animations for different phases
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
  
  // Progress circle animation
  useEffect(() => {
    if (!progressRef.current) return;
    
    const progress = progressRef.current;
    const radius = 58;
    const circumference = 2 * Math.PI * radius;
    
    // Calculate the progress percentage
    const progressPercentage = secondsLeft / totalSeconds;
    const offset = circumference * (1 - progressPercentage);
    
    progress.style.strokeDasharray = `${circumference}`;
    progress.style.strokeDashoffset = `${offset}`;
  }, [secondsLeft, totalSeconds]);

  // Get appropriate label for the current breathing phase
  const getPhaseLabel = (): string => {
    switch(currentPhase) {
      case 'inhale':
        return language === 'en' ? 'Inhale' : 'استنشق';
      case 'hold1':
      case 'hold2':
        return language === 'en' ? 'Hold' : 'امسك';
      case 'exhale':
        return language === 'en' ? 'Exhale' : 'زفير';
      default:
        return '';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative mb-4">
        {/* SVG Progress Circle */}
        <svg width="160" height="160" className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -rotate-90">
          <circle 
            cx="80" 
            cy="80" 
            r="58" 
            fill="none" 
            stroke="rgba(72, 149, 239, 0.2)" 
            strokeWidth="4"
          />
          <circle 
            ref={progressRef}
            cx="80" 
            cy="80" 
            r="58" 
            fill="none" 
            stroke="rgba(72, 149, 239, 0.8)" 
            strokeWidth="4"
            strokeLinecap="round"
            className="transition-all duration-300 ease-linear"
          />
        </svg>
        
        {/* Breathing Circle */}
        <div 
          ref={circleRef}
          className="w-32 h-32 rounded-full bg-blue-200 flex items-center justify-center transition-all duration-1000 z-10 relative"
        >
          <div className="text-center">
            <div className="text-2xl font-bold">{secondsLeft}</div>
            <div className="text-sm">{getPhaseLabel()}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimatedBreathingCircle;
