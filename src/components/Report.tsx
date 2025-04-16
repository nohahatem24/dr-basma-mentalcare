
import React from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Printer, Download, LineChart, Brain, Heart, Target, Users } from 'lucide-react';
import { useMoodChartData } from '@/components/dashboard/MoodChartUtils';
import { format } from 'date-fns';

interface ReportProps {
  moodEntries: {
    date: Date;
    mood: number;
  }[];
  relationshipData: {
    label: string;
    value: number;
  }[];
  language: 'en' | 'ar';
}

const Report: React.FC<ReportProps> = ({ moodEntries, relationshipData, language }) => {
  // Prepare mood graph data for the Chart.js visualization
  const moodGraphData = {
    labels: moodEntries.map((entry) =>
      new Intl.DateTimeFormat(language === 'en' ? 'en-US' : 'ar-EG', {
        month: 'short',
        day: 'numeric',
      }).format(entry.date)
    ),
    datasets: [
      {
        label: language === 'en' ? 'Mood Over Time' : 'المزاج مع مرور الوقت',
        data: moodEntries.map((entry) => entry.mood),
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,0.2)',
        fill: true,
      },
    ],
  };

  const moodGraphOptions = {
    scales: {
      y: {
        min: -10,
        max: 10,
        title: {
          display: true,
          text: language === 'en' ? 'Mood Scale (-10 to 10)' : 'مقياس المزاج (-١٠ إلى ١٠)',
        },
      },
    },
    responsive: true,
    maintainAspectRatio: true,
  };

  const relationshipGraphData = {
    labels: relationshipData.map((item) => item.label),
    datasets: [
      {
        label: language === 'en' ? 'Relationship Quality' : 'جودة العلاقة',
        data: relationshipData.map((item) => item.value),
        backgroundColor: 'rgba(153,102,255,0.6)',
      },
    ],
  };

  const formatDate = (date: Date) => {
    return format(date, language === 'en' ? 'PPP' : 'yyyy/MM/dd');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto report-container">
      {/* Report Header */}
      <div className="text-center mb-8 print:mb-4">
        <h1 className="text-3xl font-bold mb-2">
          {language === 'en' ? 'Mental Health Report' : 'تقرير الصحة النفسية'}
        </h1>
        <p className="text-muted-foreground">
          {language === 'en' 
            ? `Generated on ${formatDate(new Date())}` 
            : `تم إنشاؤه في ${formatDate(new Date())}`}
        </p>
      </div>

      {/* Mood Graph Section */}
      <Card className="print:shadow-none print:border-none">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LineChart className="h-5 w-5" />
            {language === 'en' ? 'Mood Trends' : 'اتجاهات المزاج'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="h-[300px] w-full">
            <Line data={moodGraphData} options={moodGraphOptions} />
          </div>
          <div className="bg-muted p-4 rounded-md print:bg-transparent">
            <h3 className="font-medium mb-2">
              {language === 'en' ? 'Analysis:' : 'التحليل:'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {language === 'en' 
                ? 'Your mood patterns show fluctuations that may correlate with specific events or triggers. Consider noting activities on days with higher mood scores to identify positive influences.'
                : 'تظهر أنماط مزاجك تقلبات قد ترتبط بأحداث أو محفزات محددة. فكر في تدوين الأنشطة في الأيام ذات درجات المزاج الأعلى لتحديد التأثيرات الإيجابية.'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Relationship Tracker Section */}
      <Card className="print:shadow-none print:border-none">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            {language === 'en' ? 'Relationship Tracker' : 'متتبع العلاقات'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="h-[250px]">
            <Bar 
              data={relationshipGraphData}
              options={{
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                  y: {
                    beginAtZero: true,
                    max: 10
                  }
                }
              }}
            />
          </div>
          <div className="bg-muted p-4 rounded-md print:bg-transparent">
            <h3 className="font-medium mb-2">
              {language === 'en' ? 'Insights:' : 'الرؤى:'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {language === 'en' 
                ? 'Your relationships show varying levels of quality and interaction frequency. Consider dedicating more time to relationships that positively impact your mental wellbeing.'
                : 'تُظهر علاقاتك مستويات متفاوتة من الجودة وتكرار التفاعل. فكر في تخصيص المزيد من الوقت للعلاقات التي تؤثر بشكل إيجابي على صحتك النفسية.'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Goals Summary */}
      <Card className="print:shadow-none print:border-none">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            {language === 'en' ? 'Goals Summary' : 'ملخص الأهداف'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-muted p-4 rounded-md print:bg-transparent">
              <h3 className="font-medium mb-2">
                {language === 'en' ? 'Recommendations:' : 'التوصيات:'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {language === 'en' 
                  ? 'Setting SMART goals (Specific, Measurable, Achievable, Relevant, Time-bound) can help improve your mental wellbeing. Consider setting goals related to physical activity, mindfulness practice, and social connections.'
                  : 'يمكن أن يساعد تحديد أهداف SMART (محددة، قابلة للقياس، قابلة للتحقيق، ذات صلة، محددة زمنياً) في تحسين صحتك النفسية. فكر في تحديد أهداف تتعلق بالنشاط البدني وممارسة اليقظة الذهنية والروابط الاجتماعية.'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Final Summary */}
      <Card className="print:shadow-none print:border-none">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            {language === 'en' ? 'Overall Assessment' : 'التقييم العام'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm">
            {language === 'en' 
              ? 'This report provides an overview of your mental health patterns. Remember that mental health fluctuations are normal, and identifying patterns can help you develop strategies to manage your wellbeing. Consider discussing these insights with your therapist for personalized guidance.'
              : 'يوفر هذا التقرير نظرة عامة على أنماط صحتك النفسية. تذكر أن تقلبات الصحة النفسية أمر طبيعي، ويمكن أن يساعدك تحديد الأنماط في تطوير استراتيجيات لإدارة صحتك. فكر في مناقشة هذه الرؤى مع معالجك للحصول على إرشادات مخصصة.'}
          </p>
        </CardContent>
      </Card>

      {/* Print/Download Buttons - hidden when printing */}
      <div className="flex justify-end gap-2 print:hidden">
        <Button onClick={handlePrint} className="gap-2">
          <Printer className="h-4 w-4" />
          {language === 'en' ? 'Print Report' : 'طباعة التقرير'}
        </Button>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          {language === 'en' ? 'Download PDF' : 'تنزيل PDF'}
        </Button>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body {
            background: white;
            font-size: 12pt;
          }
          .report-container {
            padding: 0;
          }
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Report;
