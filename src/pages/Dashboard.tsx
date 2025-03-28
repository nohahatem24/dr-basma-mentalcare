
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Brain, Heart, BookOpen, Target, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/components/Header';

// Mock data for the mood chart
const mockMoodData = [
  { day: 'Mon', mood: 3 },
  { day: 'Tue', mood: 4 },
  { day: 'Wed', mood: 2 },
  { day: 'Thu', mood: 5 },
  { day: 'Fri', mood: 3 },
  { day: 'Sat', mood: 4 },
  { day: 'Sun', mood: 5 },
];

// Mock journal entries
const mockJournalEntries = [
  {
    id: 1,
    date: 'June 15, 2023',
    mood: 'Happy',
    content: 'Today was a great day. I accomplished all my tasks and spent quality time with family.',
    triggers: ['Success at work', 'Family time'],
  },
  {
    id: 2,
    date: 'June 14, 2023',
    mood: 'Anxious',
    content: 'Feeling nervous about the upcoming presentation. Need to prepare better.',
    triggers: ['Work pressure', 'Public speaking'],
  },
];

// Arabic translations for mock data
const mockJournalEntriesAr = [
  {
    id: 1,
    date: '١٥ يونيو ٢٠٢٣',
    mood: 'سعيد',
    content: 'اليوم كان يوماً رائعاً. أنجزت جميع مهامي وقضيت وقتاً جيداً مع العائلة.',
    triggers: ['النجاح في العمل', 'وقت العائلة'],
  },
  {
    id: 2,
    date: '١٤ يونيو ٢٠٢٣',
    mood: 'قلق',
    content: 'أشعر بالتوتر بشأن العرض التقديمي القادم. أحتاج إلى الاستعداد بشكل أفضل.',
    triggers: ['ضغط العمل', 'التحدث أمام الجمهور'],
  },
];

const Dashboard = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { language } = useLanguage();

  // Get the appropriate journal entries based on language
  const journalEntries = language === 'en' ? mockJournalEntries : mockJournalEntriesAr;
  
  // Week days translated
  const weekDays = {
    en: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    ar: ['الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت', 'الأحد']
  };
  
  // Translated mood data
  const moodDataTranslated = mockMoodData.map((item, index) => ({
    ...item,
    day: language === 'en' ? weekDays.en[index] : weekDays.ar[index]
  }));

  return (
    <div className={`container py-8 ${language === 'ar' ? 'arabic text-right' : ''}`}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h1 className="text-3xl font-bold header-gradient mb-4 md:mb-0">
          {language === 'en' ? 'MindTrack Dashboard' : 'لوحة تحكم مايند تراك'}
        </h1>
        <div className="flex gap-4">
          <Button variant="outline" size="sm">
            {language === 'en' ? 'Demo Mode' : 'وضع العرض التجريبي'}
          </Button>
          <Button className="btn-primary" size="sm">
            {language === 'en' ? 'Sign In' : 'تسجيل الدخول'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle>{language === 'en' ? 'Track Your Journey' : 'تتبع رحلتك'}</CardTitle>
            <CardDescription>
              {language === 'en' ? 'Monitor your mental well-being' : 'راقب صحتك النفسية'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border"
                />
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium">
                  {language === 'en' ? 'Quick Access' : 'وصول سريع'}
                </h3>
                <ul className="space-y-1">
                  <li>
                    <Button variant="ghost" className="w-full justify-start">
                      <Brain className="mr-2 h-4 w-4" />
                      <span>{language === 'en' ? 'Mood Tracker' : 'متتبع المزاج'}</span>
                    </Button>
                  </li>
                  <li>
                    <Button variant="ghost" className="w-full justify-start">
                      <BookOpen className="mr-2 h-4 w-4" />
                      <span>{language === 'en' ? 'Journal' : 'مذكرات'}</span>
                    </Button>
                  </li>
                  <li>
                    <Button variant="ghost" className="w-full justify-start">
                      <Heart className="mr-2 h-4 w-4" />
                      <span>{language === 'en' ? 'Gratitude' : 'الامتنان'}</span>
                    </Button>
                  </li>
                  <li>
                    <Button variant="ghost" className="w-full justify-start">
                      <Target className="mr-2 h-4 w-4" />
                      <span>{language === 'en' ? 'Goals' : 'الأهداف'}</span>
                    </Button>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>{language === 'en' ? 'Mood Trends' : 'اتجاهات المزاج'}</CardTitle>
                  <CardDescription>
                    {language === 'en' ? 'Track how you\'ve been feeling' : 'تتبع كيف كان شعورك'}
                  </CardDescription>
                </div>
                <div className="flex items-center">
                  <Button variant="ghost" size="icon">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm">
                    {language === 'en' ? 'This Week' : 'هذا الأسبوع'}
                  </span>
                  <Button variant="ghost" size="icon">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={moodDataTranslated}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="mood"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ strokeWidth: 2 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>{language === 'en' ? '1 - Very Low' : '١ - منخفض جداً'}</span>
                <span>{language === 'en' ? '2 - Low' : '٢ - منخفض'}</span>
                <span>{language === 'en' ? '3 - Neutral' : '٣ - محايد'}</span>
                <span>{language === 'en' ? '4 - Good' : '٤ - جيد'}</span>
                <span>{language === 'en' ? '5 - Excellent' : '٥ - ممتاز'}</span>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="journal">
            <TabsList className="w-full">
              <TabsTrigger value="journal" className="flex-1">
                {language === 'en' ? 'Journal' : 'المذكرات'}
              </TabsTrigger>
              <TabsTrigger value="gratitude" className="flex-1">
                {language === 'en' ? 'Gratitude' : 'الامتنان'}
              </TabsTrigger>
              <TabsTrigger value="triggers" className="flex-1">
                {language === 'en' ? 'Triggers' : 'المحفزات'}
              </TabsTrigger>
              <TabsTrigger value="goals" className="flex-1">
                {language === 'en' ? 'Goals' : 'الأهداف'}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="journal" className="space-y-4 mt-4">
              <div className="flex justify-between">
                <h3 className="text-lg font-medium">
                  {language === 'en' ? 'Your Journal Entries' : 'مدخلات مذكراتك'}
                </h3>
                <Button className="btn-secondary" size="sm">
                  {language === 'en' ? 'New Entry' : 'إدخال جديد'}
                </Button>
              </div>
              
              {journalEntries.map((entry) => (
                <Card key={entry.id} className="card-hover">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <CardTitle className="text-base">{entry.date}</CardTitle>
                      <span className={`text-sm px-2 py-1 rounded-full ${
                        (entry.mood === 'Happy' || entry.mood === 'سعيد') ? 'bg-green-100 text-green-800' : 
                        (entry.mood === 'Anxious' || entry.mood === 'قلق') ? 'bg-amber-100 text-amber-800' : ''
                      }`}>
                        {entry.mood}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{entry.content}</p>
                    <div className="flex gap-2 mt-3">
                      {entry.triggers.map((trigger, i) => (
                        <span key={i} className="text-xs bg-accent/30 px-2 py-1 rounded">
                          {trigger}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
            
            <TabsContent value="gratitude" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {language === 'en' ? 'Gratitude Journal' : 'مذكرات الامتنان'}
                  </CardTitle>
                  <CardDescription>
                    {language === 'en' ? 'Record things you\'re grateful for' : 'سجل الأشياء التي تشعر بالامتنان لها'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-muted-foreground py-8">
                    {language === 'en' 
                      ? 'Sign in to access your gratitude journal' 
                      : 'قم بتسجيل الدخول للوصول إلى مذكرات الامتنان الخاصة بك'}
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="triggers" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {language === 'en' ? 'Emotional Triggers' : 'المحفزات العاطفية'}
                  </CardTitle>
                  <CardDescription>
                    {language === 'en' 
                      ? 'Identify patterns in what affects your mood' 
                      : 'تعرف على الأنماط التي تؤثر على مزاجك'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-muted-foreground py-8">
                    {language === 'en' 
                      ? 'Sign in to track your emotional triggers' 
                      : 'قم بتسجيل الدخول لتتبع محفزاتك العاطفية'}
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="goals" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {language === 'en' ? 'Personal Goals' : 'الأهداف الشخصية'}
                  </CardTitle>
                  <CardDescription>
                    {language === 'en' 
                      ? 'Set and track goals for your mental well-being' 
                      : 'ضع وتتبع أهدافًا لصحتك النفسية'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-muted-foreground py-8">
                    {language === 'en' 
                      ? 'Sign in to manage your personal growth goals' 
                      : 'قم بتسجيل الدخول لإدارة أهداف نموك الشخصي'}
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <Card>
            <CardHeader>
              <CardTitle>
                {language === 'en' ? 'AI Insights' : 'رؤى الذكاء الاصطناعي'}
              </CardTitle>
              <CardDescription>
                {language === 'en' 
                  ? 'Personalized insights based on your data' 
                  : 'رؤى مخصصة بناءً على بياناتك'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-accent/10 p-4 rounded-lg">
                <p className="text-sm italic text-muted-foreground">
                  {language === 'en' 
                    ? '"Based on your recent mood patterns, you seem to experience higher moods on weekends. Consider activities that bring you joy during weekdays to maintain more balanced emotions."'
                    : '"بناءً على أنماط مزاجك الأخيرة، يبدو أنك تشعر بمزاج أفضل في عطلات نهاية الأسبوع. فكر في أنشطة تجلب لك الفرح خلال أيام الأسبوع للحفاظ على مشاعر أكثر توازناً."'}
                </p>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                {language === 'en' 
                  ? 'Note: This is a demo insight. Sign in to receive personalized insights based on your actual data.'
                  : 'ملاحظة: هذه رؤية تجريبية. قم بتسجيل الدخول لتلقي رؤى مخصصة بناءً على بياناتك الفعلية.'}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
