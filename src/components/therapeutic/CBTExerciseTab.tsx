
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/components/Header';
import { CheckCircle } from 'lucide-react';

const CBTExerciseTab = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [reflection, setReflection] = useState('');
  const [exerciseCompleted, setExerciseCompleted] = useState(false);
  
  const handleSaveReflection = () => {
    if (!reflection.trim()) {
      toast({
        title: language === 'en' ? 'Empty Reflection' : 'تأمل فارغ',
        description: language === 'en' ? 'Please write your reflection before saving.' : 'الرجاء كتابة تأملك قبل الحفظ.',
        variant: 'destructive',
      });
      return;
    }

    // In a real app, this would save to the database
    toast({
      title: language === 'en' ? 'Reflection Saved' : 'تم حفظ التأمل',
      description: language === 'en' ? 'Your reflection has been saved successfully.' : 'تم حفظ تأملك بنجاح.',
    });
    setExerciseCompleted(true);
  };

  const handleCompleteExercise = () => {
    setExerciseCompleted(true);
    toast({
      title: language === 'en' ? 'Exercise Completed' : 'تم إكمال التمرين',
      description: language === 'en' ? 'Great job! Your progress has been saved.' : 'عمل رائع! تم حفظ تقدمك.',
    });
  };

  const resetExercise = () => {
    setReflection('');
    setExerciseCompleted(false);
  };
  
  if (exerciseCompleted) {
    return (
      <div className="bg-primary/10 p-6 rounded-lg">
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle className="h-6 w-6 text-primary" />
          <h3 className="text-lg font-medium">
            {language === 'en' ? 'Exercise Completed!' : 'تم إكمال التمرين!'}
          </h3>
        </div>
        <p className="mb-4 text-muted-foreground">
          {language === 'en' 
            ? 'Great job completing this CBT exercise. Regular practice helps develop healthier thought patterns.'
            : 'عمل رائع في إكمال تمرين CBT هذا. الممارسة المنتظمة تساعد على تطوير أنماط فكرية أكثر صحة.'}
        </p>
        <Button variant="outline" onClick={resetExercise}>
          {language === 'en' ? 'Do Another Exercise' : 'قم بتمرين آخر'}
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">
        {language === 'en' ? 'Thought Record Exercise' : 'تمرين تسجيل الأفكار'}
      </h3>
      
      <div className="space-y-4">
        <div>
          <p className="mb-2 text-sm font-medium">
            {language === 'en' ? '1. Situation: Describe a situation that triggered negative emotions' : '١. الموقف: صف موقفًا أثار مشاعر سلبية'}
          </p>
          <Textarea 
            className="w-full h-20"
            placeholder={language === 'en' ? 'Describe the situation...' : 'صف الموقف...'}
          />
        </div>
        
        <div>
          <p className="mb-2 text-sm font-medium">
            {language === 'en' ? '2. Automatic Thoughts: What thoughts came to mind?' : '٢. الأفكار التلقائية: ما هي الأفكار التي جاءت إلى ذهنك؟'}
          </p>
          <Textarea 
            className="w-full h-20"
            placeholder={language === 'en' ? 'Write your automatic thoughts...' : 'اكتب أفكارك التلقائية...'}
          />
        </div>
        
        <div>
          <p className="mb-2 text-sm font-medium">
            {language === 'en' ? '3. Alternative Thoughts: What are more balanced thoughts?' : '٣. الأفكار البديلة: ما هي الأفكار الأكثر توازناً؟'}
          </p>
          <Textarea 
            className="w-full h-20"
            placeholder={language === 'en' ? 'Write more balanced thoughts...' : 'اكتب أفكارًا أكثر توازناً...'}
          />
        </div>
        
        <div>
          <p className="mb-2 text-sm font-medium">
            {language === 'en' ? '4. Your Reflection' : '٤. تأملك'}
          </p>
          <Textarea 
            className="w-full h-32"
            placeholder={language === 'en' ? 'How do you feel after this exercise? What did you learn?' : 'كيف تشعر بعد هذا التمرين؟ ماذا تعلمت؟'}
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
          />
        </div>
      </div>
      
      <div className="flex gap-2">
        <Button onClick={handleSaveReflection}>
          {language === 'en' ? 'Save Reflection' : 'حفظ التأمل'}
        </Button>
        <Button variant="outline" onClick={handleCompleteExercise}>
          {language === 'en' ? 'Complete Exercise' : 'إكمال التمرين'}
        </Button>
      </div>
    </div>
  );
};

export default CBTExerciseTab;
