
import React from 'react';
import { useLanguage } from '@/components/Header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import UserProfile from '@/components/user/UserProfile';

const SessionsTab = () => {
  const { language } = useLanguage();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{language === 'en' ? 'My Sessions' : 'جلساتي'}</CardTitle>
        <CardDescription>
          {language === 'en' 
            ? 'View your upcoming and past therapy sessions' 
            : 'عرض جلسات العلاج القادمة والسابقة'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <UserProfile />
      </CardContent>
    </Card>
  );
};

export default SessionsTab;
