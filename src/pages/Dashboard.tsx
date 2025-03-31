
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLanguage } from '@/components/Header';
import { Card, CardContent } from '@/components/ui/card';
import MindTrackNavigation from '@/components/MindTrackNavigation';
import MentalHealthReport from '@/components/MentalHealthReport';
import RelationshipTracker from '@/components/RelationshipTracker';
import MoodTracker from '@/components/MoodTracker';
import CPTTechniques from '@/components/CPTTechniques';
import NeedHelpCard from '@/components/self-reporting/NeedHelpCard';
import GuidedBreathing from '@/components/self-reporting/GuidedBreathing';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar } from '@/components/ui/calendar';

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
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'mood';

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

  // Render the appropriate component based on the active tab
  const renderActiveComponent = () => {
    switch(activeTab) {
      case 'mood':
        return <MoodTracker />;
      case 'journal':
        return (
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4">
                {language === 'en' ? 'Your Journal' : 'مذكراتك'}
              </h2>
              <div className="space-y-4">
                {journalEntries.map(entry => (
                  <div key={entry.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">{entry.date}</h3>
                      <span className="text-sm px-2 py-1 bg-primary/10 rounded-full">{entry.mood}</span>
                    </div>
                    <p className="text-muted-foreground">{entry.content}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {entry.triggers.map((trigger, i) => (
                        <span key={i} className="text-xs bg-accent/30 px-2 py-1 rounded">{trigger}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      case 'gratitude':
        return (
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4">
                {language === 'en' ? 'Gratitude Journal' : 'مذكرات الامتنان'}
              </h2>
              <p className="text-muted-foreground mb-4">
                {language === 'en' 
                  ? 'Record what you\'re grateful for to improve your mental well-being.' 
                  : 'سجل ما أنت ممتن له لتحسين صحتك النفسية.'}
              </p>
              {/* Placeholder for gratitude entries */}
              <div className="bg-accent/10 rounded-lg p-6 text-center">
                <p>{language === 'en' ? 'No gratitude entries yet.' : 'لا توجد مدخلات امتنان حتى الآن.'}</p>
              </div>
            </CardContent>
          </Card>
        );
      case 'goals':
        return (
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4">
                {language === 'en' ? 'Your Goals' : 'أهدافك'}
              </h2>
              <p className="text-muted-foreground mb-4">
                {language === 'en' 
                  ? 'Set and track your personal growth goals.' 
                  : 'حدد وتتبع أهداف نموك الشخصي.'}
              </p>
              {/* Placeholder for goals */}
              <div className="bg-accent/10 rounded-lg p-6 text-center">
                <p>{language === 'en' ? 'No goals set yet.' : 'لم يتم تحديد أهداف بعد.'}</p>
              </div>
            </CardContent>
          </Card>
        );
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

  return (
    <div className={`container py-8 ${language === 'ar' ? 'arabic text-right' : ''}`}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h1 className="text-3xl font-bold header-gradient mb-4 md:mb-0">
          {language === 'en' ? 'MindTrack Dashboard' : 'لوحة تحكم مايند تراك'}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-4">
              <div className="space-y-4">
                <div>
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md border"
                  />
                </div>
                <MindTrackNavigation activePage={activeTab} />
                <NeedHelpCard />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {renderActiveComponent()}
          
          {/* Only show mood trends if on mood tab */}
          {activeTab === 'mood' && (
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">
                  {language === 'en' ? 'Mood Trends' : 'اتجاهات المزاج'}
                </h2>
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
                  <span>{language === 'en' ? '3 - Neutral' : '٣ - محايد'}</span>
                  <span>{language === 'en' ? '5 - Excellent' : '٥ - ممتاز'}</span>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* AI Insights Card */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">
                {language === 'en' ? 'AI Insights' : 'رؤى الذكاء الاصطناعي'}
              </h2>
              <div className="bg-accent/10 p-4 rounded-lg">
                <p className="text-sm italic text-muted-foreground">
                  {language === 'en' 
                    ? '"Based on your recent mood patterns, you seem to experience higher moods on weekends. Consider activities that bring you joy during weekdays to maintain more balanced emotions."'
                    : '"بناءً على أنماط مزاجك الأخيرة، يبدو أنك تشعر بمزاج أفضل في عطلات نهاية الأسبوع. فكر في أنشطة تجلب لك الفرح خلال أيام الأسبوع للحفاظ على مشاعر أكثر توازناً."'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
