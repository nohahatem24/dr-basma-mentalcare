
import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from './Header';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/auto-carousel';

const Hero = () => {
  const { language } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);

  const carouselItems = useMemo(() => [
    {
      title: language === 'en' ? 'MindTrack' : 'مايند تراك',
      subtitle: language === 'en' ? 'Your personal mental wellness companion' : 'رفيقك الشخصي للصحة النفسية',
      description: language === 'en'
        ? 'Track your daily mood, identify triggers, and monitor your mental health journey with our intuitive tools.'
        : 'تتبع مزاجك اليومي، وتحديد المحفزات، ومراقبة رحلة صحتك النفسية مع أدواتنا البديهية.',
    },
    {
      title: language === 'en' ? 'Therapeutic Exercises' : 'التمارين العلاجية',
      subtitle: language === 'en' ? 'Evidence-based CBT techniques' : 'تقنيات العلاج المعرفي السلوكي المستندة إلى الأدلة',
      description: language === 'en'
        ? 'Practice proven exercises from Dr. Bassma\'s therapeutic methods to improve your mental well-being.'
        : 'ممارسة التمارين المثبتة من أساليب الدكتورة بسمة العلاجية لتحسين صحتك النفسية.',
    },
    {
      title: language === 'en' ? 'Online Sessions' : 'الجلسات عبر الإنترنت',
      subtitle: language === 'en' ? 'Connect with Dr. Bassma from anywhere' : 'تواصل مع د. بسمة من أي مكان',
      description: language === 'en'
        ? 'Book secure video sessions with Dr. Bassma and receive professional mental health support from the comfort of your home.'
        : 'احجز جلسات فيديو آمنة مع د. بسمة واحصل على دعم الصحة النفسية المهني من راحة منزلك.',
    },
  ], [language]);

  const handleSlideChange = (index: number) => {
    setActiveIndex(index);
  };

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
                ? 'Welcome to Dr. Bassma Mental Care. Track your emotional well-being and get personalized insights for better mental health.'
                : 'مرحبًا بك في مركز د. بسمة للرعاية النفسية. تتبع صحتك العاطفية واحصل على رؤى مخصصة لصحة نفسية أفضل.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="btn-primary" size="lg" asChild>
                <Link to="/book-appointment">
                  {language === 'en' ? 'Book a Session' : 'احجز جلسة'} <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/dashboard">
                  {language === 'en' ? 'Start Tracking' : 'ابدأ التتبع'}
                </Link>
              </Button>
            </div>
          </div>

          <div className="relative rounded-xl overflow-hidden shadow-xl animate-fade-in">
            <Carousel
              className="w-full overflow-hidden relative"
              autoplay={true}
              interval={5000}
              setApi={(api) => {
                api?.on('select', () => {
                  handleSlideChange(api.selectedScrollSnap());
                });
              }}
            >
              <CarouselContent className="flex transition-transform duration-100 ease-in-out">
                {carouselItems.map((item, index) => (
                  <CarouselItem key={index} className="flex-shrink-0 w-full relative">
                    <div className="aspect-video bg-gradient-to-br from-mindtrack-blue to-mindtrack-green opacity-80 rounded-xl"></div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6">
                      <div className="text-center max-w-md space-y-4">
                        <h2 className="text-2xl md:text-3xl font-bold mb-2">{item.title}</h2>
                        <p className="text-lg font-medium">{item.subtitle}</p>
                        <p className="text-sm md:text-base opacity-90">{item.description}</p>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                {carouselItems.map((_, index) => (
                  <span
                    key={index}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === activeIndex ? 'bg-white' : 'bg-white/60'
                    }`}
                  ></span>
                ))}
              </div>
            </Carousel>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
