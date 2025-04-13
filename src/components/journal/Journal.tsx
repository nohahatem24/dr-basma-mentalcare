import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CalendarIcon, Edit, Save, PlusCircle, Trash2, BookText, Calendar } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  mood: string;
  date: Date;
  tags: string[];
}

const moodOptions = [
  { value: 'happy', label: { en: 'Happy', ar: 'سعيد' } },
  { value: 'calm', label: { en: 'Calm', ar: 'هادئ' } },
  { value: 'anxious', label: { en: 'Anxious', ar: 'قلق' } },
  { value: 'sad', label: { en: 'Sad', ar: 'حزين' } },
  { value: 'angry', label: { en: 'Angry', ar: 'غاضب' } },
  { value: 'tired', label: { en: 'Tired', ar: 'متعب' } },
  { value: 'grateful', label: { en: 'Grateful', ar: 'ممتن' } },
  { value: 'excited', label: { en: 'Excited', ar: 'متحمس' } },
];

const promptsEN = [
  "What made you smile today?",
  "What's one challenge you overcame recently?",
  "Describe a moment where you felt proud of yourself.",
  "What are three things you're grateful for today?",
  "Write about something you're looking forward to.",
  "What's something you'd like to change about your day?",
  "Reflect on a recent interaction that affected you.",
  "What's one area you've noticed growth in yourself?",
  "Describe your current feelings without judgment."
];

const promptsAR = [
  "ما الذي جعلك تبتسم اليوم؟",
  "ما هو التحدي الذي تغلبت عليه مؤخرًا؟",
  "صف لحظة شعرت فيها بالفخر بنفسك.",
  "ما هي ثلاثة أشياء تشعر بالامتنان لها اليوم؟",
  "اكتب عن شيء تتطلع إليه.",
  "ما هو الشيء الذي ترغب في تغييره في يومك؟",
  "تأمل في تفاعل حديث أثر فيك.",
  "ما هو المجال الذي لاحظت فيه نموًا في نفسك؟",
  "صف مشاعرك الحالية دون إصدار أحكام."
];

const Journal = () => {
  const { language } = useLanguage();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [activeTab, setActiveTab] = useState<string>('write');
  const [currentEntry, setCurrentEntry] = useState<JournalEntry>({
    id: '',
    title: '',
    content: '',
    mood: 'calm',
    date: new Date(),
    tags: []
  });
  const [editMode, setEditMode] = useState<boolean>(false);
  const [newTag, setNewTag] = useState<string>('');
  const [randomPrompt, setRandomPrompt] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined);
  const [moodFilter, setMoodFilter] = useState<string>('');

  // Load entries from localStorage on component mount
  useEffect(() => {
    const savedEntries = localStorage.getItem('journal_entries');
    if (savedEntries) {
      try {
        const parsedEntries = JSON.parse(savedEntries);
        // Convert string dates back to Date objects
        const entriesWithDates = parsedEntries.map((entry: any) => ({
          ...entry,
          date: new Date(entry.date)
        }));
        setEntries(entriesWithDates);
      } catch (error) {
        console.error('Error parsing journal entries:', error);
      }
    }
  }, []);

  // Save entries to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('journal_entries', JSON.stringify(entries));
  }, [entries]);

  // Get a random writing prompt
  const getRandomPrompt = () => {
    const prompts = language === 'en' ? promptsEN : promptsAR;
    const randomIndex = Math.floor(Math.random() * prompts.length);
    setRandomPrompt(prompts[randomIndex]);
  };

  // Reset the form for a new entry
  const resetForm = () => {
    setCurrentEntry({
      id: '',
      title: '',
      content: '',
      mood: 'calm',
      date: new Date(),
      tags: []
    });
    setEditMode(false);
  };

  // Save/update the current entry
  const saveEntry = () => {
    if (!currentEntry.title || !currentEntry.content) return;

    if (editMode && currentEntry.id) {
      // Update existing entry
      setEntries(prevEntries =>
        prevEntries.map(entry => 
          entry.id === currentEntry.id ? currentEntry : entry
        )
      );
    } else {
      // Create new entry
      const newEntry = {
        ...currentEntry,
        id: Date.now().toString(),
        date: selectedDate || new Date()
      };
      setEntries(prevEntries => [...prevEntries, newEntry]);
    }

    resetForm();
    setActiveTab('entries');
  };

  // Edit an existing entry
  const editEntry = (entry: JournalEntry) => {
    setCurrentEntry(entry);
    setEditMode(true);
    setActiveTab('write');
  };

  // Delete an entry
  const deleteEntry = (id: string) => {
    setEntries(prevEntries => prevEntries.filter(entry => entry.id !== id));
  };

  // Add a tag to the current entry
  const addTag = () => {
    if (!newTag.trim() || currentEntry.tags.includes(newTag.trim())) return;
    setCurrentEntry(prev => ({
      ...prev,
      tags: [...prev.tags, newTag.trim()]
    }));
    setNewTag('');
  };

  // Remove a tag from the current entry
  const removeTag = (tagToRemove: string) => {
    setCurrentEntry(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  // Filter entries based on date and mood
  const filteredEntries = entries
    .filter(entry => !dateFilter || 
      (entry.date.getDate() === dateFilter.getDate() && 
       entry.date.getMonth() === dateFilter.getMonth() && 
       entry.date.getFullYear() === dateFilter.getFullYear())
    )
    .filter(entry => !moodFilter || entry.mood === moodFilter)
    .sort((a, b) => b.date.getTime() - a.date.getTime()); // Sort by date (newest first)

  // Get mood label based on selected mood and language
  const getMoodLabel = (moodValue: string) => {
    const mood = moodOptions.find(m => m.value === moodValue);
    return mood ? (language === 'en' ? mood.label.en : mood.label.ar) : moodValue;
  };

  // Format date based on language
  const formatDate = (date: Date) => {
    return format(date, language === 'en' ? 'MMMM d, yyyy' : 'yyyy/MM/dd');
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="write">
            {language === 'en' ? 'Write' : 'كتابة'}
          </TabsTrigger>
          <TabsTrigger value="entries">
            {language === 'en' ? 'My Entries' : 'مدخلاتي'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="write" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>
                {editMode 
                  ? (language === 'en' ? 'Edit Entry' : 'تعديل المدخلة') 
                  : (language === 'en' ? 'New Journal Entry' : 'مدخلة جديدة')}
              </CardTitle>
              <CardDescription>
                {language === 'en' 
                  ? 'Express your thoughts, feelings, and experiences' 
                  : 'عبر عن أفكارك ومشاعرك وتجاربك'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="journal-title">
                  {language === 'en' ? 'Title' : 'العنوان'}
                </Label>
                <Input 
                  id="journal-title"
                  value={currentEntry.title}
                  onChange={(e) => setCurrentEntry({...currentEntry, title: e.target.value})}
                  placeholder={language === 'en' ? 'Today was...' : 'كان اليوم...'}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="journal-mood">
                    {language === 'en' ? 'Mood' : 'المزاج'}
                  </Label>
                  <Select 
                    value={currentEntry.mood}
                    onValueChange={(value) => setCurrentEntry({...currentEntry, mood: value})}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={language === 'en' ? 'Select a mood' : 'اختر مزاجًا'} />
                    </SelectTrigger>
                    <SelectContent>
                      {moodOptions.map((mood) => (
                        <SelectItem key={mood.value} value={mood.value}>
                          {language === 'en' ? mood.label.en : mood.label.ar}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>
                    {language === 'en' ? 'Date' : 'التاريخ'}
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? formatDate(selectedDate) : (language === 'en' ? 'Pick a date' : 'اختر تاريخًا')}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="journal-content">
                    {language === 'en' ? 'Journal Content' : 'محتوى المذكرة'}
                  </Label>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={getRandomPrompt}
                  >
                    {language === 'en' ? 'Get Prompt' : 'احصل على اقتراح'}
                  </Button>
                </div>
                {randomPrompt && (
                  <div className="bg-muted p-2 rounded-md text-sm mb-2 italic">
                    {randomPrompt}
                  </div>
                )}
                <Textarea 
                  id="journal-content"
                  value={currentEntry.content}
                  onChange={(e) => setCurrentEntry({...currentEntry, content: e.target.value})}
                  placeholder={language === 'en' 
                    ? 'Write your thoughts here...' 
                    : 'اكتب أفكارك هنا...'}
                  className="min-h-[200px]"
                />
              </div>

              <div className="space-y-2">
                <Label>
                  {language === 'en' ? 'Tags' : 'التصنيفات'}
                </Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {currentEntry.tags.map(tag => (
                    <div 
                      key={tag} 
                      className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs flex items-center"
                    >
                      {tag}
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-4 w-4 ml-1"
                        onClick={() => removeTag(tag)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input 
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder={language === 'en' ? 'Add a tag' : 'أضف تصنيفًا'}
                    onKeyDown={(e) => e.key === 'Enter' && addTag()}
                  />
                  <Button onClick={addTag} size="sm">
                    <PlusCircle className="h-4 w-4 mr-1" />
                    {language === 'en' ? 'Add' : 'إضافة'}
                  </Button>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button 
                  variant="outline" 
                  onClick={resetForm}
                >
                  {language === 'en' ? 'Reset' : 'إعادة ضبط'}
                </Button>
                <Button onClick={saveEntry}>
                  <Save className="h-4 w-4 mr-1" />
                  {language === 'en' ? 'Save Entry' : 'حفظ المدخلة'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="entries">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>
                  {language === 'en' ? 'Journal Entries' : 'مدخلات المذكرات'}
                </CardTitle>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    resetForm();
                    setActiveTab('write');
                  }}
                >
                  <PlusCircle className="h-4 w-4 mr-1" />
                  {language === 'en' ? 'New Entry' : 'مدخلة جديدة'}
                </Button>
              </div>
              <CardDescription>
                {language === 'en' 
                  ? 'Review and reflect on your past entries' 
                  : 'مراجعة والتفكير في مدخلاتك السابقة'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="space-y-2">
                  <Label>
                    {language === 'en' ? 'Filter by Date' : 'تصفية حسب التاريخ'}
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start text-left font-normal"
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {dateFilter 
                          ? formatDate(dateFilter) 
                          : (language === 'en' ? 'All dates' : 'جميع التواريخ')}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={dateFilter}
                        onSelect={setDateFilter}
                        initialFocus
                      />
                      {dateFilter && (
                        <div className="p-2 border-t">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="w-full"
                            onClick={() => setDateFilter(undefined)}
                          >
                            {language === 'en' ? 'Clear filter' : 'مسح التصفية'}
                          </Button>
                        </div>
                      )}
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>
                    {language === 'en' ? 'Filter by Mood' : 'تصفية حسب المزاج'}
                  </Label>
                  <Select 
                    value={moodFilter}
                    onValueChange={setMoodFilter}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={language === 'en' ? 'All moods' : 'جميع المزاجات'} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">
                        {language === 'en' ? '- All moods -' : '- جميع المزاجات -'}
                      </SelectItem>
                      {moodOptions.map((mood) => (
                        <SelectItem key={mood.value} value={mood.value}>
                          {language === 'en' ? mood.label.en : mood.label.ar}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {filteredEntries.length === 0 ? (
                <div className="text-center py-12">
                  <BookText className="h-12 w-12 mx-auto opacity-30 mb-4" />
                  <p className="text-muted-foreground">
                    {language === 'en' 
                      ? 'No journal entries found.' 
                      : 'لم يتم العثور على مدخلات في المذكرات.'}
                  </p>
                  <Button 
                    variant="link" 
                    onClick={() => {
                      resetForm();
                      setActiveTab('write');
                    }}
                  >
                    {language === 'en' ? 'Create your first entry!' : 'إنشاء أول مدخلة لك!'}
                  </Button>
                </div>
              ) : (
                <ScrollArea className="h-[500px] pr-4">
                  <div className="space-y-4">
                    {filteredEntries.map(entry => (
                      <Card key={entry.id} className="relative">
                        <CardContent className="pt-6">
                          <div className="absolute top-2 right-2 flex gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => editEntry(entry)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => deleteEntry(entry.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="space-y-2 mb-4">
                            <h3 className="text-lg font-semibold">{entry.title}</h3>
                            <div className="flex justify-between text-sm text-muted-foreground">
                              <div>{formatDate(entry.date)}</div>
                              <div>{getMoodLabel(entry.mood)}</div>
                            </div>
                          </div>
                          <p className="whitespace-pre-line mb-4">{entry.content}</p>
                          {entry.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {entry.tags.map(tag => (
                                <div 
                                  key={tag} 
                                  className="bg-secondary text-secondary-foreground px-2 py-1 rounded-full text-xs"
                                >
                                  {tag}
                                </div>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Journal; 