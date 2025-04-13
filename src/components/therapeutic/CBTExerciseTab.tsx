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
import { Brain, CheckCircle, ThoughtBubble, ArrowRight, Save, Pencil, Plus } from 'lucide-react';

interface CBTExerciseTabProps {
  onComplete?: () => void;
}

interface ThoughtRecord {
  id: string;
  situation: string;
  automaticThought: string;
  emotions: string;
  evidence: {
    for: string;
    against: string;
  };
  alternativeThought: string;
  outcome: string;
  date: Date;
}

const exercises = [
  {
    id: 'thought-record',
    title: { en: 'Thought Record', ar: 'سجل الأفكار' },
    description: {
      en: 'Identify and challenge negative thought patterns',
      ar: 'تحديد وتحدي أنماط التفكير السلبية'
    },
    steps: [
      { en: 'Describe the situation', ar: 'صف الموقف' },
      { en: 'Note your automatic thoughts', ar: 'دوّن أفكارك التلقائية' },
      { en: 'Identify your emotions', ar: 'حدد مشاعرك' },
      { en: 'Find evidence for and against', ar: 'ابحث عن أدلة مع وضد' },
      { en: 'Generate alternative thoughts', ar: 'ولّد أفكارًا بديلة' },
      { en: 'Note the outcome', ar: 'دوّن النتيجة' }
    ]
  },
  {
    id: 'cognitive-defusion',
    title: { en: 'Cognitive Defusion', ar: 'الانفصال المعرفي' },
    description: {
      en: 'Learn to separate yourself from your thoughts',
      ar: 'تعلم فصل نفسك عن أفكارك'
    },
    techniques: [
      {
        title: { en: 'Labeling Thoughts', ar: 'تسمية الأفكار' },
        description: {
          en: 'Prefix thoughts with "I'm having the thought that..."',
          ar: 'أضف قبل الأفكار "أنا لدي فكرة أن..."'
        }
      },
      {
        title: { en: 'Thanking Your Mind', ar: 'شكر عقلك' },
        description: {
          en: 'Thank your mind for the thought, then let it go',
          ar: 'اشكر عقلك على الفكرة، ثم دعها تذهب'
        }
      },
      {
        title: { en: 'Singing Thoughts', ar: 'غناء الأفكار' },
        description: {
          en: 'Sing your negative thoughts to a familiar tune',
          ar: 'غنِّ أفكارك السلبية على لحن مألوف'
        }
      }
    ]
  }
];

const CBTExerciseTab: React.FC<CBTExerciseTabProps> = ({ onComplete }) => {
  const { language } = useLanguage();
  const [thoughtRecords, setThoughtRecords] = useState<ThoughtRecord[]>([]);
  const [currentRecord, setCurrentRecord] = useState<ThoughtRecord>({
    id: '',
    situation: '',
    automaticThought: '',
    emotions: '',
    evidence: { for: '', against: '' },
    alternativeThought: '',
    outcome: '',
    date: new Date()
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeExercise, setActiveExercise] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const resetForm = () => {
    setCurrentRecord({
      id: '',
      situation: '',
      automaticThought: '',
      emotions: '',
      evidence: { for: '', against: '' },
      alternativeThought: '',
      outcome: '',
      date: new Date()
    });
    setEditingId(null);
  };

  const saveThoughtRecord = () => {
    if (editingId) {
      setThoughtRecords(prev =>
        prev.map(record =>
          record.id === editingId ? { ...currentRecord, id: editingId } : record
        )
      );
      setEditingId(null);
    } else {
      const newRecord = {
        ...currentRecord,
        id: Date.now().toString(),
        date: new Date()
      };
      setThoughtRecords(prev => [...prev, newRecord]);
    }
    resetForm();
    updateProgress();
  };

  const editRecord = (record: ThoughtRecord) => {
    setCurrentRecord(record);
    setEditingId(record.id);
  };

  const deleteRecord = (id: string) => {
    setThoughtRecords(prev => prev.filter(record => record.id !== id));
    updateProgress();
  };

  const updateProgress = () => {
    // Calculate progress based on completed thought records and exercises
    const totalSteps = 10; // Adjust based on your criteria
    const completedSteps = thoughtRecords.length;
    const newProgress = Math.min(Math.round((completedSteps / totalSteps) * 100), 100);
    setProgress(newProgress);

    if (newProgress === 100 && onComplete) {
      onComplete();
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>
                {language === 'en' ? 'CBT Exercises' : 'تمارين العلاج المعرفي السلوكي'}
              </CardTitle>
              <CardDescription>
                {language === 'en'
                  ? 'Practice cognitive behavioral therapy techniques'
                  : 'تمرن على تقنيات العلاج المعرفي السلوكي'}
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
            value={activeExercise}
            onValueChange={setActiveExercise}
          >
            {exercises.map(exercise => (
              <AccordionItem key={exercise.id} value={exercise.id}>
                <AccordionTrigger>
                  <div className="flex items-center gap-2">
                    {exercise.id === 'thought-record' ? (
                      <ThoughtBubble className="h-5 w-5" />
                    ) : (
                      <Brain className="h-5 w-5" />
                    )}
                    <span>
                      {language === 'en' ? exercise.title.en : exercise.title.ar}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="pt-4 space-y-6">
                    <p className="text-muted-foreground">
                      {language === 'en'
                        ? exercise.description.en
                        : exercise.description.ar}
                    </p>

                    {exercise.id === 'thought-record' ? (
                      <div className="space-y-6">
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label>
                              {language === 'en' ? 'Situation' : 'الموقف'}
                            </Label>
                            <Textarea
                              value={currentRecord.situation}
                              onChange={(e) =>
                                setCurrentRecord({
                                  ...currentRecord,
                                  situation: e.target.value
                                })
                              }
                              placeholder={
                                language === 'en'
                                  ? 'Describe what happened...'
                                  : 'صف ما حدث...'
                              }
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>
                              {language === 'en'
                                ? 'Automatic Thoughts'
                                : 'الأفكار التلقائية'}
                            </Label>
                            <Textarea
                              value={currentRecord.automaticThought}
                              onChange={(e) =>
                                setCurrentRecord({
                                  ...currentRecord,
                                  automaticThought: e.target.value
                                })
                              }
                              placeholder={
                                language === 'en'
                                  ? 'What went through your mind?'
                                  : 'ما الذي خطر ببالك؟'
                              }
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>
                              {language === 'en' ? 'Emotions' : 'المشاعر'}
                            </Label>
                            <Textarea
                              value={currentRecord.emotions}
                              onChange={(e) =>
                                setCurrentRecord({
                                  ...currentRecord,
                                  emotions: e.target.value
                                })
                              }
                              placeholder={
                                language === 'en'
                                  ? 'How did you feel?'
                                  : 'كيف شعرت؟'
                              }
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>
                                {language === 'en'
                                  ? 'Evidence For'
                                  : 'الأدلة المؤيدة'}
                              </Label>
                              <Textarea
                                value={currentRecord.evidence.for}
                                onChange={(e) =>
                                  setCurrentRecord({
                                    ...currentRecord,
                                    evidence: {
                                      ...currentRecord.evidence,
                                      for: e.target.value
                                    }
                                  })
                                }
                                placeholder={
                                  language === 'en'
                                    ? 'What supports this thought?'
                                    : 'ما الذي يدعم هذه الفكرة؟'
                                }
                              />
                            </div>

                            <div className="space-y-2">
                              <Label>
                                {language === 'en'
                                  ? 'Evidence Against'
                                  : 'الأدلة المعارضة'}
                              </Label>
                              <Textarea
                                value={currentRecord.evidence.against}
                                onChange={(e) =>
                                  setCurrentRecord({
                                    ...currentRecord,
                                    evidence: {
                                      ...currentRecord.evidence,
                                      against: e.target.value
                                    }
                                  })
                                }
                                placeholder={
                                  language === 'en'
                                    ? 'What contradicts this thought?'
                                    : 'ما الذي يتعارض مع هذه الفكرة؟'
                                }
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label>
                              {language === 'en'
                                ? 'Alternative Thought'
                                : 'الفكرة البديلة'}
                            </Label>
                            <Textarea
                              value={currentRecord.alternativeThought}
                              onChange={(e) =>
                                setCurrentRecord({
                                  ...currentRecord,
                                  alternativeThought: e.target.value
                                })
                              }
                              placeholder={
                                language === 'en'
                                  ? 'What's a more balanced view?'
                                  : 'ما هي النظرة الأكثر توازناً؟'
                              }
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>
                              {language === 'en' ? 'Outcome' : 'النتيجة'}
                            </Label>
                            <Textarea
                              value={currentRecord.outcome}
                              onChange={(e) =>
                                setCurrentRecord({
                                  ...currentRecord,
                                  outcome: e.target.value
                                })
                              }
                              placeholder={
                                language === 'en'
                                  ? 'How do you feel now?'
                                  : 'كيف تشعر الآن؟'
                              }
                            />
                          </div>
                        </div>

                        <div className="flex justify-end gap-2">
                          <Button variant="outline" onClick={resetForm}>
                            {language === 'en' ? 'Reset' : 'إعادة ضبط'}
                          </Button>
                          <Button onClick={saveThoughtRecord}>
                            <Save className="h-4 w-4 mr-2" />
                            {editingId
                              ? language === 'en'
                                ? 'Update Record'
                                : 'تحديث السجل'
                              : language === 'en'
                              ? 'Save Record'
                              : 'حفظ السجل'}
                          </Button>
                        </div>

                        {thoughtRecords.length > 0 && (
                          <div className="mt-8">
                            <h3 className="font-semibold mb-4">
                              {language === 'en'
                                ? 'Previous Records'
                                : 'السجلات السابقة'}
                            </h3>
                            <ScrollArea className="h-[300px]">
                              <div className="space-y-4">
                                {thoughtRecords.map((record) => (
                                  <Card key={record.id}>
                                    <CardContent className="pt-6">
                                      <div className="flex justify-between items-start mb-4">
                                        <div>
                                          <p className="font-medium">
                                            {record.situation.substring(0, 100)}
                                            {record.situation.length > 100
                                              ? '...'
                                              : ''}
                                          </p>
                                          <p className="text-sm text-muted-foreground">
                                            {record.date.toLocaleDateString()}
                                          </p>
                                        </div>
                                        <div className="flex gap-2">
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => editRecord(record)}
                                          >
                                            <Pencil className="h-4 w-4" />
                                          </Button>
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => deleteRecord(record.id)}
                                          >
                                            <Trash2 className="h-4 w-4" />
                                          </Button>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                ))}
                              </div>
                            </ScrollArea>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {exercise.techniques.map((technique, index) => (
                          <Card key={index}>
                            <CardContent className="pt-6">
                              <h4 className="font-semibold mb-2">
                                {language === 'en'
                                  ? technique.title.en
                                  : technique.title.ar}
                              </h4>
                              <p className="text-muted-foreground">
                                {language === 'en'
                                  ? technique.description.en
                                  : technique.description.ar}
                              </p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
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

export default CBTExerciseTab;
