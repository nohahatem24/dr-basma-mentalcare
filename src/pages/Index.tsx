
import React from 'react';
import Hero from '@/components/Hero';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Heart, LineChart, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/components/Header';

const Index = () => {
  const { language } = useLanguage();
  
  const features = [
    {
      icon: <Brain className="h-10 w-10 text-mindtrack-blue" />,
      title: language === 'en' ? 'Mood Tracking' : 'تتبع المزاج',
      description: language === 'en' 
        ? 'Log and monitor your daily mood patterns with our intuitive tracking system.' 
        : 'سجل وراقب أنماط مزاجك اليومية من خلال نظام التتبع البديهي لدينا.',
    },
    {
      icon: <LineChart className="h-10 w-10 text-mindtrack-green" />,
      title: language === 'en' ? 'AI-Powered Insights' : 'رؤى مدعومة بالذكاء الاصطناعي',
      description: language === 'en' 
        ? 'Receive personalized insights and patterns based on your emotional data.' 
        : 'احصل على رؤى وأنماط مخصصة بناءً على بياناتك العاطفية.',
    },
    {
      icon: <Heart className="h-10 w-10 text-mindtrack-lavender" />,
      title: language === 'en' ? 'CBT Tools' : 'أدوات العلاج السلوكي المعرفي',
      description: language === 'en' 
        ? 'Access cognitive behavioral therapy exercises to improve thought patterns.' 
        : 'الوصول إلى تمارين العلاج المعرفي السلوكي لتحسين أنماط التفكير.',
    },
    {
      icon: <ShieldCheck className="h-10 w-10 text-mindtrack-blue" />,
      title: language === 'en' ? 'Secure & Private' : 'آمن وخاص',
      description: language === 'en' 
        ? 'Your data is encrypted and only accessible to you and Dr. Bassma.' 
        : 'بياناتك مشفرة ولا يمكن الوصول إليها إلا لك ولدكتورة بسمة.',
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
              ? 'MindTrack provides you with tools and insights to understand your emotional patterns and improve your mental well-being under the guidance of Dr. Bassma Adel.'
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
                {language === 'en' ? 'Meet Dr. Bassma Adel' : 'تعرف على د. بسمة عادل'}
              </h2>
              <p className="text-muted-foreground mb-6">
                {language === 'en'
                  ? 'Specialized in anxiety, depression, family counseling, and more. Dr. Bassma combines her expertise in positive psychology with clinical experience to provide compassionate mental health care.'
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
                <Link to="/about">{language === 'en' ? 'Learn More About Dr. Bassma' : 'تعرف أكثر على د. بسمة'}</Link>
              </Button>
            </div>
            <div className="relative rounded-xl overflow-hidden">
              <div className="aspect-square bg-gradient-to-br from-mindtrack-lavender/50 to-mindtrack-blue/50 rounded-xl"></div>
              <div className="absolute inset-0 flex items-center justify-center text-white/90">
                <div className="text-center">
                  <span className="text-xl font-semibold">{language === 'en' ? 'Dr. Bassma Adel' : 'د. بسمة عادل'}</span>
                </div>
              </div>
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
