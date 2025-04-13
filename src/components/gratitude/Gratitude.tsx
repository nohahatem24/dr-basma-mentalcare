
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Heart, Plus, Calendar, Trash, Edit } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';

interface GratitudeEntry {
  id: string;
  content: string;
  created_at: string;
}

const Gratitude = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const { session } = useAuth();
  
  const [entries, setEntries] = useState<GratitudeEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [content, setContent] = useState('');
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
  
  useEffect(() => {
    if (session?.user) {
      fetchGratitudeEntries();
    }
  }, [session?.user]);
  
  const fetchGratitudeEntries = async () => {
    if (!session?.user) return;
    
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('gratitude_entries')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      setEntries(data || []);
    } catch (error) {
      console.error('Error fetching gratitude entries:', error);
      toast({
        title: language === 'en' ? 'Error' : 'خطأ',
        description: language === 'en' ? 'Failed to fetch gratitude entries.' : 'فشل في جلب مدخلات الامتنان.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSubmit = async () => {
    if (!session?.user) {
      toast({
        title: language === 'en' ? 'Authentication Required' : 'مطلوب المصادقة',
        description: language === 'en' ? 'Please sign in to add gratitude entries.' : 'الرجاء تسجيل الدخول لإضافة مدخلات الامتنان.',
        variant: 'destructive'
      });
      return;
    }
    
    if (!content.trim()) {
      toast({
        title: language === 'en' ? 'Error' : 'خطأ',
        description: language === 'en' ? 'Please enter what you are grateful for.' : 'الرجاء إدخال ما أنت ممتن له.',
        variant: 'destructive'
      });
      return;
    }
    
    try {
      // If editing an existing entry
      if (editingEntryId) {
        const { error } = await supabase
          .from('gratitude_entries')
          .update({ content })
          .eq('id', editingEntryId);
          
        if (error) throw error;
        
        toast({
          title: language === 'en' ? 'Entry Updated' : 'تم تحديث المدخل',
          description: language === 'en' ? 'Your gratitude entry has been updated.' : 'تم تحديث مدخل الامتنان الخاص بك.',
        });
      } else {
        // Adding a new entry
        const { data, error } = await supabase
          .from('gratitude_entries')
          .insert({
            user_id: session.user.id,
            content
          })
          .select();
          
        if (error) throw error;
        
        toast({
          title: language === 'en' ? 'Entry Added' : 'تمت إضافة المدخل',
          description: language === 'en' ? 'Your gratitude entry has been saved.' : 'تم حفظ مدخل الامتنان الخاص بك.',
        });
      }
      
      // Reset form and refresh entries
      setContent('');
      setEditingEntryId(null);
      await fetchGratitudeEntries();
    } catch (error) {
      console.error('Error saving gratitude entry:', error);
      toast({
        title: language === 'en' ? 'Error' : 'خطأ',
        description: language === 'en' ? 'Failed to save your gratitude entry.' : 'فشل في حفظ مدخل الامتنان الخاص بك.',
        variant: 'destructive'
      });
    }
  };
  
  const handleEdit = (entry: GratitudeEntry) => {
    setEditingEntryId(entry.id);
    setContent(entry.content);
  };
  
  const handleDelete = async (id: string) => {
    if (!confirm(language === 'en' ? 'Are you sure you want to delete this entry?' : 'هل أنت متأكد أنك تريد حذف هذا المدخل؟')) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('gratitude_entries')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      toast({
        title: language === 'en' ? 'Entry Deleted' : 'تم حذف المدخل',
        description: language === 'en' ? 'The gratitude entry has been deleted.' : 'تم حذف مدخل الامتنان.',
      });
      
      await fetchGratitudeEntries();
    } catch (error) {
      console.error('Error deleting gratitude entry:', error);
      toast({
        title: language === 'en' ? 'Error' : 'خطأ',
        description: language === 'en' ? 'Failed to delete the gratitude entry.' : 'فشل في حذف مدخل الامتنان.',
        variant: 'destructive'
      });
    }
  };
  
  const handleCancel = () => {
    setContent('');
    setEditingEntryId(null);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-primary" />
          {language === 'en' ? 'Gratitude Journal' : 'مذكرات الامتنان'}
        </CardTitle>
        <CardDescription>
          {language === 'en' 
            ? 'Record what you\'re grateful for to improve your mental well-being.' 
            : 'سجل ما أنت ممتن له لتحسين صحتك النفسية.'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={
              language === 'en'
                ? 'What are you grateful for today?'
                : 'ما الذي أنت ممتن له اليوم؟'
            }
            className="min-h-[100px]"
          />
          <div className="flex justify-end gap-2">
            {editingEntryId && (
              <Button variant="outline" onClick={handleCancel}>
                {language === 'en' ? 'Cancel' : 'إلغاء'}
              </Button>
            )}
            <Button onClick={handleSubmit}>
              {editingEntryId
                ? language === 'en' ? 'Update Entry' : 'تحديث المدخل'
                : language === 'en' ? 'Save Entry' : 'حفظ المدخل'}
            </Button>
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="font-medium">
            {language === 'en' ? 'Your Gratitude Entries' : 'مدخلات الامتنان الخاصة بك'}
          </h3>
          
          {isLoading ? (
            <p className="text-center text-muted-foreground py-4">
              {language === 'en' ? 'Loading entries...' : 'جاري تحميل المدخلات...'}
            </p>
          ) : entries.length === 0 ? (
            <div className="bg-accent/10 rounded-lg p-6 text-center">
              <p>{language === 'en' ? 'No gratitude entries yet.' : 'لا توجد مدخلات امتنان حتى الآن.'}</p>
            </div>
          ) : (
            <ScrollArea className="h-[300px]">
              <div className="space-y-3">
                {entries.map(entry => (
                  <div key={entry.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center text-xs text-muted-foreground mb-2">
                        <Calendar className="mr-1 h-3 w-3" />
                        {format(new Date(entry.created_at), 'PPP')}
                      </div>
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(entry)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(entry.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-muted-foreground">{entry.content}</p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default Gratitude;
