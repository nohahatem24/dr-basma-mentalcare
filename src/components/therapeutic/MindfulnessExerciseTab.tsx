
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/components/Header';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface MindfulnessExerciseTabProps {
  onComplete: (exerciseId: string, notes: string) => void;
}

const MindfulnessExerciseTab: React.FC<MindfulnessExerciseTabProps> = ({ onComplete }) => {
  const { language } = useLanguage();
  const [activeExercise, setActiveExercise] = useState<string | null>(null);
  const [notes, setNotes] = useState<string>('');

  const exercises = [
    {
      id: 'breathing',
      title: language === 'en' ? 'Deep Breathing Exercise' : 'تمرين التنفس العميق',
      description: language === 'en'
        ? 'A simple but powerful technique to reduce stress and anxiety'
        : 'تقنية بسيطة ولكنها قوية لتقليل التوتر والقلق',
      steps: language === 'en'
        ? [
            'Find a comfortable position',
            'Breathe in slowly through your nose for 4 counts',
            'Hold your breath for 4 counts',
            'Exhale slowly through your mouth for 4 counts',
            'Repeat 5-10 times'
          ]
        : [
            'اجد وضعية مريحة',
            'تنفس ببطء من خلال أنفك لمدة 4 عدات',
            'احبس نفسك لمدة 4 عدات',
            'ازفر ببطء من خلال فمك لمدة 4 عدات',
            'كرر 5-10 مرات'
          ]
    },
    {
      id: 'body-scan',
      title: language === 'en' ? 'Body Scan Meditation' : 'تأمل مسح الجسم',
      description: language === 'en'
        ? 'Increase awareness of physical sensations in your body'
        : 'زيادة الوعي بالأحاسيس الجسدية في جسمك',
      steps: language === 'en'
        ? [
            'Lie down or sit comfortably',
            'Close your eyes and focus on your breath',
            'Gradually scan your body from head to toe',
            'Notice any sensations without judgment',
            'Release tension as you move through each area'
          ]
        : [
            'استلق أو اجلس بشكل مريح',
            'أغلق عينيك وركز على تنفسك',
            'امسح جسمك تدريجياً من الرأس إلى أخمص القدمين',
            'لاحظ أي أحاسيس دون إصدار أحكام',
            'حرر التوتر أثناء انتقالك عبر كل منطقة'
          ]
    },
    {
      id: 'grounding',
      title: language === 'en' ? '5-4-3-2-1 Grounding' : 'تمرين التأريض 5-4-3-2-1',
      description: language === 'en'
        ? 'Connect with your surroundings using your senses'
        : 'تواصل مع محيطك باستخدام حواسك',
      steps: language === 'en'
        ? [
            'Name 5 things you can see',
            'Name 4 things you can touch',
            'Name 3 things you can hear',
            'Name 2 things you can smell',
            'Name 1 thing you can taste'
          ]
        : [
            'اذكر 5 أشياء يمكنك رؤيتها',
            'اذكر 4 أشياء يمكنك لمسها',
            'اذكر 3 أشياء يمكنك سماعها',
            'اذكر شيئين يمكنك شمهما',
            'اذكر شيئاً واحداً يمكنك تذوقه'
          ]
    }
  ];

  const handleCompleteExercise = (exerciseId: string) => {
    const exercise = exercises.find(ex => ex.id === exerciseId);
    const noteText = notes ? notes : 
      exercise ? `Completed ${exercise.title} mindfulness exercise` : 'Completed mindfulness exercise';
    onComplete(exerciseId, noteText);
    setNotes('');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>
            {language === 'en' 
              ? 'Mindfulness Exercises'
              : 'تمارين اليقظة الذهنية'}
          </CardTitle>
          <CardDescription>
            {language === 'en'
              ? 'Practice being present in the moment'
              : 'مارس التواجد في اللحظة الحالية'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion 
            type="single" 
            collapsible 
            className="w-full"
            value={activeExercise || undefined}
            onValueChange={setActiveExercise}
          >
            {exercises.map((exercise) => (
              <AccordionItem key={exercise.id} value={exercise.id}>
                <AccordionTrigger>{exercise.title}</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <p className="text-muted-foreground">{exercise.description}</p>
                    <ol className="list-decimal list-inside space-y-2">
                      {exercise.steps.map((step, index) => (
                        <li key={index} className="text-sm">{step}</li>
                      ))}
                    </ol>
                    
                    <div className="space-y-3 mt-4">
                      <Label htmlFor={`notes-${exercise.id}`}>
                        {language === 'en' ? 'Your Notes (optional)' : 'ملاحظاتك (اختياري)'}
                      </Label>
                      <Textarea 
                        id={`notes-${exercise.id}`}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder={language === 'en' ? 'Add any reflections or notes here...' : 'أضف أي تأملات أو ملاحظات هنا...'}
                        className="min-h-[100px]"
                      />
                    </div>
                    
                    <Button 
                      onClick={() => handleCompleteExercise(exercise.id)}
                      className="w-full mt-4"
                    >
                      {language === 'en' ? 'Complete Exercise' : 'إكمال التمرين'}
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
};

export default MindfulnessExerciseTab;
