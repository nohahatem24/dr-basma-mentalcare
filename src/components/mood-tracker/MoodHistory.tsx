
import React from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from 'lucide-react';
import { useLanguage } from '@/components/Header';
import { MoodEntryCard } from './MoodEntryCard';

interface MoodHistoryProps {
  moodEntries: {
    id: string;
    date: Date;
    mood: number;
    notes: string;
    triggers: string[];
  }[];
  onEditEntry: (entry: any) => void;
  onDeleteEntry: (id: string) => void;
}

export const MoodHistory: React.FC<MoodHistoryProps> = ({
  moodEntries,
  onEditEntry,
  onDeleteEntry,
}) => {
  const { language } = useLanguage();

  return (
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
            <MoodEntryCard
              key={entry.id}
              entry={entry}
              onEdit={onEditEntry}
              onDelete={onDeleteEntry}
            />
          ))}
        </div>
      )}
    </div>
  );
};
