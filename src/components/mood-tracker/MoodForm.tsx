
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Plus } from 'lucide-react';
import { useLanguage } from '@/components/Header';

interface MoodFormProps {
  initialMood?: number;
  initialNotes?: string;
  initialTriggers?: string[];
  isEditing?: boolean;
  onSave: (data: { mood: number; notes: string; triggers: string[] }) => void;
  onCancel: () => void;
}

export const MoodForm: React.FC<MoodFormProps> = ({
  initialMood = 0,
  initialNotes = '',
  initialTriggers = [],
  isEditing = false,
  onSave,
  onCancel,
}) => {
  const { language } = useLanguage();
  const [mood, setMood] = useState(initialMood);
  const [notes, setNotes] = useState(initialNotes);
  const [trigger, setTrigger] = useState('');
  const [triggers, setTriggers] = useState<string[]>(initialTriggers);

  useEffect(() => {
    setMood(initialMood);
    setNotes(initialNotes);
    setTriggers(initialTriggers);
  }, [initialMood, initialNotes, initialTriggers]);

  const handleAddTrigger = () => {
    if (!trigger.trim()) return;
    setTriggers([...triggers, trigger]);
    setTrigger('');
  };

  const handleRemoveTrigger = (index: number) => {
    const newTriggers = [...triggers];
    newTriggers.splice(index, 1);
    setTriggers(newTriggers);
  };

  const handleSubmit = () => {
    onSave({ mood, notes, triggers });
  };

  const getMoodLabel = (moodValue: number) => {
    if (moodValue >= 8) return language === 'en' ? 'Excellent' : 'ممتاز';
    if (moodValue >= 5) return language === 'en' ? 'Very Good' : 'جيد جدا';
    if (moodValue >= 2) return language === 'en' ? 'Good' : 'جيد';
    if (moodValue >= 0) return language === 'en' ? 'Neutral' : 'محايد';
    if (moodValue >= -2) return language === 'en' ? 'Low' : 'منخفض';
    if (moodValue >= -5) return language === 'en' ? 'Poor' : 'سيء';
    if (moodValue >= -8) return language === 'en' ? 'Very Poor' : 'سيء جدا';
    return language === 'en' ? 'Terrible' : 'سيء للغاية';
  };

  const getMoodColor = (moodValue: number) => {
    if (moodValue >= 5) return 'bg-green-100 text-green-800';
    if (moodValue >= 0) return 'bg-blue-100 text-blue-800';
    if (moodValue >= -5) return 'bg-amber-100 text-amber-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="space-y-4 bg-accent/10 p-4 rounded-lg">
      <h3 className="font-medium">
        {isEditing
          ? language === 'en' ? 'Edit Mood Entry' : 'تعديل إدخال المزاج'
          : language === 'en' ? 'How are you feeling?' : 'كيف تشعر؟'}
      </h3>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label>
            {language === 'en' ? 'Your Mood (-10 to 10)' : 'مزاجك (-١٠ إلى ١٠)'}
          </Label>
          <span className={`text-sm px-2 py-1 rounded-full ${getMoodColor(mood)}`}>
            {mood} - {getMoodLabel(mood)}
          </span>
        </div>

        <div className="py-4">
          <div className="flex justify-between text-xs mb-2">
            <span>-10</span>
            <span>0</span>
            <span>10</span>
          </div>
          <Slider
            value={[mood]}
            min={-10}
            max={10}
            step={1}
            onValueChange={([value]) => setMood(value)}
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>{language === 'en' ? 'Very Negative' : 'سلبي جدًا'}</span>
            <span>{language === 'en' ? 'Neutral' : 'محايد'}</span>
            <span>{language === 'en' ? 'Very Positive' : 'إيجابي جدًا'}</span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label>
          {language === 'en' ? 'Notes' : 'ملاحظات'}
        </Label>
        <Input
          placeholder={language === 'en' ? 'Add details about your mood...' : 'أضف تفاصيل حول مزاجك...'}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label>
          {language === 'en' ? 'Triggers' : 'المحفزات'}
        </Label>
        <div className="flex gap-2">
          <Input
            placeholder={language === 'en' ? 'Add a trigger...' : 'أضف محفزًا...'}
            value={trigger}
            onChange={(e) => setTrigger(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddTrigger()}
          />
          <Button type="button" variant="outline" onClick={handleAddTrigger}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {triggers.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {triggers.map((item, index) => (
              <div
                key={index}
                className="bg-accent/50 px-2 py-1 rounded-full text-sm flex items-center gap-1"
              >
                {item}
                <button
                  type="button"
                  onClick={() => handleRemoveTrigger(index)}
                  className="h-4 w-4 rounded-full bg-muted/20 flex items-center justify-center hover:bg-muted/40"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <Button onClick={handleSubmit}>
          {isEditing
            ? language === 'en' ? 'Save Changes' : 'حفظ التغييرات'
            : language === 'en' ? 'Save Mood' : 'حفظ المزاج'}
        </Button>
        <Button variant="outline" onClick={onCancel}>
          {language === 'en' ? 'Cancel' : 'إلغاء'}
        </Button>
      </div>
    </div>
  );
};
