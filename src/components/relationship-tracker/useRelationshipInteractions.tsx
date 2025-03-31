
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/components/Header';

export type InteractionType = 'positive' | 'negative' | 'neutral';

export interface Interaction {
  id: string;
  type: InteractionType;
  date: Date;
  description: string;
  reflection: string;
}

export interface InteractionFormData {
  type: InteractionType;
  description: string;
  reflection: string;
}

export function useRelationshipInteractions() {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [interactions, setInteractions] = useState<Interaction[]>([
    {
      id: '1',
      type: 'positive',
      date: new Date(),
      description: language === 'en' ? 'Had a great conversation about our future' : 'أجرينا محادثة رائعة حول مستقبلنا',
      reflection: language === 'en' ? 'I felt heard and understood' : 'شعرت بالاستماع والفهم'
    },
    {
      id: '2',
      type: 'negative',
      date: new Date(Date.now() - 86400000),
      description: language === 'en' ? 'Disagreement about financial priorities' : 'خلاف حول الأولويات المالية',
      reflection: language === 'en' ? 'Need to work on communication' : 'أحتاج إلى العمل على التواصل'
    }
  ]);
  
  const [isAdding, setIsAdding] = useState(false);
  
  const handleAddInteraction = (data: InteractionFormData) => {
    if (!data.description.trim()) {
      toast({
        title: language === 'en' ? 'Description Required' : 'الوصف مطلوب',
        description: language === 'en' ? 'Please add a description of the interaction.' : 'يرجى إضافة وصف للتفاعل.',
        variant: 'destructive',
      });
      return;
    }
    
    const newInteraction: Interaction = {
      id: Date.now().toString(),
      type: data.type,
      date: new Date(),
      description: data.description,
      reflection: data.reflection
    };
    
    setInteractions([newInteraction, ...interactions]);
    setIsAdding(false);
    
    toast({
      title: language === 'en' ? 'Interaction Added' : 'تمت إضافة التفاعل',
      description: language === 'en' ? 'Your relationship interaction has been recorded.' : 'تم تسجيل تفاعل علاقتك.',
    });
  };

  return {
    interactions,
    isAdding,
    setIsAdding,
    handleAddInteraction
  };
}
