
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/components/Header';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { InteractionType, InteractionFormData } from './useRelationshipInteractions';

interface InteractionFormProps {
  onSubmit: (data: InteractionFormData) => void;
  onCancel: () => void;
}

export function InteractionForm({ onSubmit, onCancel }: InteractionFormProps) {
  const { language } = useLanguage();
  const [interactionType, setInteractionType] = useState<InteractionType>('positive');
  const [description, setDescription] = useState('');
  const [reflection, setReflection] = useState('');

  const handleSubmit = () => {
    onSubmit({
      type: interactionType,
      description,
      reflection
    });
  };

  return (
    <div className="space-y-4 bg-accent/10 p-4 rounded-lg">
      <h3 className="font-medium">
        {language === 'en' ? 'Add New Interaction' : 'إضافة تفاعل جديد'}
      </h3>
      
      <div className="space-y-2">
        <Label>
          {language === 'en' ? 'Interaction Type' : 'نوع التفاعل'}
        </Label>
        <div className="flex space-x-2">
          <Button 
            variant={interactionType === 'positive' ? 'default' : 'outline'}
            onClick={() => setInteractionType('positive')}
            className="flex items-center gap-1"
          >
            <ArrowUp className="h-4 w-4" />
            {language === 'en' ? 'Positive' : 'إيجابي'}
          </Button>
          <Button 
            variant={interactionType === 'neutral' ? 'default' : 'outline'}
            onClick={() => setInteractionType('neutral')}
          >
            {language === 'en' ? 'Neutral' : 'محايد'}
          </Button>
          <Button 
            variant={interactionType === 'negative' ? 'default' : 'outline'}
            onClick={() => setInteractionType('negative')}
            className="flex items-center gap-1"
          >
            <ArrowDown className="h-4 w-4" />
            {language === 'en' ? 'Negative' : 'سلبي'}
          </Button>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label>
          {language === 'en' ? 'Description' : 'الوصف'}
        </Label>
        <Textarea 
          placeholder={language === 'en' ? 'Describe the interaction...' : 'صف التفاعل...'}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="h-20"
        />
      </div>
      
      <div className="space-y-2">
        <Label>
          {language === 'en' ? 'Your Reflection' : 'تأملك'}
        </Label>
        <Textarea 
          placeholder={language === 'en' ? 'How did you feel about it? What did you learn?' : 'كيف شعرت حيال ذلك؟ ماذا تعلمت؟'}
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
          className="h-20"
        />
      </div>
      
      <div className="flex gap-2">
        <Button onClick={handleSubmit}>
          {language === 'en' ? 'Save Interaction' : 'حفظ التفاعل'}
        </Button>
        <Button variant="outline" onClick={onCancel}>
          {language === 'en' ? 'Cancel' : 'إلغاء'}
        </Button>
      </div>
    </div>
  );
}
