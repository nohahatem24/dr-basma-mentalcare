import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/components/Header';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2 } from 'lucide-react';

interface ACTExerciseTabProps {
  onComplete: () => void;
}

interface ExerciseResponse {
  completed: boolean;
  steps: boolean[];
  notes: string;
}

const ACTExerciseTab: React.FC<ACTExerciseTabProps> = ({ onComplete }) => {
  const { language } = useLanguage();
  
  // State for tracking progress and responses
  const [activeExercise, setActiveExercise] = useState<string | null>(null);
  const [responses, setResponses] = useState<Record<string, ExerciseResponse>>({
    values: { completed: false, steps: [false, false, false, false], notes: '' },
    acceptance: { completed: false, steps: [false, false, false, false], notes: '' },
    mindfulness: { completed: false, steps: [false, false, false, false, false, false], notes: '' },
    defusion: { completed: false, steps: [false, false, false, false], notes: '' }
  });

  // Calculate overall progress percentage
  const calculateProgress = () => {
    const exerciseCount = Object.keys(responses).length;
    const completedCount = Object.values(responses).filter(r => r.completed).length;
    return Math.round((completedCount / exerciseCount) * 100);
  };

  // Toggle step completion
  const toggleStep = (exerciseId: string, stepIndex: number) => {
    setResponses(prev => ({
      ...prev,
      [exerciseId]: {
        ...prev[exerciseId],
        steps: prev[exerciseId].steps.map((step, idx) => 
          idx === stepIndex ? !step : step
        )
      }
    }));
  };

  // Update notes
  const updateNotes = (exerciseId: string, notes: string) => {
    setResponses(prev => ({
      ...prev,
      [exerciseId]: {
        ...prev[exerciseId],
        notes
      }
    }));
  };

  // Mark exercise as complete
  const completeExercise = (exerciseId: string) => {
    setResponses(prev => ({
      ...prev,
      [exerciseId]: {
        ...prev[exerciseId],
        completed: true
      }
    }));

    // Call the parent completion handler
    onComplete();

    // Check if all exercises are complete
    const allCompleted = Object.values(responses).every(r => r.completed);
    if (allCompleted) {
      // If all exercises are complete, we could do something special
      console.log('All ACT exercises completed!');
    }
  };

  const exercises = [
    {
      id: 'values',
      title: language === 'en' ? 'Values Clarification' : 'توضيح القيم',
      description: language === 'en' 
        ? 'Identify and connect with your personal values'
        : 'تحديد والتواصل مع قيمك الشخصية',
      steps: language === 'en' 
        ? [
            'Take a moment to reflect on what matters most to you',
            'List your top 5 personal values',
            'For each value, write why it\'s important to you',
            'Think of specific actions that align with these values'
          ]
        : [
            'خذ لحظة للتفكير في ما يهمك أكثر',
            'اكتب أهم 5 قيم شخصية لديك',
            'لكل قيمة، اكتب لماذا هي مهمة بالنسبة لك',
            'فكر في أفعال محددة تتماشى مع هذه القيم'
          ]
    },
    {
      id: 'acceptance',
      title: language === 'en' ? 'Acceptance Practice' : 'ممارسة التقبل',
      description: language === 'en'
        ? 'Learn to accept thoughts and feelings without judgment'
        : 'تعلم تقبل الأفكار والمشاعر دون إصدار أحكام',
      steps: language === 'en'
        ? [
            'Notice any difficult thoughts or feelings',
            'Observe them without trying to change them',
            'Practice saying "I notice I\'m having the thought that..."',
            'Allow the experience to be there, making room for it'
          ]
        : [
            'لاحظ أي أفكار أو مشاعر صعبة',
            'راقبها دون محاولة تغييرها',
            'مارس قول "ألاحظ أن لدي فكرة أن..."',
            'اسمح للتجربة بالوجود، وافسح لها المجال'
          ]
    },
    {
      id: 'mindfulness',
      title: language === 'en' ? 'Present Moment Awareness' : 'الوعي باللحظة الحاضرة',
      description: language === 'en'
        ? 'Connect with the here and now through mindful observation'
        : 'تواصل مع الحاضر من خلال الملاحظة الواعية',
      steps: language === 'en'
        ? [
            'Focus on your breath for a few moments',
            'Notice 5 things you can see',
            'Identify 4 things you can touch',
            'Listen for 3 different sounds',
            'Notice 2 things you can smell',
            'Be aware of 1 thing you can taste'
          ]
        : [
            'ركز على تنفسك لبضع لحظات',
            'لاحظ 5 أشياء يمكنك رؤيتها',
            'حدد 4 أشياء يمكنك لمسها',
            'استمع إلى 3 أصوات مختلفة',
            'لاحظ شيئين يمكنك شمهما',
            'كن على دراية بشيء واحد يمكنك تذوقه'
          ]
    },
    {
      id: 'defusion',
      title: language === 'en' ? 'Cognitive Defusion' : 'الفصل المعرفي',
      description: language === 'en'
        ? 'Learn to create distance between yourself and your thoughts'
        : 'تعلم خلق مسافة بينك وبين أفكارك',
      steps: language === 'en'
        ? [
            'Identify a troubling thought',
            'Add the phrase "I am having the thought that..." before the thought',
            'Try saying the thought in a silly voice or very slowly',
            'Imagine the thought as text floating by on a screen or passing clouds'
          ]
        : [
            'حدد فكرة مزعجة',
            'أضف "أنا أفكر في أن..." قبل الفكرة',
            'حاول قول الفكرة بصوت مضحك أو ببطء شديد',
            'تخيل الفكرة كنص يطفو على شاشة أو كسحب تمر'
          ]
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>
            {language === 'en' 
              ? 'Acceptance and Commitment Therapy (ACT) Exercises'
              : 'تمارين العلاج بالقبول والالتزام (ACT)'}
          </CardTitle>
          <CardDescription>
            {language === 'en'
              ? 'Practice mindfulness, acceptance, and values-based action'
              : 'مارس اليقظة الذهنية والتقبل والعمل القائم على القيم'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Progress indicator */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">
                {language === 'en' ? 'Your Progress' : 'تقدمك'}
              </span>
              <span className="text-sm font-medium">{calculateProgress()}%</span>
            </div>
            <Progress value={calculateProgress()} className="h-2" />
          </div>

          <Accordion 
            type="single" 
            collapsible 
            className="w-full"
            value={activeExercise || undefined}
            onValueChange={setActiveExercise}
          >
            {exercises.map((exercise) => (
              <AccordionItem key={exercise.id} value={exercise.id}>
                <AccordionTrigger className="flex">
                  <div className="flex items-center">
                    {responses[exercise.id]?.completed && (
                      <CheckCircle2 className="h-5 w-5 mr-2 text-green-500" />
                    )}
                    {exercise.title}
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <p className="text-muted-foreground">{exercise.description}</p>
                    
                    <div className="space-y-3 border rounded-md p-4 bg-muted/10">
                      {exercise.steps.map((step, index) => (
                        <div key={index} className="flex items-center space-x-2 rtl:space-x-reverse">
                          <Checkbox 
                            id={`${exercise.id}-step-${index}`} 
                            checked={responses[exercise.id]?.steps[index] || false}
                            onCheckedChange={() => toggleStep(exercise.id, index)}
                          />
                          <Label 
                            htmlFor={`${exercise.id}-step-${index}`}
                            className="text-sm"
                          >
                            {step}
                          </Label>
                        </div>
                      ))}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`${exercise.id}-notes`}>
                        {language === 'en' ? 'Your Notes:' : 'ملاحظاتك:'}
                      </Label>
                      <Textarea 
                        id={`${exercise.id}-notes`}
                        placeholder={language === 'en' 
                          ? 'Write down your observations and reflections...' 
                          : 'اكتب ملاحظاتك وتأملاتك...'}
                        value={responses[exercise.id]?.notes || ''}
                        onChange={(e) => updateNotes(exercise.id, e.target.value)}
                        rows={4}
                      />
                    </div>
                    
                    <Button 
                      onClick={() => completeExercise(exercise.id)}
                      className="w-full mt-4"
                      disabled={responses[exercise.id]?.completed}
                    >
                      {responses[exercise.id]?.completed
                        ? (language === 'en' ? 'Exercise Completed' : 'تم إكمال التمرين')
                        : (language === 'en' ? 'Complete Exercise' : 'إكمال التمرين')}
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

export default ACTExerciseTab; 