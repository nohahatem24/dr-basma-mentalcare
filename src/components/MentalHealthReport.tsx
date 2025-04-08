
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/components/Header';
import { Download, Calendar as CalendarIcon, FileDown, LineChart, Brain, Printer, Send } from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

type ReportFrequency = 'daily' | 'weekly' | 'monthly' | 'custom';

const MentalHealthReport = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  
  const [frequency, setFrequency] = useState<ReportFrequency>('weekly');
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportGenerated, setReportGenerated] = useState(false);
  
  const handleGenerateReport = () => {
    if (!startDate || !endDate) {
      toast({
        title: language === 'en' ? 'Date selection required' : 'اختيار التاريخ مطلوب',
        description: language === 'en' ? 'Please select both start and end dates.' : 'يرجى تحديد تاريخي البداية والنهاية.',
        variant: 'destructive',
      });
      return;
    }
    
    if (endDate < startDate) {
      toast({
        title: language === 'en' ? 'Invalid date range' : 'نطاق تاريخ غير صالح',
        description: language === 'en' ? 'End date must be after start date.' : 'يجب أن يكون تاريخ النهاية بعد تاريخ البداية.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsGenerating(true);
    
    // Simulate report generation
    setTimeout(() => {
      setIsGenerating(false);
      setReportGenerated(true);
      
      toast({
        title: language === 'en' ? 'Report Generated' : 'تم إنشاء التقرير',
        description: language === 'en' ? 'Your mental health report is ready to download.' : 'تقرير الصحة النفسية الخاص بك جاهز للتنزيل.',
      });
    }, 2000);
  };
  
  const handleDownloadReport = () => {
    toast({
      title: language === 'en' ? 'Report Downloaded' : 'تم تنزيل التقرير',
      description: language === 'en' ? 'Your report has been downloaded successfully.' : 'تم تنزيل تقريرك بنجاح.',
    });
  };
  
  const handlePrintReport = () => {
    toast({
      title: language === 'en' ? 'Printing Report' : 'جاري طباعة التقرير',
      description: language === 'en' ? 'Your report is being sent to your printer.' : 'يتم إرسال تقريرك إلى الطابعة.',
    });
    // In a real implementation, this would trigger the print dialog
    window.print();
  };
  
  const handleSendReport = () => {
    toast({
      title: language === 'en' ? 'Report Sent' : 'تم إرسال التقرير',
      description: language === 'en' ? 'Your report has been sent to Dr. Basma.' : 'تم إرسال تقريرك إلى الدكتورة بسمة.',
    });
  };
  
  const formatDate = (date: Date | undefined) => {
    if (!date) return '';
    return format(date, 'PPP');
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileDown className="h-5 w-5" />
          {language === 'en' ? 'Mental Health Report' : 'تقرير الصحة النفسية'}
        </CardTitle>
        <CardDescription>
          {language === 'en'
            ? 'Generate a comprehensive report of your mental health data'
            : 'إنشاء تقرير شامل لبيانات صحتك النفسية'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="report-frequency">
            {language === 'en' ? 'Report Frequency' : 'تكرار التقرير'}
          </Label>
          <Select
            value={frequency}
            onValueChange={(value) => setFrequency(value as ReportFrequency)}
          >
            <SelectTrigger id="report-frequency">
              <SelectValue placeholder={language === 'en' ? 'Select frequency' : 'اختر التكرار'} />
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
              <SelectItem value="custom">
                {language === 'en' ? 'Custom Range' : 'نطاق مخصص'}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>
              {language === 'en' ? 'Start Date' : 'تاريخ البدء'}
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? formatDate(startDate) : language === 'en' ? 'Select date' : 'اختر التاريخ'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
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
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? formatDate(endDate) : language === 'en' ? 'Select date' : 'اختر التاريخ'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label>
            {language === 'en' ? 'Report Content' : 'محتوى التقرير'}
          </Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="include-mood" className="rounded text-primary" defaultChecked />
              <Label htmlFor="include-mood" className="cursor-pointer">
                <span className="flex items-center gap-1">
                  <Brain className="h-4 w-4" />
                  {language === 'en' ? 'Mood Patterns' : 'أنماط المزاج'}
                </span>
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="include-triggers" className="rounded text-primary" defaultChecked />
              <Label htmlFor="include-triggers" className="cursor-pointer">
                {language === 'en' ? 'Emotional Triggers' : 'المحفزات العاطفية'}
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="include-goals" className="rounded text-primary" defaultChecked />
              <Label htmlFor="include-goals" className="cursor-pointer">
                {language === 'en' ? 'Goal Progress' : 'تقدم الأهداف'}
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="include-gratitude" className="rounded text-primary" defaultChecked />
              <Label htmlFor="include-gratitude" className="cursor-pointer">
                {language === 'en' ? 'Gratitude Journal' : 'مجلة الامتنان'}
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="include-insights" className="rounded text-primary" defaultChecked />
              <Label htmlFor="include-insights" className="cursor-pointer">
                <span className="flex items-center gap-1">
                  <LineChart className="h-4 w-4" />
                  {language === 'en' ? 'AI Insights' : 'رؤى الذكاء الاصطناعي'}
                </span>
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="include-relationships" className="rounded text-primary" defaultChecked />
              <Label htmlFor="include-relationships" className="cursor-pointer">
                {language === 'en' ? 'Relationships' : 'العلاقات'}
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="include-cbt" className="rounded text-primary" defaultChecked />
              <Label htmlFor="include-cbt" className="cursor-pointer">
                {language === 'en' ? 'CBT Exercises' : 'تمارين CBT'}
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="include-dbt" className="rounded text-primary" defaultChecked />
              <Label htmlFor="include-dbt" className="cursor-pointer">
                {language === 'en' ? 'DBT Exercises' : 'تمارين DBT'}
              </Label>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-2">
        <Button 
          onClick={handleGenerateReport} 
          disabled={isGenerating || !startDate || !endDate}
          className="w-full sm:w-auto"
        >
          {isGenerating
            ? language === 'en' ? 'Generating...' : 'جاري الإنشاء...'
            : language === 'en' ? 'Generate Report' : 'إنشاء التقرير'}
        </Button>
        
        {reportGenerated && (
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button 
              variant="outline" 
              onClick={handleDownloadReport}
              className="w-full sm:w-auto"
            >
              <Download className="mr-2 h-4 w-4" />
              {language === 'en' ? 'Download PDF' : 'تنزيل PDF'}
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handlePrintReport}
              className="w-full sm:w-auto"
            >
              <Printer className="mr-2 h-4 w-4" />
              {language === 'en' ? 'Print' : 'طباعة'}
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handleSendReport}
              className="w-full sm:w-auto"
            >
              <Send className="mr-2 h-4 w-4" />
              {language === 'en' ? 'Send to Doctor' : 'إرسال إلى الطبيب'}
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default MentalHealthReport;
