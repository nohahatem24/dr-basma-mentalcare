
import React, { useState } from 'react';
import { useLanguage } from '@/components/Header';
import { useAuth } from '@/components/auth/AuthProvider';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '@/lib/supabase';

interface GoalsFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const GoalsForm: React.FC<GoalsFormProps> = ({ onSuccess, onCancel }) => {
  const { language } = useLanguage();
  const { session } = useAuth();
  const { toast } = useToast();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetDate, setTargetDate] = useState<Date | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session.user) {
      toast({
        title: language === 'en' ? 'Error' : 'خطأ',
        description: language === 'en' ? 'You must be logged in' : 'يجب أن تكون مسجل الدخول',
        variant: 'destructive',
      });
      return;
    }
    
    if (!title.trim()) {
      toast({
        title: language === 'en' ? 'Error' : 'خطأ',
        description: language === 'en' ? 'Title is required' : 'العنوان مطلوب',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const { error } = await supabase.from('goals').insert({
        user_id: session.user.id,
        title,
        description: description.trim() || null,
        target_date: targetDate ? targetDate.toISOString() : null,
        status: 'active',
        progress: 0
      });
      
      if (error) throw error;
      
      toast({
        title: language === 'en' ? 'Goal Added' : 'تمت إضافة الهدف',
        description: language === 'en' ? 'Your goal was added successfully' : 'تمت إضافة هدفك بنجاح',
      });
      
      onSuccess();
    } catch (error) {
      console.error('Error adding goal:', error);
      toast({
        title: language === 'en' ? 'Error' : 'خطأ',
        description: language === 'en' ? 'Failed to add goal' : 'فشل في إضافة الهدف',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">
          {language === 'en' ? 'Goal Title' : 'عنوان الهدف'} *
        </Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={language === 'en' ? 'Enter goal title' : 'أدخل عنوان الهدف'}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">
          {language === 'en' ? 'Description' : 'الوصف'}
        </Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={language === 'en' ? 'Describe your goal' : 'صف هدفك'}
          rows={3}
        />
      </div>
      
      <div className="space-y-2">
        <Label>
          {language === 'en' ? 'Target Date' : 'تاريخ الاستهداف'}
        </Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-left font-normal"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {targetDate ? format(targetDate, 'PPP') : language === 'en' ? 'Select date' : 'اختر تاريخ'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={targetDate}
              onSelect={setTargetDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      
      <div className="flex space-x-2 pt-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          className="flex-1"
        >
          {language === 'en' ? 'Cancel' : 'إلغاء'}
        </Button>
        <Button 
          type="submit" 
          className="flex-1"
          disabled={isSubmitting || !title.trim()}
        >
          {isSubmitting 
            ? (language === 'en' ? 'Saving...' : 'جاري الحفظ...') 
            : (language === 'en' ? 'Save Goal' : 'حفظ الهدف')}
        </Button>
      </div>
    </form>
  );
};

export default GoalsForm;
