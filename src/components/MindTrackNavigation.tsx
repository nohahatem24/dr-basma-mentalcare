
import React from 'react';
import { useLanguage } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Brain, BookOpen, Heart, Target } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface MindTrackNavProps {
  activePage?: string;
}

const MindTrackNavigation: React.FC<MindTrackNavProps> = ({ activePage }) => {
  const { language } = useLanguage();
  const location = useLocation();

  const getBasePath = () => {
    // If we're already in dashboard, use that path
    if (location.pathname.includes('/dashboard')) {
      return '/dashboard';
    }
    return '/mindtrack'; // Future dedicated MindTrack page
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
      label: language === 'en' ? 'Journal' : 'مذكرات',
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
      id: 'goals',
      label: language === 'en' ? 'Goals' : 'الأهداف',
      icon: <Target className="mr-2 h-4 w-4" />,
      path: `${getBasePath()}?tab=goals`
    },
  ];

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium">
        {language === 'en' ? 'Quick Access' : 'وصول سريع'}
      </h3>
      <ul className="space-y-1">
        {navItems.map(item => (
          <li key={item.id}>
            <Button 
              variant="ghost" 
              className={`w-full justify-start ${activePage === item.id ? 'bg-accent/50' : ''}`}
              asChild
            >
              <Link to={item.path}>
                {item.icon}
                <span>{item.label}</span>
              </Link>
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MindTrackNavigation;
