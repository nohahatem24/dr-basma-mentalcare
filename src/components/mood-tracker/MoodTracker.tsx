
import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/components/Header';
import { Brain } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MoodForm } from './MoodForm';
import { MoodGraph } from './MoodGraph';
import { MoodHistory } from './MoodHistory';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

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
  const navigate = useNavigate();
  
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

  const handleAddMoodEntry = (formData: { mood: number; notes: string; triggers: string[] }) => {
    // If editing an existing entry
    if (editingId) {
      const updatedEntries = moodEntries.map(entry =>
        entry.id === editingId
          ? { ...entry, mood: formData.mood, notes: formData.notes, triggers: formData.triggers }
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
        mood: formData.mood,
        notes: formData.notes,
        triggers: formData.triggers
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
    setEditingId(null);
    setIsAdding(false);
  };

  const getEditingEntry = () => {
    if (!editingId) return null;
    return moodEntries.find(entry => entry.id === editingId);
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
        {/* Mood Graph */}
        <div>
          <MoodGraph moodEntries={moodEntries} />
        </div>

        {/* Mood Form */}
        {isAdding ? (
          <MoodForm
            initialMood={getEditingEntry()?.mood || 0}
            initialNotes={getEditingEntry()?.notes || ''}
            initialTriggers={getEditingEntry()?.triggers || []}
            isEditing={!!editingId}
            onSave={handleAddMoodEntry}
            onCancel={resetForm}
          />
        ) : (
          <Button
            onClick={() => setIsAdding(true)}
            className="w-full"
          >
            {language === 'en' ? 'Track My Mood Now' : 'تتبع مزاجي الآن'}
          </Button>
        )}

        {/* Mood History */}
        <MoodHistory
          moodEntries={moodEntries}
          onEditEntry={handleEditEntry}
          onDeleteEntry={handleDeleteEntry}
        />
      </CardContent>
      <CardFooter>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => navigate('/report', { state: { moodEntries } })}
        >
          {language === 'en' ? 'View Full Report' : 'عرض التقرير الكامل'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MoodTracker;
