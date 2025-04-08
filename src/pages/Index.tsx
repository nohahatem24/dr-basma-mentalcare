import React from 'react';
import Hero from '@/components/Hero';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Heart, LineChart, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/components/Header';
import BasmaAdelImage from '@/assets/images/BasmaAdel.jpg';

const Index = () => {
  const { language } = useLanguage();
  
  const features = [
    {
      icon: <Brain className="h-10 w-10 text-mindtrack-blue" />,
      title: language === 'en' ? 'Online Sessions' : 'جلسات عبر الإنترنت',
      description: language === 'en'
        ? 'Book personalized online sessions with Dr. Basma to address your mental health needs from the comfort of your home.'
        : 'احجز جلسات شخصية عبر الإنترنت مع الدكتورة بسمة لتلبية احتياجات صحتك النفسية من راحة منزلك.',
    },
    {
      icon: <LineChart className="h-10 w-10 text-mindtrack-green" />,
      title: language === 'en' ? 'Flexible Scheduling' : 'جدولة مرنة',
      description: language === 'en'
        ? 'Choose session times that fit your schedule and get the support you need.'
        : 'اختر أوقات الجلسات التي تناسب جدولك واحصل على الدعم الذي تحتاجه.',
    },
    {
      icon: <Heart className="h-10 w-10 text-mindtrack-lavender" />,
      title: language === 'en' ? 'Compassionate Care' : 'رعاية رحيمة',
      description: language === 'en'
        ? 'Experience empathetic and professional guidance tailored to your well-being.'
        : 'احصل على إرشاد متعاطف ومهني مصمم خصيصًا لرفاهيتك.',
    },
    {
      icon: <ShieldCheck className="h-10 w-10 text-mindtrack-blue" />,
      title: language === 'en' ? 'Secure & Confidential' : 'آمن وسري',
      description: language === 'en'
        ? 'Your online sessions are private and conducted in a secure environment.'
        : 'جلساتك عبر الإنترنت خاصة وتتم في بيئة آمنة.',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Hero />

      <section className="py-16 container">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold mb-4 header-gradient">
            {language === 'en' ? 'Nurture Your Mental Health' : 'رعاية صحتك النفسية'}
          </h2>
          <p className="text-muted-foreground">
            {language === 'en'
              ? 'MindTrack provides you with tools and insights to understand your emotional patterns and improve your mental well-being under the guidance of Dr. Basma Adel.'
              : 'يوفر مايند تراك لك الأدوات والرؤى لفهم أنماطك العاطفية وتحسين صحتك النفسية تحت إشراف الدكتورة بسمة عادل.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="card-hover">
              <CardHeader>
                <div className="mb-2">{feature.icon}</div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="py-16 bg-accent/10">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6 header-gradient">
                {language === 'en' ? 'Meet Dr. Basma Adel' : 'تعرف على د. بسمة عادل'}
              </h2>
              <p className="text-muted-foreground mb-6">
                {language === 'en'
                  ? 'Specialized in anxiety, depression, family counseling, and more. Dr. Basma combines her expertise in positive psychology with clinical experience to provide compassionate mental health care.'
                  : 'متخصصة في القلق والاكتئاب والاستشارات العائلية والمزيد. تجمع د. بسمة بين خبرتها في علم النفس الإيجابي والخبرة السريرية لتقديم رعاية صحية نفسية رحيمة.'}
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <span className="text-mindtrack-green mr-2">✓</span>
                  <span>{language === 'en' ? 'Master\'s Degree in Positive Psychology' : 'درجة الماجستير في علم النفس الإيجابي'}</span>
                </li>
                <li className="flex items-start">
                  <span className="text-mindtrack-green mr-2">✓</span>
                  <span>{language === 'en' ? 'Clinical Psychology Diploma' : 'دبلوم علم النفس السريري'}</span>
                </li>
                <li className="flex items-start">
                  <span className="text-mindtrack-green mr-2">✓</span>
                  <span>{language === 'en' ? 'Member of Professional Psychological Associations' : 'عضو في الجمعيات النفسية المهنية'}</span>
                </li>
              </ul>
              <Button asChild className="btn-secondary">
                <Link to="/about">{language === 'en' ? 'Learn More About Dr. Basma' : 'تعرف أكثر على د. بسمة'}</Link>
              </Button>
            </div>
            <div className="relative rounded-xl overflow-hidden">
              <img 
                src={BasmaAdelImage} 
                alt={language === 'en' ? 'Dr. Basma Adel' : 'د. بسمة عادل'} 
                className="h-full w-full object-cover" 
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 container">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-4 header-gradient">
            {language === 'en' ? 'Start Your Mental Health Journey Today' : 'ابدأ رحلة صحتك النفسية اليوم'}
          </h2>
          <p className="text-muted-foreground mb-8">
            {language === 'en'
              ? 'Track your moods, identify triggers, practice gratitude, and access personalized mental health tools - all in one secure platform.'
              : 'تتبع مزاجك، وتحديد المحفزات، وممارسة الامتنان، والوصول إلى أدوات الصحة النفسية المخصصة - كل ذلك في منصة آمنة واحدة.'}
          </p>
          <Button className="btn-primary" size="lg" asChild>
            <Link to="/dashboard">{language === 'en' ? 'Get Started with MindTrack' : 'ابدأ مع مايند تراك'}</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;
