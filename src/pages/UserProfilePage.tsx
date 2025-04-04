
import React, { useState, useEffect } from 'react';
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
  Binary,
  MessageCircle 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import UserProfile from '@/components/user/UserProfile';
import DateOfBirthInput from '@/components/auth/DateOfBirthInput';
import MoodChart from '@/components/dashboard/MoodChart';
import { useMoodChartData } from '@/components/dashboard/MoodChartUtils';
import { Skeleton } from '@/components/ui/skeleton';

interface MoodEntry {
  id: string;
  date: Date;
  mood: number;
  notes: string;
  triggers: string[];
}

const UserProfilePage = () => {
  const { language } = useLanguage();
  const { session, updateProfile, signOut, refreshProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  
  const [isUpdating, setIsUpdating] = useState(false);
  const [firstName, setFirstName] = useState(session.profile?.first_name || '');
  const [lastName, setLastName] = useState(session.profile?.last_name || '');
  const [phoneNumber, setPhoneNumber] = useState(session.user?.phone || session.user?.user_metadata?.phone || '');
  const [gender, setGender] = useState(session.user?.user_metadata?.gender || '');
  const [dateOfBirth, setDateOfBirth] = useState(session.user?.user_metadata?.date_of_birth || '');
  
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [isLoadingMoodEntries, setIsLoadingMoodEntries] = useState(false);
  
  // Function to get user initials for avatar fallback
  const getUserInitials = () => {
    const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : '';
    const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : '';
    return firstInitial + lastInitial || 'U';
  };
  
  // Fetch mood entries
  useEffect(() => {
    const fetchMoodEntries = async () => {
      if (!session.user?.id) return;
      
      setIsLoadingMoodEntries(true);
      try {
        const { data, error } = await supabase
          .from('mood_entries')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false })
          .limit(7);
          
        if (error) throw error;
        
        const formattedEntries = data.map(entry => ({
          id: entry.id,
          date: new Date(entry.created_at),
          mood: entry.mood_score,
          notes: entry.notes || '',
          triggers: entry.triggers || []
        }));
        
        setMoodEntries(formattedEntries);
      } catch (error) {
        console.error('Error fetching mood entries:', error);
      } finally {
        setIsLoadingMoodEntries(false);
      }
    };
    
    fetchMoodEntries();
  }, [session.user?.id]);
  
  const moodChartData = useMoodChartData(moodEntries);
  
  // Update form fields when session changes
  useEffect(() => {
    if (session.profile) {
      setFirstName(session.profile.first_name || '');
      setLastName(session.profile.last_name || '');
    }
    
    if (session.user) {
      setPhoneNumber(session.user.phone || session.user.user_metadata?.phone || '');
      setGender(session.user.user_metadata?.gender || '');
      setDateOfBirth(session.user.user_metadata?.date_of_birth || '');
    }
  }, [session]);
  
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
          date_of_birth: dateOfBirth,
        }
      });
      
      if (!success && error) {
        throw new Error(error);
      }
      
      // Refresh the profile to get the latest data
      await refreshProfile();
      
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
    <div className="container py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
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
          
          <TabsContent value="mood-history" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>{language === 'en' ? 'Mood History' : 'سجل المزاج'}</CardTitle>
                <CardDescription>
                  {language === 'en' 
                    ? 'Track your emotional wellbeing over time' 
                    : 'تتبع صحتك العاطفية على مر الزمن'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingMoodEntries ? (
                  <div className="space-y-4">
                    <Skeleton className="h-[200px] w-full" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                  </div>
                ) : moodEntries.length > 0 ? (
                  <div className="space-y-6">
                    <MoodChart
                      moodData={moodChartData}
                      title={language === 'en' ? 'Your Mood Trends' : 'اتجاهات مزاجك'}
                      height={300}
                    />
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">
                        {language === 'en' ? 'Recent Entries' : 'المدخلات الأخيرة'}
                      </h3>
                      
                      {moodEntries.map(entry => (
                        <div key={entry.id} className="p-4 border rounded-md">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">
                                {entry.date.toLocaleDateString(
                                  language === 'en' ? 'en-US' : 'ar-EG',
                                  { year: 'numeric', month: 'long', day: 'numeric' }
                                )}
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                {entry.date.toLocaleTimeString(
                                  language === 'en' ? 'en-US' : 'ar-EG',
                                  { hour: '2-digit', minute: '2-digit' }
                                )}
                              </p>
                            </div>
                            <div className="text-right">
                              <span className="inline-block px-2 py-1 bg-primary/10 text-primary rounded text-sm">
                                {language === 'en' ? 'Mood: ' : 'المزاج: '}
                                {entry.mood}
                              </span>
                            </div>
                          </div>
                          
                          {entry.notes && (
                            <div className="mt-2">
                              <p className="text-sm">{entry.notes}</p>
                            </div>
                          )}
                          
                          {entry.triggers && entry.triggers.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1">
                              {entry.triggers.map(trigger => (
                                <span key={trigger} className="text-xs px-2 py-0.5 bg-secondary text-secondary-foreground rounded-full">
                                  {trigger}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                      
                      <div className="flex justify-center mt-4">
                        <Button variant="outline" asChild>
                          <a href="/dashboard?tab=mood">
                            {language === 'en' ? 'View All Mood Entries' : 'عرض جميع مدخلات المزاج'}
                          </a>
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="mx-auto w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
                      <Calendar className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">
                      {language === 'en' ? 'No mood entries yet' : 'لا توجد مدخلات مزاج حتى الآن'}
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      {language === 'en' 
                        ? 'Start tracking your mood to see your emotional patterns over time' 
                        : 'ابدأ بتتبع مزاجك لرؤية أنماطك العاطفية على مر الزمن'}
                    </p>
                    <Button asChild>
                      <a href="/dashboard?tab=mood">
                        {language === 'en' ? 'Track Your Mood' : 'تتبع مزاجك'}
                      </a>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="messages" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>{language === 'en' ? 'Messages' : 'الرسائل'}</CardTitle>
                <CardDescription>
                  {language === 'en' 
                    ? 'Communicate securely with your therapist' 
                    : 'تواصل بشكل آمن مع معالجك النفسي'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <MessageCircle className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    {language === 'en' ? 'No Messages Yet' : 'لا توجد رسائل حتى الآن'}
                  </h3>
                  <p className="text-muted-foreground max-w-md mb-6">
                    {language === 'en' 
                      ? 'Once you book a session with your therapist, you can send messages and receive responses here.' 
                      : 'بمجرد حجز جلسة مع معالجك النفسي، يمكنك إرسال الرسائل وتلقي الردود هنا.'}
                  </p>
                  <Button asChild>
                    <a href="/book-appointment">
                      {language === 'en' ? 'Book a Session' : 'حجز جلسة'}
                    </a>
                  </Button>
                </div>
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
                    
                    <div className="space-y-2">
                      <DateOfBirthInput 
                        value={dateOfBirth} 
                        onChange={setDateOfBirth} 
                      />
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
