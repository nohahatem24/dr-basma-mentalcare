import React, { useState, useContext, createContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, Moon, Sun, Globe, User, Calendar, Brain, Settings } from 'lucide-react';
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
  
  // Mock authentication state - would use context in real app
  const isAuthenticated = true; // For demo purposes
  const isDoctor = false; // For demo purposes

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleLanguage = () => setLanguage(language === 'en' ? 'ar' : 'en');
  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  const routes = [
    { path: '/', label: language === 'en' ? 'Home' : 'الرئيسية' },
    { path: '/about', label: language === 'en' ? 'About' : 'عن الدكتورة' },
    { path: '/services', label: language === 'en' ? 'Services' : 'الخدمات' },
    { 
      path: '/dashboard', 
      label: language === 'en' ? 'MindTrack' : 'مايند تراك',
      icon: <Brain className="mr-2 h-4 w-4" />,
      requireAuth: true
    },
    { 
      path: '/book-appointment', 
      label: language === 'en' ? 'Book Appointment' : 'حجز موعد', 
      icon: <Calendar className="mr-2 h-4 w-4" /> 
    },
    { path: '/contact', label: language === 'en' ? 'Contact' : 'التواصل' },
    { 
      path: '/profile', 
      label: language === 'en' ? 'My Profile' : 'الملف الشخصي', 
      icon: <User className="mr-2 h-4 w-4" />,
      requireAuth: true
    },
    { 
      path: '/doctor-admin', 
      label: language === 'en' ? 'Doctor Admin' : 'لوحة تحكم الطبيب', 
      icon: <Settings className="mr-2 h-4 w-4" />,
      requireDoctor: true
    },
  ];

  // Filter routes based on authentication
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

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              {filteredRoutes.map((route) => (
                <Link
                  key={route.path}
                  to={route.path}
                  className={`text-sm font-medium transition-colors hover:text-primary flex items-center ${
                    location.pathname === route.path ? 'text-primary' : 'text-muted-foreground'
                  } ${route.path === '/book-appointment' ? 'bg-primary/10 px-3 py-1 rounded-md' : ''}`}
                >
                  {language === 'ar' ? (
                    <>
                      <span>{route.label}</span>
                      {route.icon && React.cloneElement(route.icon, { className: "ml-2 h-4 w-4" })}
                    </>
                  ) : (
                    <>
                      {route.icon && route.icon}
                      <span>{route.label}</span>
                    </>
                  )}
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
              {filteredRoutes.map((route) => (
                <Link
                  key={route.path}
                  to={route.path}
                  className={`text-sm font-medium transition-colors hover:text-primary flex items-center ${
                    location.pathname === route.path ? 'text-primary' : 'text-muted-foreground'
                  } ${route.path === '/book-appointment' ? 'bg-primary/10 px-3 py-1 rounded-md' : ''}`}
                  onClick={() => setIsOpen(false)}
                >
                  {language === 'ar' ? (
                    <>
                      <span>{route.label}</span>
                      {route.icon && React.cloneElement(route.icon, { className: "ml-2 h-4 w-4" })}
                    </>
                  ) : (
                    <>
                      {route.icon && route.icon}
                      <span>{route.label}</span>
                    </>
                  )}
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
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Other elements */}
          <Link
            to="/book-appointment"
            className="text-sm font-medium transition-colors hover:text-primary flex items-center text-muted-foreground px-3 py-1"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-calendar mr-2 h-4 w-4"
            >
              <path d="M8 2v4"></path>
              <path d="M16 2v4"></path>
              <rect width="18" height="18" x="3" y="4" rx="2"></rect>
              <path d="M3 10h18"></path>
            </svg>
            <span>Book Appointment</span>
          </Link>
        </div>
      </div>
    </LanguageContext.Provider>
  );
};

export default Header;
