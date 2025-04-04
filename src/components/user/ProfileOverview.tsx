
import React from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { useLanguage } from '@/components/Header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { User, Mail, Phone, Calendar, Binary } from 'lucide-react';
import MoodChart from '@/components/dashboard/MoodChart';
import { Skeleton } from '@/components/ui/skeleton';

interface ProfileOverviewProps {
  moodChartData: any[];
  isLoadingMoodEntries: boolean;
  moodEntries: any[];
  setActiveTab: (tab: string) => void;
}

const ProfileOverview = ({ 
  moodChartData, 
  isLoadingMoodEntries, 
  moodEntries, 
  setActiveTab 
}: ProfileOverviewProps) => {
  const { language } = useLanguage();
  const { session } = useAuth();

  const formatDate = (dateString: string | null) => {
    if (!dateString) return language === 'en' ? 'Not provided' : 'غير متوفر';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(
        language === 'en' ? 'en-US' : 'ar-EG',
        { year: 'numeric', month: 'long', day: 'numeric' }
      );
    } catch (e) {
      return dateString;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{language === 'en' ? 'Profile Information' : 'معلومات الملف الشخصي'}</CardTitle>
        <CardDescription>
          {language === 'en' 
            ? 'View and manage your personal information' 
            : 'عرض وإدارة معلوماتك الشخصية'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">
              {language === 'en' ? 'Full Name' : 'الاسم الكامل'}
            </Label>
            <div className="font-medium flex items-center">
              <User className="h-4 w-4 mr-2 text-muted-foreground" />
              {session.profile?.first_name} {session.profile?.last_name || (language === 'en' ? 'Not provided' : 'غير متوفر')}
            </div>
          </div>
          
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">
              {language === 'en' ? 'Email' : 'البريد الإلكتروني'}
            </Label>
            <div className="font-medium flex items-center">
              <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
              {session.user?.email}
            </div>
          </div>
          
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">
              {language === 'en' ? 'Phone Number' : 'رقم الهاتف'}
            </Label>
            <div className="font-medium flex items-center">
              <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
              {session.user?.user_metadata?.phone || (language === 'en' ? 'Not provided' : 'غير متوفر')}
            </div>
          </div>
          
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">
              {language === 'en' ? 'Gender' : 'الجنس'}
            </Label>
            <div className="font-medium flex items-center">
              <Binary className="h-4 w-4 mr-2 text-muted-foreground" />
              {session.user?.user_metadata?.gender 
                ? (session.user.user_metadata.gender === 'male' 
                    ? (language === 'en' ? 'Male' : 'ذكر')
                    : session.user.user_metadata.gender === 'female' 
                      ? (language === 'en' ? 'Female' : 'أنثى')
                      : session.user.user_metadata.gender)
                : (language === 'en' ? 'Not provided' : 'غير متوفر')}
            </div>
          </div>
          
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">
              {language === 'en' ? 'Date of Birth' : 'تاريخ الميلاد'}
            </Label>
            <div className="font-medium flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
              {formatDate(session.user?.user_metadata?.date_of_birth)}
            </div>
          </div>
        </div>
        
        <Separator className="my-4" />
        
        {/* Mood Summary */}
        <div className="space-y-2">
          <h3 className="text-lg font-medium">
            {language === 'en' ? 'Recent Mood Activity' : 'نشاط المزاج الأخير'}
          </h3>
          
          {isLoadingMoodEntries ? (
            <div className="space-y-2">
              <Skeleton className="h-[200px] w-full" />
            </div>
          ) : moodEntries.length > 0 ? (
            <MoodChart
              moodData={moodChartData}
              title={language === 'en' ? 'Your Recent Mood Trends' : 'اتجاهات مزاجك الأخيرة'}
            />
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              {language === 'en' 
                ? 'No mood entries yet. Start tracking your mood to see trends here.' 
                : 'لا توجد إدخالات مزاج حتى الآن. ابدأ بتتبع مزاجك لرؤية الاتجاهات هنا.'}
            </div>
          )}
        </div>
        
        <Separator className="my-4" />
        
        <div className="flex justify-end">
          <Button onClick={() => setActiveTab('settings')}>
            {language === 'en' ? 'Edit Profile' : 'تعديل الملف الشخصي'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileOverview;
