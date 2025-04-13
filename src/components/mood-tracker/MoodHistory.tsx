
import React from 'react';
import { useLanguage } from '@/components/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Edit, Trash } from 'lucide-react';
import { MoodEntryCard } from './MoodEntryCard';

export interface MoodEntry {
  id: string;
  date: Date;
  mood: number;
  notes: string;
  triggers: string[];
}

interface MoodHistoryProps {
  moodEntries: MoodEntry[];
  onEditEntry: (entry: MoodEntry) => void;
  onDeleteEntry: (id: string) => Promise<void> | void;
  isLoading?: boolean;
}

export const MoodHistory: React.FC<MoodHistoryProps> = ({ 
  moodEntries, 
  onEditEntry, 
  onDeleteEntry,
  isLoading = false
}) => {
  const { language } = useLanguage();

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          {language === 'en' ? 'Loading mood entries...' : 'جاري تحميل مدخلات المزاج...'}
        </p>
      </div>
    );
  }

  if (moodEntries.length === 0) {
    return (
      <div className="text-center py-8 bg-accent/10 rounded-lg">
        <p>
          {language === 'en' 
            ? 'No mood entries recorded yet. Track your mood to see them here.'
            : 'لم يتم تسجيل مدخلات المزاج بعد. سجل مزاجك لتراها هنا.'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">
        {language === 'en' ? 'Mood History' : 'سجل المزاج'}
      </h3>
      <ScrollArea className="h-[300px]">
        <div className="space-y-3">
          {moodEntries.map((entry) => (
            <Card key={entry.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <MoodEntryCard 
                      entry={entry} 
                      onEdit={onEditEntry}
                      onDelete={onDeleteEntry}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default MoodHistory;
