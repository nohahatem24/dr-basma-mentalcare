
import React, { useState } from 'react';
import { useLanguage } from '@/components/Header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const CPTTechniques = () => {
  const { language } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // State for Thought Record exercise
  const [thoughtRecord, setThoughtRecord] = useState({
    situation: '',
    thoughts: '',
    alternativeThoughts: '',
  });

  // State for 5-4-3-2-1 Grounding exercise
  const [groundingExercise, setGroundingExercise] = useState({
    see: '',
    touch: '',
    hear: '',
    smell: '',
    taste: '',
  });

  const handleThoughtRecordChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setThoughtRecord(prev => ({ ...prev, [name]: value }));
  };

  const handleGroundingChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setGroundingExercise(prev => ({ ...prev, [name]: value }));
  };

  const saveThoughtRecord = async () => {
    setIsSubmitting(true);
    
    try {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session.session) {
        toast({
          title: language === 'en' ? "Authentication Required" : "مطلوب المصادقة",
          description: language === 'en' 
            ? "Please sign in to save your thought record" 
            : "الرجاء تسجيل الدخول لحفظ سجل الأفكار الخاص بك",
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }
      
      const userId = session.session.user.id;
      
      // Save to cbt_exercises table
      const { error } = await supabase
        .from('cbt_exercises')
        .insert({
          user_id: userId,
          situation: thoughtRecord.situation,
          thoughts: thoughtRecord.thoughts,
          alternative_thoughts: thoughtRecord.alternativeThoughts,
          emotions: 'Mixed', // Default value
          behaviors: 'N/A', // Default value
        });
      
      if (error) throw error;
      
      toast({
        title: language === 'en' ? "Saved Successfully" : "تم الحفظ بنجاح",
        description: language === 'en' 
          ? "Your thought record has been saved" 
          : "تم حفظ سجل الأفكار الخاص بك",
      });

      // Reset form after saving
      setThoughtRecord({
        situation: '',
        thoughts: '',
        alternativeThoughts: '',
      });
      
    } catch (error) {
      toast({
        title: language === 'en' ? "Error" : "خطأ",
        description: language === 'en' 
          ? "There was a problem saving your record" 
          : "حدثت مشكلة أثناء حفظ السجل الخاص بك",
        variant: "destructive"
      });
      console.error("Error saving thought record:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>
          {language === 'en' ? 'Therapeutic Exercises' : 'التمارين العلاجية'}
        </CardTitle>
        <CardDescription>
          {language === 'en'
            ? 'Practice evidence-based techniques to manage thoughts and emotions'
            : 'تمارين تقنيات مثبتة علمياً لإدارة الأفكار والمشاعر'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="cognitive">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="cognitive">
              {language === 'en' ? 'CBT Techniques' : 'تقنيات العلاج المعرفي السلوكي'}
            </TabsTrigger>
            <TabsTrigger value="mindfulness">
              {language === 'en' ? 'Mindfulness' : 'اليقظة الذهنية'}
            </TabsTrigger>
          </TabsList>

          {/* CBT Techniques */}
          <TabsContent value="cognitive" className="space-y-6 pt-4">
            <div>
              <h3 className="text-xl font-semibold mb-4">
                {language === 'en' ? 'Thought Record Exercise' : 'تمرين سجل الأفكار'}
              </h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <p className="font-medium">
                    {language === 'en' 
                      ? '1. Situation: Describe a situation that triggered negative emotions'
                      : '١. الموقف: صف موقفاً أثار مشاعر سلبية'}
                  </p>
                  <Textarea 
                    name="situation"
                    value={thoughtRecord.situation}
                    onChange={handleThoughtRecordChange}
                    placeholder={language === 'en' ? "Describe the situation..." : "صف الموقف..."}
                    className="min-h-[100px]"
                  />
                </div>
                
                <div className="space-y-2">
                  <p className="font-medium">
                    {language === 'en'
                      ? '2. Automatic Thoughts: What thoughts came to mind?'
                      : '٢. الأفكار التلقائية: ما هي الأفكار التي خطرت ببالك؟'}
                  </p>
                  <Textarea 
                    name="thoughts"
                    value={thoughtRecord.thoughts}
                    onChange={handleThoughtRecordChange}
                    placeholder={language === 'en' ? "Write your automatic thoughts..." : "اكتب أفكارك التلقائية..."}
                    className="min-h-[100px]"
                  />
                </div>
                
                <div className="space-y-2">
                  <p className="font-medium">
                    {language === 'en'
                      ? '3. Alternative Thoughts: What are more balanced thoughts?'
                      : '٣. الأفكار البديلة: ما هي الأفكار الأكثر توازناً؟'}
                  </p>
                  <Textarea 
                    name="alternativeThoughts"
                    value={thoughtRecord.alternativeThoughts}
                    onChange={handleThoughtRecordChange}
                    placeholder={language === 'en' ? "Write more balanced thoughts..." : "اكتب أفكاراً أكثر توازناً..."}
                    className="min-h-[100px]"
                  />
                </div>
                
                <Button 
                  onClick={saveThoughtRecord} 
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting 
                    ? (language === 'en' ? "Saving..." : "جاري الحفظ...") 
                    : (language === 'en' ? "Save Exercise" : "حفظ التمرين")
                  }
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Mindfulness Techniques */}
          <TabsContent value="mindfulness" className="space-y-6 pt-4">
            <div>
              <h3 className="text-xl font-semibold mb-4">
                {language === 'en' ? '5-4-3-2-1 Grounding Technique' : 'تقنية التأريض ٥-٤-٣-٢-١'}
              </h3>
              <p className="text-muted-foreground mb-4">
                {language === 'en'
                  ? 'This exercise helps manage anxiety by engaging your senses to ground yourself in the present moment.'
                  : 'يساعد هذا التمرين في إدارة القلق من خلال إشراك حواسك للتأريض في اللحظة الحالية.'}
              </p>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <p className="font-medium">
                    {language === 'en' ? '5 things you can see:' : '٥ أشياء يمكنك رؤيتها:'}
                  </p>
                  <Textarea 
                    name="see"
                    value={groundingExercise.see}
                    onChange={handleGroundingChange}
                    placeholder={language === 'en' ? "List 5 things you can see..." : "اذكر ٥ أشياء يمكنك رؤيتها..."}
                  />
                </div>
                
                <div className="space-y-2">
                  <p className="font-medium">
                    {language === 'en' ? '4 things you can touch:' : '٤ أشياء يمكنك لمسها:'}
                  </p>
                  <Textarea 
                    name="touch"
                    value={groundingExercise.touch}
                    onChange={handleGroundingChange}
                    placeholder={language === 'en' ? "List 4 things you can touch..." : "اذكر ٤ أشياء يمكنك لمسها..."}
                  />
                </div>
                
                <div className="space-y-2">
                  <p className="font-medium">
                    {language === 'en' ? '3 things you can hear:' : '٣ أشياء يمكنك سماعها:'}
                  </p>
                  <Textarea 
                    name="hear"
                    value={groundingExercise.hear}
                    onChange={handleGroundingChange}
                    placeholder={language === 'en' ? "List 3 things you can hear..." : "اذكر ٣ أشياء يمكنك سماعها..."}
                  />
                </div>
                
                <div className="space-y-2">
                  <p className="font-medium">
                    {language === 'en' ? '2 things you can smell:' : '٢ أشياء يمكنك شمها:'}
                  </p>
                  <Textarea 
                    name="smell"
                    value={groundingExercise.smell}
                    onChange={handleGroundingChange}
                    placeholder={language === 'en' ? "List 2 things you can smell..." : "اذكر ٢ أشياء يمكنك شمها..."}
                  />
                </div>
                
                <div className="space-y-2">
                  <p className="font-medium">
                    {language === 'en' ? '1 thing you can taste:' : '١ شيء يمكنك تذوقه:'}
                  </p>
                  <Textarea 
                    name="taste"
                    value={groundingExercise.taste}
                    onChange={handleGroundingChange}
                    placeholder={language === 'en' ? "List 1 thing you can taste..." : "اذكر ١ شيء يمكنك تذوقه..."}
                  />
                </div>
                
                <Button className="w-full">
                  {language === 'en' ? "Complete Exercise" : "إكمال التمرين"}
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CPTTechniques;
