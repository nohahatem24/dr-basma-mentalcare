
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from './Header';

const Hero = () => {
  const { language } = useLanguage();
  
  return (
    <div className="relative overflow-hidden bg-background">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-mindtrack-blue/10 to-mindtrack-green/10 animate-pulse-slow"></div>
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-mindtrack-lavender/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-mindtrack-blue/10 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
      </div>

      <div className="container relative z-10 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              <span className="header-gradient">
                {language === 'en' ? 'Track, Understand, Heal' : 'تتبع، افهم، اشفِ'}
              </span>
            </h1>
            <p className="text-xl text-muted-foreground">
              {language === 'en' 
                ? 'Welcome to Dr. Besma Mental Hub. Track your emotional well-being and get personalized insights for better mental health.'
                : 'مرحبًا بك في مركز د. بسمة للصحة النفسية. تتبع صحتك العاطفية واحصل على رؤى مخصصة لصحة نفسية أفضل.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="btn-primary" size="lg" asChild>
                <Link to="/dashboard">
                  {language === 'en' ? 'Start Tracking' : 'ابدأ التتبع'} <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/about">
                  {language === 'en' ? 'Learn More' : 'اعرف المزيد'}
                </Link>
              </Button>
            </div>
          </div>

          <div className="relative rounded-xl overflow-hidden shadow-xl animate-fade-in">
            <div className="aspect-video bg-gradient-to-br from-mindtrack-blue to-mindtrack-green opacity-80 rounded-xl"></div>
            <div className="absolute inset-0 flex items-center justify-center text-white">
              <div className="text-center p-6">
                <h2 className="text-2xl font-bold mb-4">
                  {language === 'en' ? 'MindTrack' : 'مايند تراك'}
                </h2>
                <p className="mb-6">
                  {language === 'en' 
                    ? 'Your personal mental wellness companion' 
                    : 'رفيقك الشخصي للصحة النفسية'}
                </p>
                <div className="flex justify-center space-x-2">
                  <span className="w-3 h-3 bg-white rounded-full"></span>
                  <span className="w-3 h-3 bg-white/60 rounded-full"></span>
                  <span className="w-3 h-3 bg-white/60 rounded-full"></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
