import React, { useState } from 'react';
import { useLanguage } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Calendar, Download, Printer, Send, BarChart2, LineChart, PieChart, Activity, Brain, Heart, Users } from 'lucide-react';
import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';

interface ReportConfig {
  frequency: 'daily' | 'weekly' | 'monthly';
  startDate: Date;
  endDate: Date;
  sections: string[];
}

const MentalHealthReport = () => {
  const { language } = useLanguage();
  const [config, setConfig] = useState<ReportConfig>({
    frequency: 'weekly',
    startDate: startOfWeek(new Date()),
    endDate: endOfWeek(new Date()),
    sections: [
      'mood_patterns',
      'gratitude',
      'cbt_exercises',
      'emotional_triggers',
      'ai_insights',
      'dbt_exercises',
      'goal_progress',
      'relationships'
    ]
  });

  const reportSections = [
    { id: 'mood_patterns', icon: LineChart, label: { en: 'Mood Patterns', ar: 'أنماط المزاج' } },
    { id: 'gratitude', icon: Heart, label: { en: 'Gratitude Journal', ar: 'يوميات الامتنان' } },
    { id: 'cbt_exercises', icon: Brain, label: { en: 'CBT Exercises', ar: 'تمارين CBT' } },
    { id: 'emotional_triggers', icon: Activity, label: { en: 'Emotional Triggers', ar: 'المحفزات العاطفية' } },
    { id: 'ai_insights', icon: BarChart2, label: { en: 'AI Insights', ar: 'تحليلات الذكاء الاصطناعي' } },
    { id: 'dbt_exercises', icon: Brain, label: { en: 'DBT Exercises', ar: 'تمارين DBT' } },
    { id: 'goal_progress', icon: PieChart, label: { en: 'Goal Progress', ar: 'تقدم الأهداف' } },
    { id: 'relationships', icon: Users, label: { en: 'Relationships', ar: 'العلاقات' } }
  ];

  const updateDateRange = (frequency: string) => {
    const today = new Date();
    let start: Date, end: Date;

    switch (frequency) {
      case 'daily':
        start = today;
        end = today;
        break;
      case 'weekly':
        start = startOfWeek(today);
        end = endOfWeek(today);
        break;
      case 'monthly':
        start = startOfMonth(today);
        end = endOfMonth(today);
        break;
      default:
        start = today;
        end = today;
    }

    setConfig(prev => ({
      ...prev,
      frequency: frequency as 'daily' | 'weekly' | 'monthly',
      startDate: start,
      endDate: end
    }));
  };

  const toggleSection = (sectionId: string) => {
    setConfig(prev => ({
      ...prev,
      sections: prev.sections.includes(sectionId)
        ? prev.sections.filter(id => id !== sectionId)
        : [...prev.sections, sectionId]
    }));
  };

  const formatDate = (date: Date) => {
    return format(date, language === 'en' ? 'MMMM d, yyyy' : 'yyyy/MM/dd');
  };

  const generateReport = () => {
    // Implementation for report generation
    console.log('Generating report with config:', config);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>
            {language === 'en' ? 'Mental Health Report' : 'تقرير الصحة النفسية'}
          </CardTitle>
          <CardDescription>
            {language === 'en'
              ? 'Generate comprehensive reports about your mental health journey'
              : 'إنشاء تقارير شاملة عن رحلة صحتك النفسية'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>
                  {language === 'en' ? 'Report Frequency' : 'تكرار التقرير'}
                </Label>
                <Select
                  value={config.frequency}
                  onValueChange={updateDateRange}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">
                      {language === 'en' ? 'Daily' : 'يومي'}
                    </SelectItem>
                    <SelectItem value="weekly">
                      {language === 'en' ? 'Weekly' : 'أسبوعي'}
                    </SelectItem>
                    <SelectItem value="monthly">
                      {language === 'en' ? 'Monthly' : 'شهري'}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>
                    {language === 'en' ? 'Start Date' : 'تاريخ البدء'}
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left">
                        <Calendar className="mr-2 h-4 w-4" />
                        {formatDate(config.startDate)}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={config.startDate}
                        onSelect={(date) => date && setConfig(prev => ({ ...prev, startDate: date }))}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>
                    {language === 'en' ? 'End Date' : 'تاريخ الانتهاء'}
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left">
                        <Calendar className="mr-2 h-4 w-4" />
                        {formatDate(config.endDate)}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={config.endDate}
                        onSelect={(date) => date && setConfig(prev => ({ ...prev, endDate: date }))}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Label>
                {language === 'en' ? 'Report Content' : 'محتوى التقرير'}
              </Label>
              <ScrollArea className="h-[200px] rounded-md border p-4">
                <div className="space-y-4">
                  {reportSections.map(section => (
                    <div key={section.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={section.id}
                        checked={config.sections.includes(section.id)}
                        onCheckedChange={() => toggleSection(section.id)}
                      />
                      <div className="flex items-center gap-2">
                        <section.icon className="h-4 w-4 text-muted-foreground" />
                        <Label htmlFor={section.id} className="cursor-pointer">
                          {language === 'en' ? section.label.en : section.label.ar}
                        </Label>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={generateReport}>
              <Download className="mr-2 h-4 w-4" />
              {language === 'en' ? 'Download PDF' : 'تحميل PDF'}
            </Button>
            <Button variant="outline" onClick={generateReport}>
              <Printer className="mr-2 h-4 w-4" />
              {language === 'en' ? 'Print' : 'طباعة'}
            </Button>
            <Button onClick={generateReport}>
              <Send className="mr-2 h-4 w-4" />
              {language === 'en' ? 'Send to Doctor' : 'إرسال إلى الطبيب'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            {language === 'en' ? 'Report Preview' : 'معاينة التقرير'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="min-h-[400px] flex items-center justify-center text-muted-foreground">
            {language === 'en'
              ? 'Configure and generate your report to see a preview'
              : 'قم بتكوين وإنشاء تقريرك لرؤية المعاينة'}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MentalHealthReport; 