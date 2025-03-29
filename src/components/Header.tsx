
import React, { useState, useContext, createContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, Moon, Sun, Globe, MessageCircle, FileText } from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';
import NotificationSystem from './NotificationSystem';

// Create a context to share language state throughout the app
export type LanguageType = 'en' | 'ar';
export const LanguageContext = createContext<{
  language: LanguageType;
  setLanguage: React.Dispatch<React.SetStateAction<LanguageType>>;
}>({
  language: 'en',
  setLanguage: () => {},
});

export const useLanguage = () => useContext(LanguageContext);

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState<LanguageType>('en');
  const location = useLocation();
  const { theme, setTheme } = useTheme();

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleLanguage = () => setLanguage(language === 'en' ? 'ar' : 'en');
  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  const routes = [
    { path: '/', label: language === 'en' ? 'Home' : 'الرئيسية' },
    { path: '/about', label: language === 'en' ? 'About' : 'عن الدكتورة' },
    { path: '/services', label: language === 'en' ? 'Services' : 'الخدمات' },
    { path: '/dashboard', label: language === 'en' ? 'MindTrack' : 'مايند تراك' },
    { path: '/self-reporting', label: language === 'en' ? 'Self-Reporting' : 'التقييم الذاتي' },
    { path: '/contact', label: language === 'en' ? 'Contact' : 'التواصل' },
  ];

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      <header className={`sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 ${language === 'ar' ? 'arabic text-right' : ''}`}>
        <div className="container flex h-16 items-center">
          <div className="flex items-center justify-between w-full">
            <Link to="/" className="flex items-center gap-2">
              <span className="font-montserrat text-xl font-bold header-gradient">
                {language === 'en' ? 'Dr. Bassma Mental Hub' : 'مركز د. بسمة للصحة النفسية'}
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              {routes.map((route) => (
                <Link
                  key={route.path}
                  to={route.path}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    location.pathname === route.path ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  {route.label}
                </Link>
              ))}
            </nav>

            <div className="hidden md:flex items-center gap-4">
              <NotificationSystem />
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleLanguage}
                aria-label="Toggle Language"
              >
                <Globe className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                aria-label="Toggle Theme"
              >
                {theme === 'dark' ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>
              <Button size="sm" className="btn-primary" asChild>
                <Link to="/auth">
                  {language === 'en' ? 'Sign In' : 'تسجيل الدخول'}
                </Link>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden items-center gap-2">
              <NotificationSystem />
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleLanguage}
                aria-label="Toggle Language"
              >
                <Globe className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                aria-label="Toggle Theme"
              >
                {theme === 'dark' ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>
              <Button variant="ghost" size="icon" onClick={toggleMenu} aria-label="Toggle Menu">
                {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="container md:hidden py-4 animate-fade-in">
            <nav className="flex flex-col space-y-4">
              {routes.map((route) => (
                <Link
                  key={route.path}
                  to={route.path}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    location.pathname === route.path ? 'text-primary' : 'text-muted-foreground'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {route.label}
                </Link>
              ))}
              <Button size="sm" className="btn-primary w-full" asChild>
                <Link to="/auth">
                  {language === 'en' ? 'Sign In' : 'تسجيل الدخول'}
                </Link>
              </Button>
            </nav>
          </div>
        )}
      </header>
    </LanguageContext.Provider>
  );
};

export default Header;
