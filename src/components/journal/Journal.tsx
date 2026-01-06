
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Edit, Trash, Calendar, Tag, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  tags: string[];
  created_at: string;
  sentiment?: string;
}

const Journal = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const { session } = useAuth();
  
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingEntry, setIsAddingEntry] = useState(false);
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
  
  // Form state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  
  // Fetch journal entries on component mount
  useEffect(() => {
    fetchEntries();
  }, [session?.user]);
  
  const fetchEntries = async () => {
    if (!session?.user) return;
    
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      setEntries(data || []);
    } catch (error) {
      console.error('Error fetching journal entries:', error);
      toast({
        title: language === 'en' ? 'Error' : 'خطأ',
        description: language === 'en' ? 'Failed to fetch journal entries.' : 'فشل في جلب مدخلات المذكرات.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const resetForm = () => {
    setTitle('');
    setContent('');
    setTags([]);
    setTagInput('');
    setIsAddingEntry(false);
    setEditingEntryId(null);
  };
  
  const addTag = () => {
    if (!tagInput.trim()) return;
    if (!tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
    }
    setTagInput('');
  };
  
  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  
  const handleTagInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };
  
  const handleSaveEntry = async () => {
    /*if (!session?.user) {
      toast({
        title: language === 'en' ? 'Authentication Required' : 'مطلوب المصادقة',
        description: language === 'en' ? 'Please sign in to save journal entries.' : 'الرجاء تسجيل الدخول لحفظ مدخلات المذكرات.',
        variant: 'destructive'
      });
      return;
    }*/
    
    if (!title.trim() || !content.trim()) {
      toast({
        title: language === 'en' ? 'Error' : 'خطأ',
        description: language === 'en' ? 'Please provide both title and content.' : 'يرجى تقديم كل من العنوان والمحتوى.',
        variant: 'destructive'
      });
      return;
    }
    
    try {
      // If editing an existing entry
      if (editingEntryId) {
        const { error } = await supabase
          .from('journal_entries')
          .update({
            title,
            content,
            tags,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingEntryId);
          
        if (error) throw error;
        
        toast({
          title: language === 'en' ? 'Entry Updated' : 'تم تحديث المدخل',
          description: language === 'en' ? 'Your journal entry has been updated.' : 'تم تحديث مدخل المذكرات الخاص بك.',
        });
      } else {
        // Adding a new entry
        const { data, error } = await supabase
          .from('journal_entries')
          .insert({
            //user_id: session.user.id,
            title,
            content,
            tags,
          })
          .select();
          
        if (error) throw error;
        
        toast({
          title: language === 'en' ? 'Entry Added' : 'تمت إضافة المدخل',
          description: language === 'en' ? 'Your journal entry has been saved.' : 'تم حفظ مدخل المذكرات الخاص بك.',
        });
      }
      
      // Refresh entries list
      await fetchEntries();
      resetForm();
    } catch (error) {
      console.error('Error saving journal entry:', error);
      toast({
        title: language === 'en' ? 'Error' : 'خطأ',
        description: language === 'en' ? 'Failed to save your journal entry.' : 'فشل في حفظ مدخل المذكرات الخاص بك.',
        variant: 'destructive'
      });
    }
  };
  
  const handleEditEntry = (entry: JournalEntry) => {
    setEditingEntryId(entry.id);
    setTitle(entry.title);
    setContent(entry.content);
    setTags(entry.tags || []);
    setIsAddingEntry(true);
  };
  
  const handleDeleteEntry = async (id: string) => {
    if (!confirm(language === 'en' ? 'Are you sure you want to delete this entry?' : 'هل أنت متأكد أنك تريد حذف هذا المدخل؟')) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('journal_entries')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      toast({
        title: language === 'en' ? 'Entry Deleted' : 'تم حذف المدخل',
        description: language === 'en' ? 'The journal entry has been deleted.' : 'تم حذف مدخل المذكرات.',
      });
      
      await fetchEntries();
    } catch (error) {
      console.error('Error deleting journal entry:', error);
      toast({
        title: language === 'en' ? 'Error' : 'خطأ',
        description: language === 'en' ? 'Failed to delete the journal entry.' : 'فشل في حذف مدخل المذكرات.',
        variant: 'destructive'
      });
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>
              {language === 'en' ? 'Your Journal' : 'مذكراتك'}
            </CardTitle>
            <CardDescription>
              {language === 'en' 
                ? 'Record your thoughts, feelings and experiences' 
                : 'سجل أفكارك ومشاعرك وتجاربك'}
            </CardDescription>
          </div>
          
          {!isAddingEntry && (
            <Button onClick={() => setIsAddingEntry(true)} size="sm">
              <Plus className="mr-2 h-4 w-4" />
              {language === 'en' ? 'New Entry' : 'مدخل جديد'}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isAddingEntry ? (
          <div className="space-y-4 mb-6 p-4 border rounded-lg">
            <div className="space-y-2">
              <Label htmlFor="entry-title">
                {language === 'en' ? 'Title' : 'العنوان'}
              </Label>
              <Input
                id="entry-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={language === 'en' ? 'Enter title' : 'أدخل العنوان'}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="entry-content">
                {language === 'en' ? 'Content' : 'المحتوى'}
              </Label>
              <Textarea
                id="entry-content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={language === 'en' ? 'Write your thoughts...' : 'اكتب أفكارك...'}
                className="min-h-[150px]"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="entry-tags">
                {language === 'en' ? 'Tags' : 'الوسوم'}
              </Label>
              <div className="flex items-center">
                <Input
                  id="entry-tags"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagInputKeyDown}
                  placeholder={language === 'en' ? 'Add tags (press Enter)' : 'أضف وسومًا (اضغط إدخال)'}
                  className="flex-1"
                />
                <Button 
                  type="button" 
                  variant="secondary" 
                  onClick={addTag}
                  className="ml-2"
                >
                  {language === 'en' ? 'Add' : 'إضافة'}
                </Button>
              </div>
              
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="pl-2 pr-1">
                      {tag}
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 ml-1"
                        onClick={() => removeTag(tag)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={resetForm}>
                {language === 'en' ? 'Cancel' : 'إلغاء'}
              </Button>
              <Button onClick={handleSaveEntry}>
                {editingEntryId
                  ? language === 'en' ? 'Update Entry' : 'تحديث المدخل'
                  : language === 'en' ? 'Save Entry' : 'حفظ المدخل'}
              </Button>
            </div>
          </div>
        ) : null}
        
        <div className="space-y-4">
          {isLoading ? (
            <p className="text-center text-muted-foreground py-4">
              {language === 'en' ? 'Loading journal entries...' : 'جاري تحميل مدخلات المذكرات...'}
            </p>
          ) : entries.length === 0 ? (
            <div className="bg-accent/10 rounded-lg p-6 text-center">
              <p>{language === 'en' ? 'No journal entries yet.' : 'لا توجد مدخلات مذكرات بعد.'}</p>
              <Button 
                variant="link" 
                onClick={() => setIsAddingEntry(true)}
                className="mt-2"
              >
                {language === 'en' ? 'Write your first entry' : 'اكتب مدخلك الأول'}
              </Button>
            </div>
          ) : (
            <ScrollArea className="h-[500px] pr-4">
              <div className="space-y-4">
                {entries.map(entry => (
                  <div key={entry.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium text-lg">{entry.title}</h3>
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditEntry(entry)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteEntry(entry.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-xs text-muted-foreground mt-1 mb-3">
                      <Calendar className="mr-1 h-3 w-3" />
                      {format(new Date(entry.created_at), 'PPP')}
                      
                      {entry.sentiment && (
                        <Badge variant="outline" className="ml-2">
                          {entry.sentiment}
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-muted-foreground whitespace-pre-wrap">
                      {entry.content.length > 300 
                        ? `${entry.content.substring(0, 300)}...` 
                        : entry.content}
                    </p>
                    
                    {entry.tags && entry.tags.length > 0 && (
                      <div className="flex items-center mt-3 flex-wrap gap-1">
                        <Tag className="h-3 w-3 mr-1 text-muted-foreground" />
                        {entry.tags.map((tag, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
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

export default Journal;
