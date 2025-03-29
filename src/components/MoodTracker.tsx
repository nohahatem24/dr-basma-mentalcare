
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/components/Header';
import { Brain, Edit, Trash2, Plus, Calendar } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface MoodEntry {
  id: string;
  date: Date;
  mood: number;
  notes: string;
  triggers: string[];
}

const MoodTracker = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [mood, setMood] = useState(0);
  const [notes, setNotes] = useState('');
  const [trigger, setTrigger] = useState('');
  const [triggers, setTriggers] = useState<string[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([
    {
      id: '1',
      date: new Date(),
      mood: 5,
      notes: language === 'en' ? 'Feeling good today' : 'أشعر بتحسن اليوم',
      triggers: [language === 'en' ? 'Good sleep' : 'نوم جيد', language === 'en' ? 'Exercise' : 'تمرين']
    },
    {
      id: '2',
      date: new Date(Date.now() - 86400000),
      mood: -3,
      notes: language === 'en' ? 'Stressed about work deadline' : 'متوتر بشأن موعد نهائي للعمل',
      triggers: [language === 'en' ? 'Work' : 'العمل', language === 'en' ? 'Lack of sleep' : 'قلة النوم']
    }
  ]);
  
  const handleAddMoodEntry = () => {
    // If editing an existing entry
    if (editingId) {
      const updatedEntries = moodEntries.map(entry => 
        entry.id === editingId 
          ? { ...entry, mood, notes, triggers } 
          : entry
      );
      
      setMoodEntries(updatedEntries);
      toast({
        title: language === 'en' ? 'Mood Entry Updated' : 'تم تحديث إدخال المزاج',
        description: language === 'en' ? 'Your mood entry has been updated.' : 'تم تحديث إدخال المزاج الخاص بك.',
      });
    } else {
      // Adding a new entry
      const newEntry: MoodEntry = {
        id: Date.now().toString(),
        date: new Date(),
        mood,
        notes,
        triggers
      };
      
      setMoodEntries([newEntry, ...moodEntries]);
      toast({
        title: language === 'en' ? 'Mood Tracked' : 'تم تتبع المزاج',
        description: language === 'en' ? 'Your mood has been recorded.' : 'تم تسجيل مزاجك.',
      });
    }
    
    // Reset form
    resetForm();
  };
  
  const handleEditEntry = (entry: MoodEntry) => {
    setMood(entry.mood);
    setNotes(entry.notes);
    setTriggers([...entry.triggers]);
    setEditingId(entry.id);
    setIsAdding(true);
  };
  
  const handleDeleteEntry = (id: string) => {
    setMoodEntries(moodEntries.filter(entry => entry.id !== id));
    toast({
      title: language === 'en' ? 'Entry Deleted' : 'تم حذف الإدخال',
      description: language === 'en' ? 'The mood entry has been removed.' : 'تمت إزالة إدخال المزاج.',
    });
  };
  
  const resetForm = () => {
    setMood(0);
    setNotes('');
    setTrigger('');
    setTriggers([]);
    setEditingId(null);
    setIsAdding(false);
  };
  
  const handleAddTrigger = () => {
    if (!trigger.trim()) return;
    setTriggers([...triggers, trigger]);
    setTrigger('');
  };
  
  const handleRemoveTrigger = (index: number) => {
    const newTriggers = [...triggers];
    newTriggers.splice(index, 1);
    setTriggers(newTriggers);
  };
  
  const getMoodLabel = (moodValue: number) => {
    if (moodValue >= 8) return language === 'en' ? 'Excellent' : 'ممتاز';
    if (moodValue >= 5) return language === 'en' ? 'Very Good' : 'جيد جدا';
    if (moodValue >= 2) return language === 'en' ? 'Good' : 'جيد';
    if (moodValue >= 0) return language === 'en' ? 'Neutral' : 'محايد';
    if (moodValue >= -2) return language === 'en' ? 'Low' : 'منخفض';
    if (moodValue >= -5) return language === 'en' ? 'Poor' : 'سيء';
    if (moodValue >= -8) return language === 'en' ? 'Very Poor' : 'سيء جدا';
    return language === 'en' ? 'Terrible' : 'سيء للغاية';
  };
  
  const getMoodColor = (moodValue: number) => {
    if (moodValue >= 5) return 'bg-green-100 text-green-800';
    if (moodValue >= 0) return 'bg-blue-100 text-blue-800';
    if (moodValue >= -5) return 'bg-amber-100 text-amber-800';
    return 'bg-red-100 text-red-800';
  };
  
  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'short',
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    
    return new Intl.DateTimeFormat(language === 'en' ? 'en-US' : 'ar-EG', options).format(date);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          {language === 'en' ? 'Mood Tracker' : 'متتبع المزاج'}
        </CardTitle>
        <CardDescription>
          {language === 'en'
            ? 'Track your mood on a scale from -10 to 10'
            : 'تتبع مزاجك على مقياس من -١٠ إلى ١٠'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {isAdding ? (
          <div className="space-y-4 bg-accent/10 p-4 rounded-lg">
            <h3 className="font-medium">
              {editingId 
                ? language === 'en' ? 'Edit Mood Entry' : 'تعديل إدخال المزاج'
                : language === 'en' ? 'How are you feeling?' : 'كيف تشعر؟'}
            </h3>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>
                  {language === 'en' ? 'Your Mood (-10 to 10)' : 'مزاجك (-١٠ إلى ١٠)'}
                </Label>
                <span className={`text-sm px-2 py-1 rounded-full ${getMoodColor(mood)}`}>
                  {mood} - {getMoodLabel(mood)}
                </span>
              </div>
              
              <div className="py-4">
                <div className="flex justify-between text-xs mb-2">
                  <span>-10</span>
                  <span>0</span>
                  <span>10</span>
                </div>
                <Slider
                  value={[mood]}
                  min={-10}
                  max={10}
                  step={1}
                  onValueChange={([value]) => setMood(value)}
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>{language === 'en' ? 'Very Negative' : 'سلبي جدًا'}</span>
                  <span>{language === 'en' ? 'Neutral' : 'محايد'}</span>
                  <span>{language === 'en' ? 'Very Positive' : 'إيجابي جدًا'}</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>
                {language === 'en' ? 'Notes' : 'ملاحظات'}
              </Label>
              <Input
                placeholder={language === 'en' ? 'Add details about your mood...' : 'أضف تفاصيل حول مزاجك...'}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label>
                {language === 'en' ? 'Triggers' : 'المحفزات'}
              </Label>
              <div className="flex gap-2">
                <Input
                  placeholder={language === 'en' ? 'Add a trigger...' : 'أضف محفزًا...'}
                  value={trigger}
                  onChange={(e) => setTrigger(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddTrigger()}
                />
                <Button type="button" variant="outline" onClick={handleAddTrigger}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              {triggers.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {triggers.map((item, index) => (
                    <div 
                      key={index} 
                      className="bg-accent/50 px-2 py-1 rounded-full text-sm flex items-center gap-1"
                    >
                      {item}
                      <button 
                        type="button"
                        onClick={() => handleRemoveTrigger(index)}
                        className="h-4 w-4 rounded-full bg-muted/20 flex items-center justify-center hover:bg-muted/40"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex gap-2">
              <Button onClick={handleAddMoodEntry}>
                {editingId
                  ? language === 'en' ? 'Save Changes' : 'حفظ التغييرات'
                  : language === 'en' ? 'Save Mood' : 'حفظ المزاج'}
              </Button>
              <Button variant="outline" onClick={resetForm}>
                {language === 'en' ? 'Cancel' : 'إلغاء'}
              </Button>
            </div>
          </div>
        ) : (
          <Button
            onClick={() => setIsAdding(true)}
            className="w-full"
          >
            {language === 'en' ? 'Track My Mood Now' : 'تتبع مزاجي الآن'}
          </Button>
        )}
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-medium">
              {language === 'en' ? 'Mood History' : 'سجل المزاج'}
            </h3>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  {language === 'en' ? 'Filter' : 'تصفية'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-4">
                <div className="space-y-2">
                  <h4 className="font-medium">
                    {language === 'en' ? 'View Entries For' : 'عرض الإدخالات لـ'}
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm" className="w-full">
                      {language === 'en' ? 'Today' : 'اليوم'}
                    </Button>
                    <Button variant="outline" size="sm" className="w-full">
                      {language === 'en' ? 'Yesterday' : 'أمس'}
                    </Button>
                    <Button variant="outline" size="sm" className="w-full">
                      {language === 'en' ? 'This Week' : 'هذا الأسبوع'}
                    </Button>
                    <Button variant="outline" size="sm" className="w-full">
                      {language === 'en' ? 'This Month' : 'هذا الشهر'}
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          
          {moodEntries.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              {language === 'en'
                ? 'No mood entries yet. Track your first mood!'
                : 'لا توجد إدخالات مزاجية حتى الآن. تتبع مزاجك الأول!'}
            </p>
          ) : (
            <div className="space-y-3">
              {moodEntries.map((entry) => (
                <Card key={entry.id} className="overflow-hidden">
                  <div className="p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-sm px-2 py-1 rounded-full ${getMoodColor(entry.mood)}`}>
                            {entry.mood} - {getMoodLabel(entry.mood)}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(new Date(entry.date))}
                        </p>
                      </div>
                      
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleEditEntry(entry)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => handleDeleteEntry(entry.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {entry.notes && (
                      <p className="text-sm mt-2">{entry.notes}</p>
                    )}
                    
                    {entry.triggers.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {entry.triggers.map((trigger, index) => (
                          <span 
                            key={index} 
                            className="bg-muted/50 px-2 py-0.5 rounded-full text-xs"
                          >
                            {trigger}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          {language === 'en' ? 'View All Mood Entries' : 'عرض جميع إدخالات المزاج'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MoodTracker;
