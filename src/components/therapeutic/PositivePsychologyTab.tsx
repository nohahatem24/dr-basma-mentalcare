import React, { useState } from 'react';
import { useLanguage } from '@/components/Header';
import { Card, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Heart, Star, Smile, Sun, CheckCircle2 } from 'lucide-react';

interface PositivePsychologyTabProps {
  onComplete: (exerciseId: string, notes: string) => void;
}

interface ExerciseResponse {
  completed: boolean;
  steps: boolean[];
  notes: string;
}

const PositivePsychologyTab: React.FC<PositivePsychologyTabProps> = ({ onComplete }) => {
  const { language } = useLanguage();
  const [activeExercise, setActiveExercise] = useState<string | null>(null);
  const [responses, setResponses] = useState<Record<string, ExerciseResponse>>({
    gratitude: { completed: false, steps: [false, false, false], notes: "" },
    strengths: { completed: false, steps: [false, false, false, false], notes: "" },
    happiness: { completed: false, steps: [false, false, false], notes: "" },
    optimism: { completed: false, steps: [false, false, false], notes: "" }
  });

  const calculateProgress = () => {
    const exerciseCount = Object.keys(responses).length;
    const completedCount = Object.values(responses).filter(r => r.completed).length;
    return Math.round((completedCount / exerciseCount) * 100);
  };

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

  const updateNotes = (exerciseId: string, notes: string) => {
    setResponses(prev => ({
      ...prev,
      [exerciseId]: {
        ...prev[exerciseId],
        notes
      }
    }));
  };

  const completeExercise = (exerciseId: string) => {
    setResponses(prev => ({
      ...prev,
      [exerciseId]: {
        ...prev[exerciseId],
        completed: true
      }
    }));
    onComplete(exerciseId, responses[exerciseId].notes);
  };

  const exercises = [
    {
      id: "gratitude",
      icon: Heart,
      title: language === "en" ? "Gratitude Practice" : "ممارسة الامتنان",
      description: language === "en" 
        ? "Cultivate appreciation for the positive aspects of life"
        : "تنمية التقدير للجوانب الإيجابية في الحياة",
      steps: language === "en"
        ? [
            "List three things you are grateful for today",
            "Write why each one is meaningful to you",
            "Reflect on how these positives impact your life"
          ]
        : [
            "اكتب ثلاثة أشياء أنت ممتن لها اليوم",
            "اكتب لماذا كل منها مهم بالنسبة لك",
            "تأمل في كيف تؤثر هذه الإيجابيات على حياتك"
          ]
    },
    {
      id: "strengths",
      icon: Star,
      title: language === "en" ? "Character Strengths" : "نقاط القوة الشخصية",
      description: language === "en"
        ? "Identify and develop your personal strengths"
        : "تحديد وتطوير نقاط القوة الشخصية",
      steps: language === "en"
        ? [
            "Identify your top 3 character strengths",
            "Recall times when you used these strengths effectively",
            "Plan how to use these strengths more in daily life",
            "Share your strengths with someone you trust"
          ]
        : [
            "حدد أهم 3 نقاط قوة في شخصيتك",
            "تذكر الأوقات التي استخدمت فيها نقاط القوة هذه بفعالية",
            "خطط لكيفية استخدام نقاط القوة هذه أكثر في الحياة اليومية",
            "شارك نقاط قوتك مع شخص تثق به"
          ]
    },
    {
      id: "happiness",
      icon: Smile,
      title: language === "en" ? "Happiness Activities" : "أنشطة السعادة",
      description: language === "en"
        ? "Engage in activities that boost positive emotions"
        : "المشاركة في أنشطة تعزز المشاعر الإيجابية",
      steps: language === "en"
        ? [
            "Plan a pleasant activity for today",
            "Practice random acts of kindness",
            "Connect with someone who makes you happy"
          ]
        : [
            "خطط لنشاط ممتع لهذا اليوم",
            "مارس أعمال الخير العشوائية",
            "تواصل مع شخص يجعلك سعيداً"
          ]
    },
    {
      id: "optimism",
      icon: Sun,
      title: language === "en" ? "Optimistic Thinking" : "التفكير المتفائل",
      description: language === "en"
        ? "Develop a more positive outlook on future events"
        : "تطوير نظرة أكثر إيجابية للأحداث المستقبلية",
      steps: language === "en"
        ? [
            "Identify a future event you are worried about",
            "List possible positive outcomes",
            "Create a plan to work towards the best outcome"
          ]
        : [
            "حدد حدثاً مستقبلياً تشعر بالقلق بشأنه",
            "اكتب النتائج الإيجابية المحتملة",
            "ضع خطة للعمل نحو أفضل نتيجة"
          ]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>
            {language === "en" ? "Progress" : "التقدم"}
          </span>
          <span>{calculateProgress()}%</span>
        </div>
        <Progress value={calculateProgress()} className="h-2" />
      </div>

      <ScrollArea className="h-[600px] pr-4">
        <Accordion 
          type="single" 
          collapsible 
          className="w-full space-y-4"
          value={activeExercise || undefined}
          onValueChange={setActiveExercise}
        >
          {exercises.map((exercise) => {
            const Icon = exercise.icon;
            return (
              <AccordionItem key={exercise.id} value={exercise.id} className="border rounded-lg p-2">
                <AccordionTrigger className="flex items-center gap-2 hover:no-underline">
                  <div className="flex items-center gap-2">
                    <Icon className="h-5 w-5 text-primary" />
                    <span>{exercise.title}</span>
                    {responses[exercise.id]?.completed && (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    )}
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <Card>
                    <CardContent className="pt-4 space-y-4">
                      <CardDescription>{exercise.description}</CardDescription>
                      
                      <div className="space-y-4">
                        {exercise.steps.map((step, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <input
                              type="checkbox"
                              id={`${exercise.id}-step-${index}`}
                              checked={responses[exercise.id]?.steps[index] || false}
                              onChange={() => toggleStep(exercise.id, index)}
                              className="mt-1"
                            />
                            <Label htmlFor={`${exercise.id}-step-${index}`}>
                              {step}
                            </Label>
                          </div>
                        ))}
                      </div>

                      <div className="space-y-2">
                        <Label>
                          {language === "en" ? "Your Reflections" : "تأملاتك"}
                        </Label>
                        <Textarea
                          value={responses[exercise.id]?.notes || ""}
                          onChange={(e) => updateNotes(exercise.id, e.target.value)}
                          placeholder={language === "en" 
                            ? "Write your thoughts and experiences here..."
                            : "اكتب أفكارك وتجاربك هنا..."}
                          className="min-h-[100px]"
                        />
                      </div>

                      <Button
                        onClick={() => completeExercise(exercise.id)}
                        disabled={!responses[exercise.id]?.steps.some(step => step)}
                        className="w-full"
                      >
                        {language === "en" ? "Complete Exercise" : "إكمال التمرين"}
                      </Button>
                    </CardContent>
                  </Card>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </ScrollArea>
    </div>
  );
};

export default PositivePsychologyTab; 