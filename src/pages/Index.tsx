import React from 'react';
import Hero from '@/components/Hero';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/components/Header';
import BassmaAdelImage from '@/assets/images/BassmaAdel.jpg';

const Index = () => {
  const { language } = useLanguage();

  return (
    <div className="flex flex-col min-h-screen">
      <Hero />

      <section className="py-16 bg-accent/10">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6 header-gradient">
                {language === 'en' ? 'Meet Dr. Bassma Adel' : 'تعرف على د. بسمة عادل'}
              </h2>
              <p className="text-muted-foreground mb-6">
                {language === 'en'
                  ? 'Specialized in anxiety, depression, family counseling, and more. Dr. Bassma combines her expertise in positive psychology with clinical experience to provide compassionate mental health care.'
                  : 'متخصصة في القلق والاكتئاب والاستشارات العائلية والمزيد. تجمع د. بسمة بين خبرتها في علم النفس الإيجابي والخبرة السريرية لتقديم رعاية صحية نفسية رحيمة.'}
              </p>
              <Button asChild className="btn-secondary">
                <Link to="/about">{language === 'en' ? 'Learn More About Dr. Bassma' : 'تعرف أكثر على د. بسمة'}</Link>
              </Button>
            </div>
            <div className="relative rounded-xl overflow-hidden">
              <img 
                src={BassmaAdelImage} 
                alt={language === 'en' ? 'Dr. Bassma Adel' : 'د. بسمة عادل'} 
                className="w-full h-full object-cover" 
              />
              <div className="absolute inset-0 flex items-center justify-center text-white/90">
                <div className="text-center">
                  {/* Removed the span with the name */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
