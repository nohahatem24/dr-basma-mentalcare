
import React from 'react';
import { useLanguage } from '@/components/Header';

const SelfReportingHeader = () => {
  const { language } = useLanguage();

  return (
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
  );
};

export default SelfReportingHeader;
