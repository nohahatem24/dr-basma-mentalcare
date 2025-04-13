
import React from 'react';
import { useLanguage } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Brain, BookOpen, Heart, Target, Wind, Activity, BarChart3, FileText, Leaf } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface MindTrackNavProps {
  activePage?: string;
}

const MindTrackNavigation: React.FC<MindTrackNavProps> = ({ activePage }) => {
  const { language } = useLanguage();
  const location = useLocation();

  const getBasePath = () => {
    return '/dashboard'; // Now everything is under dashboard
  };

  const navItems = [
    {
      id: 'mood',
      label: language === 'en' ? 'Mood Tracker' : 'متتبع المزاج',
      icon: <Brain className="mr-2 h-4 w-4" />,
      path: `${getBasePath()}?tab=mood`
    },
    {
      id: 'journal',
      label: language === 'en' ? 'Journal' : 'المذكرات',
      icon: <BookOpen className="mr-2 h-4 w-4" />,
      path: `${getBasePath()}?tab=journal`
    },
    {
      id: 'gratitude',
      label: language === 'en' ? 'Gratitude' : 'الامتنان',
      icon: <Heart className="mr-2 h-4 w-4" />,
      path: `${getBasePath()}?tab=gratitude`
    },
    {
      id: 'breathing',
      label: language === 'en' ? 'Guided Breathing' : 'التنفس الموجّه',
      icon: <Wind className="mr-2 h-4 w-4" />,
      path: `${getBasePath()}?tab=breathing`
    },
    {
      id: 'cpt',
      label: language === 'en' ? 'CPT Techniques' : 'تقنيات المعالجة المعرفية',
      icon: <Activity className="mr-2 h-4 w-4" />,
      path: `${getBasePath()}?tab=cpt`
    },
    {
      id: 'therapeutic',
      label: language === 'en' ? 'Therapeutic Exercises' : 'التمارين العلاجية',
      icon: <Leaf className="mr-2 h-4 w-4" />,
      path: `${getBasePath()}?tab=therapeutic`
    },
    {
      id: 'relationship',
      label: language === 'en' ? 'Relationship Tracker' : 'متتبع العلاقات',
      icon: <BarChart3 className="mr-2 h-4 w-4" />,
      path: `${getBasePath()}?tab=relationship`
    },
    {
      id: 'goals',
      label: language === 'en' ? 'Goals' : 'الأهداف',
      icon: <Target className="mr-2 h-4 w-4" />,
      path: `${getBasePath()}?tab=goals`
    },
    {
      id: 'report',
      label: language === 'en' ? 'Mental Health Report' : 'تقرير الصحة النفسية',
      icon: <FileText className="mr-2 h-4 w-4" />,
      path: `${getBasePath()}?tab=report`
    }
  ];

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium">
        {language === 'en' ? 'MindTrack Tools' : 'أدوات مايند تراك'}
      </h3>
      <div className="max-h-[calc(100vh-200px)] overflow-y-auto pr-1">
        <ul className="space-y-1">
          {navItems.map(item => (
            <li key={item.id}>
              <Button 
                variant="ghost" 
                className={`w-full justify-start ${activePage === item.id ? 'bg-accent/50' : ''} ${language === 'ar' ? 'flex-row-reverse' : ''}`}
                asChild
              >
                <Link to={item.path}>
                  {language === 'ar' ? (
                    <>
                      <span>{item.label}</span>
                      {React.cloneElement(item.icon, { className: "ml-2 h-4 w-4" })}
                    </>
                  ) : (
                    <>
                      {item.icon}
                      <span>{item.label}</span>
                    </>
                  )}
                </Link>
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MindTrackNavigation;
