
import React from 'react';
import { useLanguage } from '@/components/Header';
import { Card, CardContent } from '@/components/ui/card';

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

const JournalEntries = () => {
  const { language } = useLanguage();
  
  // Get the appropriate journal entries based on language
  const journalEntries = language === 'en' ? mockJournalEntries : mockJournalEntriesAr;

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
};

export default JournalEntries;
