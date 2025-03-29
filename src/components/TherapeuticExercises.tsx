
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/components/Header';
import { Heart, Brain, CheckCircle } from 'lucide-react';

const TherapeuticExercises = () => {
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

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-primary" />
          {language === 'en' ? 'Therapeutic Exercises' : 'تمارين علاجية'}
        </CardTitle>
        <CardDescription>
          {language === 'en'
            ? 'Practice exercises to improve your mental wellbeing'
            : 'ممارسة التمارين لتحسين صحتك النفسية'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="cbt" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="cbt">
              {language === 'en' ? 'CBT Techniques' : 'تقنيات CBT'}
            </TabsTrigger>
            <TabsTrigger value="dbt">
              {language === 'en' ? 'DBT Techniques' : 'تقنيات DBT'}
            </TabsTrigger>
            <TabsTrigger value="mindfulness">
              {language === 'en' ? 'Mindfulness' : 'اليقظة الذهنية'}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="cbt" className="space-y-4">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">
                {language === 'en' ? 'Thought Record Exercise' : 'تمرين تسجيل الأفكار'}
              </h3>
              
              {!exerciseCompleted ? (
                <>
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
                </>
              ) : (
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
              )}
            </div>
          </TabsContent>

          <TabsContent value="dbt" className="space-y-4">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">
                {language === 'en' ? 'Emotion Regulation Exercise' : 'تمرين تنظيم العواطف'}
              </h3>
              
              <div className="bg-accent/10 p-4 rounded-lg">
                <p className="text-sm mb-4">
                  {language === 'en'
                    ? 'This exercise helps you identify and regulate your emotions in difficult situations. Follow the steps below:'
                    : 'يساعدك هذا التمرين على تحديد وتنظيم عواطفك في المواقف الصعبة. اتبع الخطوات أدناه:'}
                </p>
                
                <ol className="space-y-4 list-decimal list-inside">
                  <li>
                    {language === 'en'
                      ? 'Identify the emotion you are feeling'
                      : 'حدد العاطفة التي تشعر بها'}
                  </li>
                  <li>
                    {language === 'en'
                      ? 'Rate the intensity from 1-10'
                      : 'قيم شدتها من ١-١٠'}
                  </li>
                  <li>
                    {language === 'en'
                      ? 'Identify the triggers of this emotion'
                      : 'حدد محفزات هذه العاطفة'}
                  </li>
                  <li>
                    {language === 'en'
                      ? 'Apply opposite action: do the opposite of what the emotion urges you to do'
                      : 'طبق الإجراء المعاكس: افعل عكس ما تحثك العاطفة على فعله'}
                  </li>
                  <li>
                    {language === 'en'
                      ? 'Practice self-soothing techniques'
                      : 'مارس تقنيات تهدئة الذات'}
                  </li>
                </ol>
              </div>
              
              <Button onClick={handleCompleteExercise} className="w-full">
                {language === 'en' ? 'Start Exercise' : 'ابدأ التمرين'}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="mindfulness" className="space-y-4">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">
                {language === 'en' ? 'Breathing Exercise (5-5-5)' : 'تمرين التنفس (٥-٥-٥)'}
              </h3>
              
              <div className="bg-accent/10 p-6 rounded-lg flex flex-col items-center">
                <div className="text-center mb-6">
                  <p className="text-xl mb-2">
                    {language === 'en' ? 'Breathe in' : 'استنشق'}
                  </p>
                  <div className="text-4xl font-bold text-primary">5</div>
                  <p className="text-sm text-muted-foreground">
                    {language === 'en' ? 'seconds' : 'ثوان'}
                  </p>
                </div>
                
                <div className="text-center mb-6">
                  <p className="text-xl mb-2">
                    {language === 'en' ? 'Hold' : 'امسك'}
                  </p>
                  <div className="text-4xl font-bold text-primary">5</div>
                  <p className="text-sm text-muted-foreground">
                    {language === 'en' ? 'seconds' : 'ثوان'}
                  </p>
                </div>
                
                <div className="text-center">
                  <p className="text-xl mb-2">
                    {language === 'en' ? 'Breathe out' : 'ازفر'}
                  </p>
                  <div className="text-4xl font-bold text-primary">5</div>
                  <p className="text-sm text-muted-foreground">
                    {language === 'en' ? 'seconds' : 'ثوان'}
                  </p>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground">
                {language === 'en'
                  ? 'Practice this breathing exercise for 5 minutes. It helps reduce anxiety and improve focus.'
                  : 'مارس تمرين التنفس هذا لمدة ٥ دقائق. يساعد على تقليل القلق وتحسين التركيز.'}
              </p>
              
              <Button onClick={handleCompleteExercise} className="w-full">
                {language === 'en' ? 'Start Guided Breathing' : 'ابدأ التنفس الموجه'}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">
          {language === 'en' ? 'View All Exercises' : 'عرض جميع التمارين'}
        </Button>
        <Button variant="ghost">
          {language === 'en' ? 'My Progress' : 'تقدمي'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TherapeuticExercises;
