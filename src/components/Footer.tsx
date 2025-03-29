
import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from './Header';

const Footer = () => {
  const { language } = useLanguage();
  
  return (
    <footer className={`w-full border-t bg-background py-6 ${language === 'ar' ? 'arabic text-right' : ''}`}>
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 header-gradient">
              {language === 'en' ? 'Dr. Bassma Mental Care' : 'د. بسمة للرعاية النفسية'}
            </h3>
            <p className="text-muted-foreground text-sm mb-4">
              {language === 'en' 
                ? 'Track, Understand, Heal - A comprehensive platform for mental health and emotional well-being.'
                : 'تتبع، افهم، اشفى - منصة شاملة للصحة النفسية والرفاهية العاطفية.'}
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">
              {language === 'en' ? 'Quick Links' : 'روابط سريعة'}
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {language === 'en' ? 'Home' : 'الرئيسية'}
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {language === 'en' ? 'About' : 'عن الدكتورة'}
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {language === 'en' ? 'Services' : 'الخدمات'}
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {language === 'en' ? 'MindTrack' : 'مايند تراك'}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {language === 'en' ? 'Contact' : 'التواصل'}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">
              {language === 'en' ? 'Contact' : 'التواصل'}
            </h4>
            <address className="not-italic text-sm text-muted-foreground">
              <p className="mb-2">
                {language === 'en' ? 'Email: info@drbassma.com' : 'البريد الإلكتروني: info@drbassma.com'}
              </p>
              <p className="mb-2">
                {language === 'en' ? 'Phone: +123 456 7890' : 'الهاتف: +123 456 7890'}
              </p>
              <div className="flex gap-4 mt-4">
                <a href="#" className="text-muted-foreground hover:text-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                  </svg>
                </a>
              </div>
            </address>
          </div>
        </div>

        <div className="mt-8 border-t pt-4 text-center">
          <p className="text-xs text-muted-foreground">
            {language === 'en' 
              ? `© ${new Date().getFullYear()} Dr. Bassma Mental Care. All rights reserved.`
              : `© ${new Date().getFullYear()} د. بسمة للرعاية النفسية. جميع الحقوق محفوظة.`}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
