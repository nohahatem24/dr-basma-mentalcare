
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLanguage } from '@/components/Header';
import { useAuth } from '@/components/auth/AuthProvider';
import MentalHealthReport from '@/components/MentalHealthReport';
import RelationshipTracker from '@/components/RelationshipTracker';
import MoodTracker from '@/components/MoodTracker';
import CPTTechniques from '@/components/CPTTechniques';
import GuidedBreathing from '@/components/self-reporting/GuidedBreathing';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import JournalEntries from '@/components/dashboard/JournalEntries';
import GratitudeJournal from '@/components/dashboard/GratitudeJournal';
import GoalsTracker from '@/components/dashboard/GoalsTracker';
import AIInsights from '@/components/dashboard/AIInsights';
import { supabase } from '@/integrations/supabase/client';
import { Calendar, Clock, PenSquare, UserRound, Video, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import MoodChart from '@/components/dashboard/MoodChart';
import { useMoodChartData } from '@/components/dashboard/MoodChartUtils';

interface Session {
  id: string;
  date: string;
  time: string;
  type: 'video' | 'in-person';
  status: 'completed' | 'upcoming' | 'cancelled';
  notes?: string;
}

interface MoodEntry {
  id: string;
  date: Date;
  mood: number;
  notes: string;
  triggers: string[];
}

const Dashboard = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { language } = useLanguage();
  const { session: authSession } = useAuth();
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'mood';

  const [upcomingSessions, setUpcomingSessions] = useState<Session[]>([]);
  const [isLoadingSessions, setIsLoadingSessions] = useState(true);
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [isLoadingMoodEntries, setIsLoadingMoodEntries] = useState(true);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [isLoadingActivities, setIsLoadingActivities] = useState(true);

  // Render the appropriate component based on the active tab
  const renderActiveComponent = () => {
    switch(activeTab) {
      case 'mood':
        return <MoodTracker />;
      case 'journal':
        return <JournalEntries />;
      case 'gratitude':
        return <GratitudeJournal />;
      case 'goals':
        return <GoalsTracker />;
      case 'report':
        return <MentalHealthReport />;
      case 'breathing':
        return <GuidedBreathing />;
      case 'cpt':
        return <CPTTechniques />;
      case 'relationship':
        return <RelationshipTracker />;
      default:
        return <MoodTracker />;
    }
  };

  // Fetch user's data from Supabase
  useEffect(() => {
    const fetchData = async () => {
      if (!authSession.user?.id) return;

      // Mock sessions data - in a real app, this would come from Supabase
      const mockSessions: Session[] = [
        { 
          id: '1', 
          date: '2023-10-15', 
          time: '10:00 AM', 
          type: 'video', 
          status: 'completed',
          notes: 'Initial consultation' 
        },
        { 
          id: '2', 
          date: '2023-11-05', 
          time: '2:30 PM', 
          type: 'in-person', 
          status: 'completed' 
        },
        { 
          id: '3', 
          date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], 
          time: '11:00 AM', 
          type: 'video', 
          status: 'upcoming' 
        },
      ];

      // Filter upcoming sessions
      const upcoming = mockSessions.filter(session => session.status === 'upcoming');
      setUpcomingSessions(upcoming);
      setIsLoadingSessions(false);

      // Fetch mood entries
      try {
        const { data: moodData, error: moodError } = await supabase
          .from('mood_entries')
          .select('*')
          .eq('user_id', authSession.user.id)
          .order('created_at', { ascending: false })
          .limit(7);
          
        if (moodError) throw moodError;
        
        const formattedEntries = (moodData || []).map(entry => ({
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

      // Create mockup of recent activities
      const now = new Date();
      const mockActivities = [
        {
          id: '1',
          type: 'mood',
          date: new Date(now.getTime() - 2 * 60 * 60 * 1000),
          title: language === 'en' ? 'Mood Tracked' : 'تتبع المزاج',
          description: language === 'en' ? 'You recorded your mood as "Happy"' : 'لقد سجلت مزاجك على أنه "سعيد"'
        },
        {
          id: '2',
          type: 'journal',
          date: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
          title: language === 'en' ? 'Journal Entry' : 'مدخل المجلة',
          description: language === 'en' ? 'You wrote a new journal entry' : 'كتبت مدخلًا جديدًا في المجلة'
        },
        {
          id: '3',
          type: 'session',
          date: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
          title: language === 'en' ? 'Therapy Session' : 'جلسة علاجية',
          description: language === 'en' ? 'You completed a session with Dr. Bassma' : 'أكملت جلسة مع د. بسمة'
        }
      ];
      
      setRecentActivities(mockActivities);
      setIsLoadingActivities(false);
    };

    fetchData();
  }, [authSession.user?.id, language]);

  const moodChartData = useMoodChartData(moodEntries);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(
      language === 'en' ? 'en-US' : 'ar-EG', 
      { year: 'numeric', month: 'long', day: 'numeric' }
    );
  };

  const getUserInitials = () => {
    const firstName = authSession.profile?.first_name || '';
    const lastName = authSession.profile?.last_name || '';
    const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : '';
    const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : '';
    return firstInitial + lastInitial || 'U';
  };

  return (
    <div className={`container py-8 ${language === 'ar' ? 'arabic text-right' : ''}`}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h1 className="text-3xl font-bold header-gradient mb-4 md:mb-0">
          {language === 'en' 
            ? `Welcome, ${authSession.profile?.first_name || 'User'}!` 
            : `مرحبًا، ${authSession.profile?.first_name || 'مستخدم'}!`}
        </h1>
        
        <div className="flex items-center gap-2">
          <Button asChild variant="outline">
            <a href="/profile">
              <UserRound className="h-4 w-4 mr-2" />
              {language === 'en' ? 'View Profile' : 'عرض الملف الشخصي'}
            </a>
          </Button>
          <Button asChild>
            <a href="/book-appointment">
              <Calendar className="h-4 w-4 mr-2" />
              {language === 'en' ? 'Book Session' : 'حجز جلسة'}
            </a>
          </Button>
        </div>
      </div>

      {/* Dashboard Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Upcoming Sessions */}
        <Card>
          <CardHeader>
            <CardTitle>{language === 'en' ? 'Upcoming Sessions' : 'الجلسات القادمة'}</CardTitle>
            <CardDescription>
              {language === 'en' ? 'Your scheduled therapy sessions' : 'جلسات العلاج المقررة'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingSessions ? (
              <div className="space-y-2">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            ) : upcomingSessions.length > 0 ? (
              <div className="space-y-4">
                {upcomingSessions.map(session => (
                  <div key={session.id} className="p-4 border rounded-md">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src="/therapist-avatar.jpg" alt="Dr. Bassma" />
                        <AvatarFallback>DB</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h4 className="font-medium">
                          {language === 'en' ? 'Session with Dr. Bassma' : 'جلسة مع د. بسمة'}
                        </h4>
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span className="mr-2">{formatDate(session.date)}</span>
                          <Clock className="h-3 w-3 mr-1" />
                          <span>{session.time}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-3 flex justify-end gap-2">
                      {session.type === 'video' && (
                        <Button size="sm" asChild>
                          <a href="/video-session">
                            <Video className="h-3 w-3 mr-1" />
                            {language === 'en' ? 'Join' : 'انضم'}
                          </a>
                        </Button>
                      )}
                      <Button size="sm" variant="outline">
                        {language === 'en' ? 'Reschedule' : 'إعادة جدولة'}
                      </Button>
                    </div>
                  </div>
                ))}
                
                <div className="flex justify-end">
                  <Button variant="ghost" size="sm" asChild>
                    <a href="/profile?tab=sessions">
                      {language === 'en' ? 'View All Sessions' : 'عرض جميع الجلسات'}
                      <ArrowRight className="h-3 w-3 ml-1" />
                    </a>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 flex flex-col items-center">
                <Calendar className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-muted-foreground mb-4">
                  {language === 'en' 
                    ? 'You have no upcoming sessions' 
                    : 'ليس لديك جلسات قادمة'}
                </p>
                <Button asChild>
                  <a href="/book-appointment">
                    {language === 'en' ? 'Book a Session' : 'حجز جلسة'}
                  </a>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>{language === 'en' ? 'Recent Activity' : 'النشاط الأخير'}</CardTitle>
            <CardDescription>
              {language === 'en' ? 'Your recent interactions' : 'تفاعلاتك الأخيرة'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingActivities ? (
              <div className="space-y-2">
                <Skeleton className="h-14 w-full" />
                <Skeleton className="h-14 w-full" />
                <Skeleton className="h-14 w-full" />
              </div>
            ) : recentActivities.length > 0 ? (
              <div className="space-y-4">
                {recentActivities.map(activity => (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      {activity.type === 'mood' ? (
                        <UserRound className="h-4 w-4 text-primary" />
                      ) : activity.type === 'journal' ? (
                        <PenSquare className="h-4 w-4 text-primary" />
                      ) : (
                        <Video className="h-4 w-4 text-primary" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{activity.title}</h4>
                      <p className="text-xs text-muted-foreground">{activity.description}</p>
                      <span className="text-xs text-muted-foreground">
                        {activity.date.toLocaleDateString(
                          language === 'en' ? 'en-US' : 'ar-EG',
                          { month: 'short', day: 'numeric' }
                        )}{' '}
                        {activity.date.toLocaleTimeString(
                          language === 'en' ? 'en-US' : 'ar-EG',
                          { hour: '2-digit', minute: '2-digit' }
                        )}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-muted-foreground">
                  {language === 'en' 
                    ? 'No recent activities' 
                    : 'لا توجد أنشطة حديثة'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Mood Summary */}
        <Card>
          <CardHeader>
            <CardTitle>{language === 'en' ? 'Mood Summary' : 'ملخص المزاج'}</CardTitle>
            <CardDescription>
              {language === 'en' ? 'Your emotional wellness trends' : 'اتجاهات صحتك العاطفية'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingMoodEntries ? (
              <Skeleton className="h-[150px] w-full" />
            ) : moodEntries.length > 0 ? (
              <div>
                <MoodChart 
                  moodData={moodChartData}
                  height={150}
                  showLabels={false}
                />
                <div className="flex justify-end mt-4">
                  <Button variant="ghost" size="sm" asChild>
                    <a href="/profile?tab=mood-history">
                      {language === 'en' ? 'View Detailed History' : 'عرض السجل المفصل'}
                      <ArrowRight className="h-3 w-3 ml-1" />
                    </a>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-muted-foreground mb-4">
                  {language === 'en' 
                    ? 'Start tracking your mood to see trends' 
                    : 'ابدأ بتتبع مزاجك لرؤية الاتجاهات'}
                </p>
                <Button variant="outline" size="sm" asChild>
                  <a href="/dashboard?tab=mood">
                    {language === 'en' ? 'Track Mood Now' : 'تتبع المزاج الآن'}
                  </a>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <DashboardSidebar 
            activePage={activeTab} 
            date={date} 
            setDate={setDate} 
          />
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {renderActiveComponent()}
          
          {/* AI Insights Card */}
          <AIInsights />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
