import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';
import { Heart, Plus, Edit2, Trash2, Calendar } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';

interface GratitudeEntry {
  id: string;
  date: Date;
  items: string[];
  reflection: string;
}

const Gratitude = () => {
  const { language } = useLanguage();
  const [entries, setEntries] = useState<GratitudeEntry[]>([]);
  const [currentItems, setCurrentItems] = useState<string[]>(['', '', '']);
  const [reflection, setReflection] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [activeTab, setActiveTab] = useState('write');

  useEffect(() => {
    const savedEntries = localStorage.getItem('gratitude_entries');
    if (savedEntries) {
      try {
        const parsed = JSON.parse(savedEntries);
        setEntries(parsed.map((entry: any) => ({
          ...entry,
          date: new Date(entry.date)
        })));
      } catch (error) {
        console.error('Error loading gratitude entries:', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('gratitude_entries', JSON.stringify(entries));
  }, [entries]);

  const updateItem = (index: number, value: string) => {
    const newItems = [...currentItems];
    newItems[index] = value;
    setCurrentItems(newItems);
  };

  const saveEntry = () => {
    const filledItems = currentItems.filter(item => item.trim() !== '');
    if (filledItems.length === 0) return;

    const newEntry: GratitudeEntry = {
      id: Date.now().toString(),
      date: selectedDate,
      items: filledItems,
      reflection: reflection.trim()
    };

    setEntries(prev => [...prev, newEntry]);
    setCurrentItems(['', '', '']);
    setReflection('');
    setActiveTab('history');
  };

  const deleteEntry = (id: string) => {
    setEntries(prev => prev.filter(entry => entry.id !== id));
  };

  const formatDate = (date: Date) => {
    return format(date, language === 'en' ? 'MMMM d, yyyy' : 'yyyy/MM/dd');
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="write">
            {language === 'en' ? 'Daily Gratitude' : 'الامتنان اليومي'}
          </TabsTrigger>
          <TabsTrigger value="history">
            {language === 'en' ? 'History' : 'السجل'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="write">
          <Card>
            <CardHeader>
              <CardTitle>
                {language === 'en' ? 'Daily Gratitude Practice' : 'ممارسة الامتنان اليومية'}
              </CardTitle>
              <CardDescription>
                {language === 'en' 
                  ? 'Write three things you are grateful for today' 
                  : 'اكتب ثلاثة أشياء تشعر بالامتنان لها اليوم'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>
                  {language === 'en' ? 'Date' : 'التاريخ'}
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left">
                      <Calendar className="mr-2 h-4 w-4" />
                      {formatDate(selectedDate)}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => date && setSelectedDate(date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-4">
                {currentItems.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <Label>
                      {language === 'en' 
                        ? `Grateful for #${index + 1}` 
                        : `ممتن لـ #${index + 1}`}
                    </Label>
                    <Input
                      value={item}
                      onChange={(e) => updateItem(index, e.target.value)}
                      placeholder={language === 'en' 
                        ? 'I am grateful for...' 
                        : 'أنا ممتن لـ...'}
                    />
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <Label>
                  {language === 'en' ? 'Reflection (Optional)' : 'تأمل (اختياري)'}
                </Label>
                <Textarea
                  value={reflection}
                  onChange={(e) => setReflection(e.target.value)}
                  placeholder={language === 'en' 
                    ? 'How did these things impact your day?' 
                    : 'كيف أثرت هذه الأشياء على يومك؟'}
                  className="min-h-[100px]"
                />
              </div>

              <Button 
                onClick={saveEntry}
                className="w-full"
                disabled={!currentItems.some(item => item.trim() !== '')}
              >
                <Heart className="mr-2 h-4 w-4" />
                {language === 'en' ? 'Save Gratitude Entry' : 'حفظ مدخلة الامتنان'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>
                  {language === 'en' ? 'Gratitude Journal' : 'سجل الامتنان'}
                </CardTitle>
                <Button variant="outline" onClick={() => setActiveTab('write')}>
                  <Plus className="h-4 w-4 mr-2" />
                  {language === 'en' ? 'New Entry' : 'مدخلة جديدة'}
                </Button>
              </div>
              <CardDescription>
                {language === 'en' 
                  ? 'Review your past gratitude entries' 
                  : 'مراجعة مدخلات الامتنان السابقة'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px] pr-4">
                <div className="space-y-4">
                  {entries.length === 0 ? (
                    <div className="text-center py-12">
                      <Heart className="h-12 w-12 mx-auto opacity-30 mb-4" />
                      <p className="text-muted-foreground">
                        {language === 'en' 
                          ? 'No gratitude entries yet.' 
                          : 'لا توجد مدخلات امتنان حتى الآن.'}
                      </p>
                      <Button 
                        variant="link" 
                        onClick={() => setActiveTab('write')}
                      >
                        {language === 'en' 
                          ? 'Start your gratitude practice!' 
                          : 'ابدأ ممارسة الامتنان!'}
                      </Button>
                    </div>
                  ) : (
                    entries
                      .sort((a, b) => b.date.getTime() - a.date.getTime())
                      .map(entry => (
                        <Card key={entry.id} className="relative">
                          <CardContent className="pt-6">
                            <div className="absolute top-2 right-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => deleteEntry(entry.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="mb-4 text-sm text-muted-foreground">
                              {formatDate(entry.date)}
                            </div>
                            <ul className="space-y-2 mb-4">
                              {entry.items.map((item, index) => (
                                <li key={index} className="flex items-start gap-2">
                                  <Heart className="h-4 w-4 mt-1 text-primary" />
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                            {entry.reflection && (
                              <div className="bg-muted p-3 rounded-md text-sm">
                                {entry.reflection}
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Gratitude; 