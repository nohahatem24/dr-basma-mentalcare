import React, { useState } from 'react';
import { useLanguage } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Brain, CheckCircle, ArrowRight, Save, Pencil, Plus, Heart, Leaf } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface DBTExerciseTabProps {
  onComplete: (exerciseId: string, notes: string) => void;
}

const dbtSkills = [
  {
    id: 'mindfulness',
    icon: Brain,
    title: { en: 'Mindfulness', ar: 'اليقظة الذهنية' },
    description: {
      en: 'Stay present and aware in the moment',
      ar: 'البقاء في الحاضر والوعي باللحظة'
    },
    exercises: [
      {
        title: { en: 'PLEASE Skills', ar: 'مهارات PLEASE' },
        description: {
          en: 'Take care of your body to reduce vulnerability to emotional distress',
          ar: 'اعتني بجسمك لتقليل التعرض للضغط العاطفي'
        },
        steps: [
          { en: 'Treat PhysicaL illness', ar: 'علاج المرض الجسدي' },
          { en: 'Balanced Eating', ar: 'تناول الطعام المتوازن' },
          { en: 'Avoid mood-Altering drugs', ar: 'تجنب العقاقير المؤثرة على المزاج' },
          { en: 'Balanced Sleep', ar: 'النوم المتوازن' },
          { en: 'Get Exercise', ar: 'ممارسة الرياضة' }
        ]
      },
      {
        title: { en: 'STOP Skill', ar: 'مهارة STOP' },
        description: {
          en: 'Stop yourself from acting on impulses in the heat of the moment',
          ar: 'توقف عن التصرف بدافع الاندفاع في لحظة الغضب'
        },
        steps: [
          { en: 'Stop', ar: 'توقف' },
          { en: 'Take a step back', ar: 'خذ خطوة للخلف' },
          { en: 'Observe', ar: 'لاحظ' },
          { en: 'Proceed mindfully', ar: 'تابع بوعي' }
        ]
      }
    ]
  },
  {
    id: 'distress-tolerance',
    icon: Heart,
    title: { en: 'Distress Tolerance', ar: 'تحمل الضغط' },
    description: {
      en: 'Survive crisis situations without making them worse',
      ar: 'تجاوز المواقف الصعبة دون جعلها أسوأ'
    },
    exercises: [
      {
        title: { en: 'TIPP Skills', ar: 'مهارات TIPP' },
        description: {
          en: 'Change your body chemistry to reduce emotional arousal quickly',
          ar: 'تغيير كيمياء جسمك لتقليل الإثارة العاطفية بسرعة'
        },
        steps: [
          { en: 'Temperature (cold water)', ar: 'درجة الحرارة (ماء بارد)' },
          { en: 'Intense exercise', ar: 'تمارين مكثفة' },
          { en: 'Paced breathing', ar: 'تنفس منتظم' },
          { en: 'Progressive muscle relaxation', ar: 'استرخاء العضلات التدريجي' }
        ]
      },
      {
        title: { en: 'IMPROVE Skills', ar: 'مهارات IMPROVE' },
        description: {
          en: 'Improve the moment during distress',
          ar: 'تحسين اللحظة أثناء الضيق'
        },
        steps: [
          { en: 'Imagery', ar: 'التخيل' },
          { en: 'Meaning', ar: 'المعنى' },
          { en: 'Prayer', ar: 'الدعاء' },
          { en: 'Relaxation', ar: 'الاسترخاء' },
          { en: 'One thing in the moment', ar: 'شيء واحد في اللحظة' },
          { en: 'Vacation', ar: 'إجازة قصيرة' },
          { en: 'Encouragement', ar: 'التشجيع' }
        ]
      }
    ]
  },
  {
    id: 'emotion-regulation',
    icon: Leaf,
    title: { en: 'Emotion Regulation', ar: 'تنظيم المشاعر' },
    description: {
      en: 'Understand and manage your emotions effectively',
      ar: 'فهم وإدارة مشاعرك بفعالية'
    },
    exercises: [
      {
        title: { en: 'ABC PLEASE', ar: 'ABC PLEASE' },
        description: {
          en: 'Reduce vulnerability to negative emotions',
          ar: 'تقليل التعرض للمشاعر السلبية'
        },
        steps: [
          { en: 'Accumulate positive experiences', ar: 'تراكم الخبرات الإيجابية' },
          { en: 'Build mastery', ar: 'بناء الإتقان' },
          { en: 'Cope ahead', ar: 'التعامل المسبق' }
        ]
      },
      {
        title: { en: 'Checking the Facts', ar: 'التحقق من الحقائق' },
        description: {
          en: 'Examine if your emotional response fits the facts',
          ar: 'فحص ما إذا كانت استجابتك العاطفية تتناسب مع الحقائق'
        },
        steps: [
          { en: 'What is the emotion?', ar: 'ما هو الشعور؟' },
          { en: 'What triggered the emotion?', ar: 'ما الذي أثار الشعور؟' },
          { en: 'What are the interpretations?', ar: 'ما هي التفسيرات؟' },
          { en: 'What are the facts?', ar: 'ما هي الحقائق؟' }
        ]
      }
    ]
  }
];

const DBTExerciseTab: React.FC<DBTExerciseTabProps> = ({ onComplete }) => {
  const { language } = useLanguage();
  const [activeSkill, setActiveSkill] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);
  const [notes, setNotes] = useState<{ [key: string]: string }>({});

  const markExerciseComplete = (exerciseId: string) => {
    if (!completedExercises.includes(exerciseId)) {
      const newCompleted = [...completedExercises, exerciseId];
      setCompletedExercises(newCompleted);
      updateProgress(newCompleted);
    }
  };

  const updateProgress = (completed: string[]) => {
    const totalExercises = dbtSkills.reduce(
      (total, skill) => total + skill.exercises.length,
      0
    );
    const newProgress = Math.round((completed.length / totalExercises) * 100);
    setProgress(newProgress);

    if (newProgress === 100 && onComplete) {
      onComplete(completed[completed.length - 1], notes[completed[completed.length - 1]] || '');
    }
  };

  const saveNote = (exerciseId: string, note: string) => {
    setNotes(prev => ({
      ...prev,
      [exerciseId]: note
    }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>
                {language === 'en' ? 'DBT Skills Training' : 'تدريب مهارات DBT'}
              </CardTitle>
              <CardDescription>
                {language === 'en'
                  ? 'Practice dialectical behavior therapy skills'
                  : 'تمرن على مهارات العلاج السلوكي الجدلي'}
              </CardDescription>
            </div>
            <Brain className="h-8 w-8 text-primary opacity-50" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 mb-6">
            <div className="flex justify-between text-sm">
              <span>
                {language === 'en' ? 'Progress' : 'التقدم'}
              </span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <Accordion
            type="single"
            collapsible
            value={activeSkill}
            onValueChange={setActiveSkill}
          >
            {dbtSkills.map(skill => (
              <AccordionItem key={skill.id} value={skill.id}>
                <AccordionTrigger>
                  <div className="flex items-center gap-2">
                    <skill.icon className="h-5 w-5" />
                    <span>
                      {language === 'en' ? skill.title.en : skill.title.ar}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="pt-4 space-y-6">
                    <p className="text-muted-foreground">
                      {language === 'en'
                        ? skill.description.en
                        : skill.description.ar}
                    </p>

                    <div className="space-y-4">
                      {skill.exercises.map((exercise, index) => (
                        <Card key={index}>
                          <CardContent className="pt-6">
                            <div className="space-y-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-semibold">
                                    {language === 'en'
                                      ? exercise.title.en
                                      : exercise.title.ar}
                                  </h4>
                                  <p className="text-sm text-muted-foreground">
                                    {language === 'en'
                                      ? exercise.description.en
                                      : exercise.description.ar}
                                  </p>
                                </div>
                                {completedExercises.includes(
                                  `${skill.id}-${index}`
                                ) && (
                                  <CheckCircle className="h-5 w-5 text-primary" />
                                )}
                              </div>

                              <div className="space-y-2">
                                {exercise.steps.map((step, stepIndex) => (
                                  <div
                                    key={stepIndex}
                                    className="flex items-start gap-2"
                                  >
                                    <ArrowRight className="h-4 w-4 mt-1" />
                                    <span>
                                      {language === 'en' ? step.en : step.ar}
                                    </span>
                                  </div>
                                ))}
                              </div>

                              <div className="space-y-2">
                                <Label>
                                  {language === 'en'
                                    ? 'Practice Notes'
                                    : 'ملاحظات التمرين'}
                                </Label>
                                <Textarea
                                  value={notes[`${skill.id}-${index}`] || ''}
                                  onChange={(e) =>
                                    saveNote(`${skill.id}-${index}`, e.target.value)
                                  }
                                  placeholder={
                                    language === 'en'
                                      ? 'Write your experience with this skill...'
                                      : 'اكتب تجربتك مع هذه المهارة...'
                                  }
                                />
                              </div>

                              <Button
                                onClick={() =>
                                  markExerciseComplete(`${skill.id}-${index}`)
                                }
                                disabled={completedExercises.includes(
                                  `${skill.id}-${index}`
                                )}
                              >
                                {completedExercises.includes(
                                  `${skill.id}-${index}`
                                )
                                  ? language === 'en'
                                    ? 'Completed'
                                    : 'تم الإكمال'
                                  : language === 'en'
                                  ? 'Mark as Complete'
                                  : 'تحديد كمكتمل'}
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
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

export default DBTExerciseTab;
