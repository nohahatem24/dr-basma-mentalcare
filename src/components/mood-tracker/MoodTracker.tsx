
import React, { useState, useEffect } from 'react';
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
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';

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
  const { session } = useAuth();
  
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch mood entries when component mounts
  useEffect(() => {
    const fetchMoodEntries = async () => {
      if (!session.user) return;
      
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('mood_entries')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        if (data) {
          // Convert database entries to MoodEntry format
          const formattedEntries: MoodEntry[] = data.map(entry => ({
            id: entry.id,
            date: new Date(entry.created_at),
            mood: entry.mood_score,
            notes: entry.notes || '',
            triggers: entry.triggers || []
          }));
          
          setMoodEntries(formattedEntries);
        }
      } catch (error) {
        console.error('Error fetching mood entries:', error);
        toast({
          title: language === 'en' ? 'Error' : 'خطأ',
          description: language === 'en' ? 'Failed to fetch mood entries.' : 'فشل في جلب مدخلات المزاج.',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMoodEntries();
  }, [session.user, language, toast]);

  const handleAddMoodEntry = async (formData: { mood: number; notes: string; triggers: string[] }) => {
    if (!session.user) {
      toast({
        title: language === 'en' ? 'Authentication Required' : 'مطلوب المصادقة',
        description: language === 'en' ? 'Please sign in to track your mood.' : 'الرجاء تسجيل الدخول لتتبع مزاجك.',
        variant: 'destructive'
      });
      return;
    }
    
    try {
      // If editing an existing entry
      if (editingId) {
        const { error } = await supabase
          .from('mood_entries')
          .update({
            mood_score: formData.mood,
            notes: formData.notes,
            triggers: formData.triggers,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingId);
          
        if (error) throw error;
        
        // Update local state
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
        const { data, error } = await supabase
          .from('mood_entries')
          .insert({
            user_id: session.user.id,
            mood_score: formData.mood,
            notes: formData.notes,
            triggers: formData.triggers,
            mood_label: getMoodLabel(formData.mood)
          })
          .select();
          
        if (error) throw error;
        
        if (data && data[0]) {
          // Add new entry to local state
          const newEntry: MoodEntry = {
            id: data[0].id,
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
      }

      // Reset form
      resetForm();
    } catch (error) {
      console.error('Error saving mood entry:', error);
      toast({
        title: language === 'en' ? 'Error' : 'خطأ',
        description: language === 'en' ? 'Failed to save your mood entry.' : 'فشل في حفظ إدخال المزاج الخاص بك.',
        variant: 'destructive'
      });
    }
  };

  // Helper function to get mood label based on score
  const getMoodLabel = (score: number): string => {
    if (score >= 7) return 'excellent';
    if (score >= 3) return 'good';
    if (score >= 0) return 'neutral';
    if (score >= -3) return 'low';
    return 'very_low';
  };

  const handleEditEntry = (entry: MoodEntry) => {
    setEditingId(entry.id);
    setIsAdding(true);
  };

  const handleDeleteEntry = async (id: string) => {
    if (!session.user) return;
    
    try {
      const { error } = await supabase
        .from('mood_entries')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      // Update local state
      setMoodEntries(moodEntries.filter(entry => entry.id !== id));
      toast({
        title: language === 'en' ? 'Entry Deleted' : 'تم حذف الإدخال',
        description: language === 'en' ? 'The mood entry has been removed.' : 'تمت إزالة إدخال المزاج.',
      });
    } catch (error) {
      console.error('Error deleting mood entry:', error);
      toast({
        title: language === 'en' ? 'Error' : 'خطأ',
        description: language === 'en' ? 'Failed to delete the mood entry.' : 'فشل في حذف إدخال المزاج.',
        variant: 'destructive'
      });
    }
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
          isLoading={isLoading}
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
