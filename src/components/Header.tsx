import React, { useState, useContext, createContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, Moon, Sun, Globe } from 'lucide-react';
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

  const isAuthenticated = true; // For demo purposes
  const isDoctor = false; // For demo purposes

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleLanguage = () => setLanguage(language === 'en' ? 'ar' : 'en');
  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  const routes = [
    { path: '/', label: language === 'en' ? 'Home' : 'الرئيسية' },
    { path: '/about', label: language === 'en' ? 'About' : 'عن الدكتورة' },
    { path: '/services', label: language === 'en' ? 'Services' : 'الخدمات' },
    { path: '/dashboard', label: language === 'en' ? 'MindTrack' : 'مايند تراك', requireAuth: true },
    { path: '/book-appointment', label: language === 'en' ? 'Book Appointment' : 'حجز موعد' },
    { path: '/contact', label: language === 'en' ? 'Contact' : 'التواصل' },
    { path: '/profile', label: language === 'en' ? 'My Profile' : 'الملف الشخصي', requireAuth: true },
    { path: '/doctor-admin', label: language === 'en' ? 'Doctor Admin' : 'لوحة تحكم الطبيب', requireDoctor: true },
  ];

  const filteredRoutes = routes.filter(route => {
    if (route.requireAuth && !isAuthenticated) return false;
    if (route.requireDoctor && !isDoctor) return false;
    return true;
  });

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      <header className={`sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 ${language === 'ar' ? 'arabic text-right' : ''}`}>
        <div className="container flex h-16 items-center">
          <div className="flex items-center justify-between w-full">
            <Link to="/" className="flex items-center gap-2">
              <span className="font-montserrat text-xl font-bold header-gradient">
                {language === 'en' ? 'Dr. Bassma Mental Care' : 'د. بسمة للرعاية النفسية'}
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              {filteredRoutes.map((route) => (
                <Link
                  key={route.path}
                  to={route.path}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    location.pathname === route.path ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  <span>{route.label}</span>
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
                {isAuthenticated ? (
                  <Link to="/profile">
                    {language === 'en' ? 'My Profile' : 'الملف الشخصي'}
                  </Link>
                ) : (
                  <Link to="/auth">
                    {language === 'en' ? 'Sign In' : 'تسجيل الدخول'}
                  </Link>
                )}
              </Button>
            </div>

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

        {isOpen && (
          <div className="container md:hidden py-4 animate-fade-in">
            <nav className="flex flex-col space-y-4">
              {filteredRoutes.map((route) => (
                <Link
                  key={route.path}
                  to={route.path}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    location.pathname === route.path ? 'text-primary' : 'text-muted-foreground'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <span>{route.label}</span>
                </Link>
              ))}
              <Button size="sm" className="btn-primary w-full" asChild>
                {isAuthenticated ? (
                  <Link to="/profile">
                    {language === 'en' ? 'My Profile' : 'الملف الشخصي'}
                  </Link>
                ) : (
                  <Link to="/auth">
                    {language === 'en' ? 'Sign In' : 'تسجيل الدخول'}
                  </Link>
                )}
              </Button>
            </nav>
          </div>
        )}
      </header>
    </LanguageContext.Provider>
  );
};

export default Header;
