
import React from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { useLanguage } from '@/components/Header';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Clock, Calendar, MessageCircle, Settings } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ProfileSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  handleLogout: () => void;
}

const ProfileSidebar = ({ activeTab, setActiveTab, handleLogout }: ProfileSidebarProps) => {
  const { language } = useLanguage();
  const { session } = useAuth();

  // Function to get user initials for avatar fallback
  const getUserInitials = () => {
    const firstName = session.profile?.first_name || '';
    const lastName = session.profile?.last_name || '';
    const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : '';
    const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : '';
    return firstInitial + lastInitial || 'U';
  };

  return (
    <Card>
      <CardHeader className="text-center">
        <Avatar className="h-24 w-24 mx-auto mb-2">
          <AvatarImage src={session.user?.user_metadata?.avatar_url || ''} />
          <AvatarFallback className="text-lg bg-primary text-primary-foreground">{getUserInitials()}</AvatarFallback>
        </Avatar>
        <CardTitle>{session.profile?.first_name} {session.profile?.last_name}</CardTitle>
        <CardDescription>{session.user?.email}</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab} 
          orientation="vertical" 
          className="w-full"
        >
          <TabsList className="flex flex-col h-auto items-stretch">
            <TabsTrigger value="overview" className="justify-start">
              <User className="h-4 w-4 mr-2" />
              {language === 'en' ? 'Profile Overview' : 'نظرة عامة على الملف الشخصي'}
            </TabsTrigger>
            <TabsTrigger value="sessions" className="justify-start">
              <Clock className="h-4 w-4 mr-2" />
              {language === 'en' ? 'My Sessions' : 'جلساتي'}
            </TabsTrigger>
            <TabsTrigger value="mood-history" className="justify-start">
              <Calendar className="h-4 w-4 mr-2" />
              {language === 'en' ? 'Mood History' : 'سجل المزاج'}
            </TabsTrigger>
            <TabsTrigger value="messages" className="justify-start">
              <MessageCircle className="h-4 w-4 mr-2" />
              {language === 'en' ? 'Messages' : 'الرسائل'}
            </TabsTrigger>
            <TabsTrigger value="settings" className="justify-start">
              <Settings className="h-4 w-4 mr-2" />
              {language === 'en' ? 'Settings' : 'الإعدادات'}
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" onClick={handleLogout}>
          {language === 'en' ? 'Sign Out' : 'تسجيل الخروج'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProfileSidebar;
