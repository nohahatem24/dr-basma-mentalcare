
import React from 'react';
import { useLanguage } from '@/components/Header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import MoodChart from '@/components/dashboard/MoodChart';

interface MoodEntry {
  id: string;
  date: Date;
  mood: number;
  notes: string;
  triggers: string[];
}

interface MoodHistoryTabProps {
  isLoadingMoodEntries: boolean;
  moodEntries: MoodEntry[];
  moodChartData: any[];
}

const MoodHistoryTab = ({ isLoadingMoodEntries, moodEntries, moodChartData }: MoodHistoryTabProps) => {
  const { language } = useLanguage();

  return (
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
  );
};

export default MoodHistoryTab;
