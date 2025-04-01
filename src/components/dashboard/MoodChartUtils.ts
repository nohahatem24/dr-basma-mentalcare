
import { useLanguage } from '@/components/Header';
import type { MoodDataPoint } from './MoodChart';

export interface MoodEntry {
  id: string;
  date: Date;
  mood: number;
  notes: string;
  triggers: string[];
}

export const useMoodChartData = (moodEntries: MoodEntry[] = []): MoodDataPoint[] => {
  const { language } = useLanguage();
  
  if (!moodEntries || moodEntries.length === 0) {
    return [];
  }
  
  // Sort entries by date (newest first)
  const sortedEntries = [...moodEntries].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  // Take most recent 7 entries (or fewer if there aren't 7)
  const recentEntries = sortedEntries.slice(0, 7).reverse();
  
  // Map to format needed by MoodChart
  return recentEntries.map(entry => {
    const date = new Date(entry.date);
    const dayFormatter = new Intl.DateTimeFormat(language === 'en' ? 'en-US' : 'ar-EG', {
      weekday: 'short',
    });
    
    // Normalize the mood value from -10:10 to 1:5 scale
    const normalizedMood = Math.round(((entry.mood + 10) / 20) * 4) + 1;
    
    return {
      day: dayFormatter.format(date),
      mood: normalizedMood
    };
  });
};
