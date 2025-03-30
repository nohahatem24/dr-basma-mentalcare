
import React from 'react';
import { useLanguage } from '@/components/Header';
import MentalHealthReport from '@/components/MentalHealthReport';
import TherapeuticExercises from '@/components/TherapeuticExercises';
import RelationshipTracker from '@/components/RelationshipTracker';
import MoodTracker from '@/components/MoodTracker';
import CPTTechniques from '@/components/CPTTechniques';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card-component';

const SelfReporting = () => {
  const { language } = useLanguage();

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold header-gradient mb-2">
          {language === 'en' ? 'Self-Reporting Tools' : 'أدوات التقييم الذاتي'}
        </h1>
        <p className="text-muted-foreground">
          {language === 'en'
            ? 'Track your mental wellbeing, generate reports, and manage your therapeutic journey'
            : 'تتبع صحتك النفسية، وإنشاء التقارير، وإدارة رحلتك العلاجية'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-3">
          <MentalHealthReport />
        </div>

        <div className="md:col-span-3">
          <CPTTechniques />
        </div>

        <div className="md:col-span-2 space-y-8">
          <MoodTracker />
          <RelationshipTracker />
        </div>

        <div className="space-y-8">
          <TherapeuticExercises />
          <Card className="p-6 bg-accent/10 rounded-lg">
            <h3 className="text-xl font-semibold mb-3">
              {language === 'en' ? 'Need Professional Help?' : 'بحاجة إلى مساعدة مهنية؟'}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {language === 'en'
                ? 'Self-reporting is helpful, but sometimes talking to a professional can make a big difference.'
                : 'التقييم الذاتي مفيد، ولكن أحيانًا يمكن أن يحدث التحدث مع مختص فرقًا كبيرًا.'}
            </p>
            <Button asChild className="w-full">
              <Link to="/book-appointment">
                {language === 'en' ? 'Book an Appointment' : 'حجز موعد'}
              </Link>
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SelfReporting;
