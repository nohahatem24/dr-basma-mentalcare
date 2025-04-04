
import React, { useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { useLanguage } from '@/components/Header';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Settings, 
  Clock, 
  Shield, 
  Binary 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import UserProfile from '@/components/user/UserProfile';

const UserProfilePage = () => {
  const { language } = useLanguage();
  const { session, updateProfile, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  
  const [isUpdating, setIsUpdating] = useState(false);
  const [firstName, setFirstName] = useState(session.profile?.first_name || '');
  const [lastName, setLastName] = useState(session.profile?.last_name || '');
  const [phoneNumber, setPhoneNumber] = useState(session.user?.phone || session.user?.user_metadata?.phone || '');
  const [gender, setGender] = useState(session.user?.user_metadata?.gender || '');
  
  // Function to get user initials for avatar fallback
  const getUserInitials = () => {
    const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : '';
    const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : '';
    return firstInitial + lastInitial;
  };
  
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    
    try {
      const { success, error } = await updateProfile({
        first_name: firstName,
        last_name: lastName,
      });
      
      // Also update user metadata
      await supabase.auth.updateUser({
        data: {
          phone: phoneNumber,
          gender: gender,
          first_name: firstName,
          last_name: lastName,
          full_name: `${firstName} ${lastName}`.trim(),
        }
      });
      
      if (!success && error) {
        throw new Error(error);
      }
      
      toast(language === 'en' 
        ? 'Profile updated successfully' 
        : 'تم تحديث الملف الشخصي بنجاح'
      );
      
      setActiveTab('overview');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsUpdating(false);
    }
  };
  
  const handleLogout = async () => {
    await signOut();
  };
  
  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardHeader className="text-center">
              <Avatar className="h-24 w-24 mx-auto mb-2">
                <AvatarImage src={session.user?.user_metadata?.avatar_url || ''} />
                <AvatarFallback className="text-lg">{getUserInitials()}</AvatarFallback>
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
        </div>
        
        <div className="md:col-span-2">
          <TabsContent value="overview" className="mt-0">
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
                      {session.profile?.first_name} {session.profile?.last_name}
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
                      {phoneNumber || (language === 'en' ? 'Not provided' : 'غير متوفر')}
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">
                      {language === 'en' ? 'Gender' : 'الجنس'}
                    </Label>
                    <div className="font-medium flex items-center">
                      <Binary className="h-4 w-4 mr-2 text-muted-foreground" />
                      {gender 
                        ? (gender === 'male' 
                            ? (language === 'en' ? 'Male' : 'ذكر')
                            : gender === 'female' 
                              ? (language === 'en' ? 'Female' : 'أنثى')
                              : gender)
                        : (language === 'en' ? 'Not provided' : 'غير متوفر')}
                    </div>
                  </div>
                  
                  {session.user?.user_metadata?.date_of_birth && (
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">
                        {language === 'en' ? 'Date of Birth' : 'تاريخ الميلاد'}
                      </Label>
                      <div className="font-medium flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        {session.user.user_metadata.date_of_birth}
                      </div>
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
          </TabsContent>
          
          <TabsContent value="sessions" className="mt-0">
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
          </TabsContent>
          
          <TabsContent value="settings" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>{language === 'en' ? 'Edit Profile' : 'تعديل الملف الشخصي'}</CardTitle>
                <CardDescription>
                  {language === 'en' 
                    ? 'Update your personal information' 
                    : 'تحديث معلوماتك الشخصية'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="first-name">
                        {language === 'en' ? 'First Name' : 'الاسم الأول'}
                      </Label>
                      <Input
                        id="first-name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="last-name">
                        {language === 'en' ? 'Last Name' : 'الاسم الأخير'}
                      </Label>
                      <Input
                        id="last-name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">
                        {language === 'en' ? 'Email' : 'البريد الإلكتروني'}
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={session.user?.email || ''}
                        disabled
                      />
                      <p className="text-xs text-muted-foreground">
                        {language === 'en' 
                          ? 'Email cannot be changed' 
                          : 'لا يمكن تغيير البريد الإلكتروني'}
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">
                        {language === 'en' ? 'Phone Number' : 'رقم الهاتف'}
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="gender">
                        {language === 'en' ? 'Gender' : 'الجنس'}
                      </Label>
                      <Select value={gender} onValueChange={setGender}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder={language === 'en' ? 'Select gender' : 'اختر الجنس'} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">{language === 'en' ? 'Male' : 'ذكر'}</SelectItem>
                          <SelectItem value="female">{language === 'en' ? 'Female' : 'أنثى'}</SelectItem>
                          <SelectItem value="other">{language === 'en' ? 'Other' : 'آخر'}</SelectItem>
                          <SelectItem value="prefer_not_to_say">{language === 'en' ? 'Prefer not to say' : 'أفضل عدم الإجابة'}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setActiveTab('overview')}>
                      {language === 'en' ? 'Cancel' : 'إلغاء'}
                    </Button>
                    <Button type="submit" disabled={isUpdating}>
                      {isUpdating 
                        ? (language === 'en' ? 'Saving...' : 'جاري الحفظ...')
                        : (language === 'en' ? 'Save Changes' : 'حفظ التغييرات')}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
