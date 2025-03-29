import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { Globe } from 'lucide-react';

interface LanguageSwitcherProps {
  variant?: 'icon' | 'text' | 'full';
  className?: string;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  variant = 'icon',
  className = '',
}) => {
  const { lang, toggleLanguage, t, isRTL } = useTranslation();
  
  const languageText = lang === 'ar' ? 'العربية' : 'English';
  const switchText = lang === 'ar' ? t('switchToEnglish') : t('switchToArabic');
  
  const renderContent = () => {
    switch (variant) {
      case 'icon':
        return <Globe className="w-5 h-5" />;
      case 'text':
        return <span>{languageText}</span>;
      case 'full':
        return (
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            <span>{languageText}</span>
          </div>
        );
      default:
        return <Globe className="w-5 h-5" />;
    }
  };
  
  return (
    <button
      onClick={toggleLanguage}
      className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background hover:bg-accent hover:text-accent-foreground p-2 ${className}`}
      title={switchText}
      aria-label={switchText}
    >
      {renderContent()}
    </button>
  );
}; 