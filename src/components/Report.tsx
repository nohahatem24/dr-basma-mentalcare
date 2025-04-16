
import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/components/Header';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { useLocation } from 'react-router-dom';
import { Printer } from 'lucide-react';

interface MoodEntry {
  id: string;
  date: Date;
  mood: number;
  notes: string;
  triggers: string[];
}

interface MoodTrend {
  date: string;
  mood: number;
}

interface PrintableReportProps {
  moodEntries: MoodEntry[];
  language: 'en' | 'ar';
}

const PrintableReport: React.FC<PrintableReportProps> = ({ moodEntries, language }) => {
  const processedEntries = [...moodEntries].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  const weeklyAverages = processWeeklyAverages(processedEntries);
  
  const triggerFrequency = processTriggerFrequency(processedEntries);
  
  const stats = calculateMoodStats(processedEntries);

  return (
    <div className="p-8 max-w-4xl mx-auto bg-white dark:bg-gray-950">
      <style>
        {`
          @media print {
            body {
              background-color: white !important;
              color: black !important;
            }
            .no-print {
              display: none !important;
            }
            .print-section {
              break-inside: avoid;
              page-break-inside: avoid;
            }
          }
        `}
      </style>
      
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">
          {language === 'en' ? 'Mental Health Report' : 'تقرير الصحة النفسية'}
        </h1>
        <p className="text-muted-foreground">
          {language === 'en' 
            ? `Generated on ${new Date().toLocaleDateString()}` 
            : `تم إنشاؤه في ${new Date().toLocaleDateString('ar-EG')}`}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 print-section">
        <div>
          <h2 className="text-xl font-semibold mb-4">
            {language === 'en' ? 'Mood Summary' : 'ملخص المزاج'}
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>{language === 'en' ? 'Average Mood' : 'متوسط المزاج'}</span>
              <span className="font-medium">{stats.average.toFixed(1)} / 10</span>
            </div>
            <div className="flex justify-between">
              <span>{language === 'en' ? 'Highest Mood' : 'أعلى مزاج'}</span>
              <span className="font-medium">{stats.highest} / 10</span>
            </div>
            <div className="flex justify-between">
              <span>{language === 'en' ? 'Lowest Mood' : 'أدنى مزاج'}</span>
              <span className="font-medium">{stats.lowest} / 10</span>
            </div>
            <div className="flex justify-between">
              <span>{language === 'en' ? 'Entries' : 'المدخلات'}</span>
              <span className="font-medium">{moodEntries.length}</span>
            </div>
            <div className="flex justify-between">
              <span>{language === 'en' ? 'Date Range' : 'النطاق الز������ني'}</span>
              <span className="font-medium">
                {stats.dateRange.start} - {stats.dateRange.end}
              </span>
            </div>
          </div>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">
            {language === 'en' ? 'Mood Analysis' : 'تحليل المزاج'}
          </h2>
          <div className="space-y-2">
            <p>
              {language === 'en'
                ? generateEnglishAnalysis(stats, moodEntries.length)
                : generateArabicAnalysis(stats, moodEntries.length)}
            </p>
            <p className="text-sm text-muted-foreground italic">
              {language === 'en'
                ? 'Note: This is an automated analysis based on your mood entries. It is not a professional diagnosis.'
                : 'ملاحظة: هذا تحليل آلي بناءً على إدخالات مزاجك. إنه ليس تشخيصًا مهنيًا.'}
            </p>
          </div>
        </div>
      </div>
      
      <div className="mb-8 print-section">
        <h2 className="text-xl font-semibold mb-4">
          {language === 'en' ? 'Mood Trends' : 'اتجاهات المزاج'}
        </h2>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weeklyAverages}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[-10, 10]} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="mood"
                stroke="#8884d8"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <p className="text-center text-sm text-muted-foreground mt-2">
          {language === 'en' ? 'Weekly mood averages over time' : 'متوسطات المزاج الأسبوعية عبر الزمن'}
        </p>
      </div>
      
      {triggerFrequency.length > 0 && (
        <div className="mb-8 print-section">
          <h2 className="text-xl font-semibold mb-4">
            {language === 'en' ? 'Common Triggers' : 'المحفزات الشائعة'}
          </h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={triggerFrequency}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="trigger" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="frequency" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-center text-sm text-muted-foreground mt-2">
            {language === 'en' 
              ? 'Frequency of reported triggers in your entries' 
              : 'تكرار المحفزات المبلغ عنها في إدخالاتك'}
          </p>
        </div>
      )}
      
      <div className="mb-8 print-section">
        <h2 className="text-xl font-semibold mb-4">
          {language === 'en' ? 'Recommendations' : 'التوصيات'}
        </h2>
        <div className="space-y-3">
          <p>
            {language === 'en' 
              ? generateEnglishRecommendations(stats) 
              : generateArabicRecommendations(stats)}
          </p>
        </div>
      </div>
      
      {moodEntries.length > 0 && (
        <div className="print-section">
          <h2 className="text-xl font-semibold mb-4">
            {language === 'en' ? 'Recent Entries' : 'المدخلات الأخيرة'}
          </h2>
          <div className="space-y-4">
            {moodEntries.slice(0, 3).map((entry, index) => (
              <div key={index} className="border rounded p-4">
                <div className="flex justify-between">
                  <span className="font-medium">
                    {new Date(entry.date).toLocaleDateString(
                      language === 'en' ? 'en-US' : 'ar-EG',
                      { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      }
                    )}
                  </span>
                  <span className={`font-semibold ${
                    entry.mood > 5 ? 'text-green-600' : 
                    entry.mood > 0 ? 'text-blue-600' : 
                    entry.mood > -5 ? 'text-orange-600' : 'text-red-600'
                  }`}>
                    {entry.mood > 0 ? '+' : ''}{entry.mood}
                  </span>
                </div>
                {entry.notes && (
                  <p className="text-sm mt-2">{entry.notes}</p>
                )}
                {entry.triggers && entry.triggers.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {entry.triggers.map((trigger, i) => (
                      <span key={i} className="bg-gray-200 dark:bg-gray-800 text-xs px-2 py-1 rounded">
                        {trigger}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="mt-8 text-center text-xs text-muted-foreground print-section">
        {language === 'en'
          ? 'This report is generated based on your tracked mood data. For professional mental health support, please consult a qualified therapist or counselor.'
          : 'تم إنشاء هذا التقرير بناءً على بيانات المزاج التي تم تتبعها. للحصول على دعم الصحة النفسية المهني، يرجى استشارة معالج أو مستشار مؤهل.'}
      </div>
    </div>
  );
};

const processWeeklyAverages = (entries: MoodEntry[]): MoodTrend[] => {
  if (entries.length === 0) return [];
  
  const weeklyData: { [key: string]: number[] } = {};
  
  entries.forEach(entry => {
    const date = new Date(entry.date);
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - date.getDay());
    const weekKey = `${weekStart.toISOString().substring(0, 10)}`;
    
    if (!weeklyData[weekKey]) {
      weeklyData[weekKey] = [];
    }
    
    weeklyData[weekKey].push(entry.mood);
  });
  
  return Object.entries(weeklyData).map(([date, moods]) => ({
    date,
    mood: moods.reduce((sum, val) => sum + val, 0) / moods.length
  })).sort((a, b) => a.date.localeCompare(b.date));
};

const processTriggerFrequency = (entries: MoodEntry[]): { trigger: string; frequency: number }[] => {
  const triggerCount: { [key: string]: number } = {};
  
  entries.forEach(entry => {
    (entry.triggers || []).forEach(trigger => {
      if (!triggerCount[trigger]) {
        triggerCount[trigger] = 0;
      }
      triggerCount[trigger]++;
    });
  });
  
  return Object.entries(triggerCount)
    .map(([trigger, frequency]) => ({ trigger, frequency }))
    .sort((a, b) => b.frequency - a.frequency)
    .slice(0, 5);
};

const calculateMoodStats = (entries: MoodEntry[]) => {
  if (entries.length === 0) {
    return {
      average: 0,
      highest: 0,
      lowest: 0,
      fluctuation: 0,
      trend: 0,
      dateRange: { start: 'N/A', end: 'N/A' }
    };
  }
  
  const moodValues = entries.map(entry => entry.mood);
  const average = moodValues.reduce((sum, val) => sum + val, 0) / moodValues.length;
  const highest = Math.max(...moodValues);
  const lowest = Math.min(...moodValues);
  const fluctuation = highest - lowest;
  
  let trend = 0;
  if (entries.length > 1) {
    const firstWeek = entries.slice(0, Math.max(Math.floor(entries.length / 4), 1));
    const lastWeek = entries.slice(-Math.max(Math.floor(entries.length / 4), 1));
    
    const firstAvg = firstWeek.reduce((sum, entry) => sum + entry.mood, 0) / firstWeek.length;
    const lastAvg = lastWeek.reduce((sum, entry) => sum + entry.mood, 0) / lastWeek.length;
    
    trend = lastAvg - firstAvg;
  }
  
  const sortedDates = [...entries].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  const startDate = new Date(sortedDates[0].date);
  const endDate = new Date(sortedDates[sortedDates.length - 1].date);
  
  return {
    average,
    highest,
    lowest,
    fluctuation,
    trend,
    dateRange: {
      start: startDate.toLocaleDateString(),
      end: endDate.toLocaleDateString()
    }
  };
};

const generateEnglishAnalysis = (stats: any, entriesCount: number) => {
  if (entriesCount < 3) {
    return 'Not enough data to provide an analysis yet. Please continue tracking your mood for more insights.';
  }
  
  let analysis = '';
  
  if (stats.average > 5) {
    analysis += 'Your average mood has been positive. ';
  } else if (stats.average > 0) {
    analysis += 'Your average mood has been mildly positive. ';
  } else if (stats.average > -5) {
    analysis += 'Your average mood has been mildly negative. ';
  } else {
    analysis += 'Your average mood has been negative. ';
  }
  
  if (Math.abs(stats.trend) < 1) {
    analysis += 'Your mood has been relatively stable. ';
  } else if (stats.trend > 1) {
    analysis += 'Your mood shows an improving trend. ';
  } else {
    analysis += 'Your mood shows a declining trend. ';
  }
  
  if (stats.fluctuation > 15) {
    analysis += 'You\'ve experienced significant mood fluctuations. ';
  } else if (stats.fluctuation > 10) {
    analysis += 'You\'ve experienced moderate mood fluctuations. ';
  } else {
    analysis += 'Your mood has been relatively consistent. ';
  }
  
  return analysis;
};

const generateArabicAnalysis = (stats: any, entriesCount: number) => {
  if (entriesCount < 3) {
    return 'لا توجد بيانات كافية لتقديم تحليل حتى الآن. يرجى الاستمرار في تتبع مزاجك للحصول على المزيد من الرؤى.';
  }
  
  let analysis = '';
  
  if (stats.average > 5) {
    analysis += 'كان متوسط مزاجك إيجابيًا. ';
  } else if (stats.average > 0) {
    analysis += 'كان متوسط مزاجك إيجابيًا بشكل معتدل. ';
  } else if (stats.average > -5) {
    analysis += 'كان متوسط مزاجك سلبيًا بشكل معتدل. ';
  } else {
    analysis += 'كان متوسط مزاجك سلبيًا. ';
  }
  
  if (Math.abs(stats.trend) < 1) {
    analysis += 'كان مزاجك مستقرًا نسبيًا. ';
  } else if (stats.trend > 1) {
    analysis += 'يُظهر مزاجك اتجاهًا نحو التحسن. ';
  } else {
    analysis += 'يُظهر مزاجك ��تجاهًا نحو ا��تراج��. ';
  }
  
  if (stats.fluctuation > 15) {
    analysis += 'لقد واجهت تقلبات كبيرة في المزاج. ';
  } else if (stats.fluctuation > 10) {
    analysis += 'لقد واجهت تقلبات معتدلة في المزاج. ';
  } else {
    analysis += 'كان مزاجك متسقًا نسبيًا. ';
  }
  
  return analysis;
};

const generateEnglishRecommendations = (stats: any) => {
  let recommendations = '';
  
  if (stats.average < 0) {
    recommendations += 'Consider seeking professional support if your low mood persists. Regular mindfulness practice and physical activity can help improve your mood. ';
  }
  
  if (stats.fluctuation > 10) {
    recommendations += 'Your mood shows significant fluctuations. Establishing regular routines for sleep, meals, and activities can help stabilize mood. ';
  }
  
  if (stats.trend < -2) {
    recommendations += 'Your mood shows a declining trend. It may be helpful to identify recent stressors and develop coping strategies. ';
  }
  
  if (recommendations === '') {
    recommendations = 'Continue with your current activities and self-care routines. Regular mood tracking helps you maintain awareness of your mental wellbeing.';
  }
  
  return recommendations;
};

const generateArabicRecommendations = (stats: any) => {
  let recommendations = '';
  
  if (stats.average < 0) {
    recommendations += 'فكر في طلب الدعم المهني إذا استمر مزاجك المنخفض. يمكن أن تساعد ممارسة اليقظة الذهنية والنشاط البدني المنتظم في تحسين مزاجك. ';
  }
  
  if (stats.fluctuation > 10) {
    recommendations += 'يُظهر مزاجك تقلبات كبيرة. يمكن أن يساعد وضع روتين منتظم للنوم والوجبات والأنشطة في استقرار المزاج. ';
  }
  
  if (stats.trend < -2) {
    recommendations += 'يُظهر مزاجك اتجاهًا نحو التراجع. قد يكون من المفيد تحديد الضغوطات الأخيرة وتطوير استراتيجيات للتأقلم. ';
  }
  
  if (recommendations === '') {
    recommendations = 'استمر في أنشطتك الحالية وروتين العناية الذاتية. يساعدك تتبع المزاج المنتظم على الحفاظ على الوعي برفاهيتك العقلية.';
  }
  
  return recommendations;
};

const Report = () => {
  const { language } = useLanguage();
  const reportRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const moodEntries: MoodEntry[] = location.state?.moodEntries || [];

  // Fixing the useReactToPrint hook implementation
  const handlePrint = useReactToPrint({
    documentTitle: language === 'en' ? 'Mental Health Report' : 'تقرير الصحة النفسية',
    onPrintError: (error) => console.error('Printing failed', error),
    // The correct way to use the content prop
    content: () => reportRef.current,
  });

  return (
    <div className="container py-8">
      <Card className="w-full shadow-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className={language === 'ar' ? 'text-right' : ''}>
            {language === 'en' ? 'Mental Health Report' : 'تقرير الصحة النفسية'}
          </CardTitle>
          <Button 
            variant="outline" 
            // Fixing the onClick handler - handlePrint is already a function
            onClick={() => handlePrint()}
            className="no-print"
          >
            <Printer className="mr-2 h-4 w-4" />
            {language === 'en' ? 'Print Report' : 'طباعة التقرير'}
          </Button>
        </CardHeader>
        
        <CardContent className="pb-8">
          <div ref={reportRef}>
            <PrintableReport moodEntries={moodEntries} language={language} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Report;
