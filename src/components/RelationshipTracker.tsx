
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/components/Header';
import { Heart, Plus, ArrowUp, ArrowDown } from 'lucide-react';
import { Label } from '@/components/ui/label';

type InteractionType = 'positive' | 'negative' | 'neutral';

interface Interaction {
  id: string;
  type: InteractionType;
  date: Date;
  description: string;
  reflection: string;
}

const RelationshipTracker = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [interactions, setInteractions] = useState<Interaction[]>([
    {
      id: '1',
      type: 'positive',
      date: new Date(),
      description: language === 'en' ? 'Had a great conversation about our future' : 'أجرينا محادثة رائعة حول مستقبلنا',
      reflection: language === 'en' ? 'I felt heard and understood' : 'شعرت بالاستماع والفهم'
    },
    {
      id: '2',
      type: 'negative',
      date: new Date(Date.now() - 86400000),
      description: language === 'en' ? 'Disagreement about financial priorities' : 'خلاف حول الأولويات المالية',
      reflection: language === 'en' ? 'Need to work on communication' : 'أحتاج إلى العمل على التواصل'
    }
  ]);
  
  const [newDescription, setNewDescription] = useState('');
  const [newReflection, setNewReflection] = useState('');
  const [interactionType, setInteractionType] = useState<InteractionType>('positive');
  const [isAdding, setIsAdding] = useState(false);
  
  const handleAddInteraction = () => {
    if (!newDescription.trim()) {
      toast({
        title: language === 'en' ? 'Description Required' : 'الوصف مطلوب',
        description: language === 'en' ? 'Please add a description of the interaction.' : 'يرجى إضافة وصف للتفاعل.',
        variant: 'destructive',
      });
      return;
    }
    
    const newInteraction: Interaction = {
      id: Date.now().toString(),
      type: interactionType,
      date: new Date(),
      description: newDescription,
      reflection: newReflection
    };
    
    setInteractions([newInteraction, ...interactions]);
    setNewDescription('');
    setNewReflection('');
    setIsAdding(false);
    
    toast({
      title: language === 'en' ? 'Interaction Added' : 'تمت إضافة التفاعل',
      description: language === 'en' ? 'Your relationship interaction has been recorded.' : 'تم تسجيل تفاعل علاقتك.',
    });
  };
  
  const getInteractionColor = (type: InteractionType) => {
    switch(type) {
      case 'positive': return 'bg-green-100 text-green-800';
      case 'negative': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getInteractionIcon = (type: InteractionType) => {
    switch(type) {
      case 'positive': return <ArrowUp className="h-4 w-4 text-green-600" />;
      case 'negative': return <ArrowDown className="h-4 w-4 text-red-600" />;
      default: return null;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-primary" />
          {language === 'en' ? 'Relationship Tracker' : 'متتبع العلاقات'}
        </CardTitle>
        <CardDescription>
          {language === 'en'
            ? 'Track and reflect on your relationship interactions'
            : 'تتبع وتأمل في تفاعلات علاقتك'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isAdding ? (
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
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                className="h-20"
              />
            </div>
            
            <div className="space-y-2">
              <Label>
                {language === 'en' ? 'Your Reflection' : 'تأملك'}
              </Label>
              <Textarea 
                placeholder={language === 'en' ? 'How did you feel about it? What did you learn?' : 'كيف شعرت حيال ذلك؟ ماذا تعلمت؟'}
                value={newReflection}
                onChange={(e) => setNewReflection(e.target.value)}
                className="h-20"
              />
            </div>
            
            <div className="flex gap-2">
              <Button onClick={handleAddInteraction}>
                {language === 'en' ? 'Save Interaction' : 'حفظ التفاعل'}
              </Button>
              <Button variant="outline" onClick={() => setIsAdding(false)}>
                {language === 'en' ? 'Cancel' : 'إلغاء'}
              </Button>
            </div>
          </div>
        ) : (
          <Button
            onClick={() => setIsAdding(true)}
            className="w-full flex items-center justify-center gap-2"
          >
            <Plus className="h-4 w-4" />
            {language === 'en' ? 'Add New Interaction' : 'إضافة تفاعل جديد'}
          </Button>
        )}
        
        <div className="space-y-4">
          <h3 className="font-medium">
            {language === 'en' ? 'Recent Interactions' : 'التفاعلات الأخيرة'}
          </h3>
          
          {interactions.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              {language === 'en' 
                ? 'No interactions recorded yet. Add your first one!'
                : 'لم يتم تسجيل أي تفاعلات حتى الآن. أضف أول واحد!'}
            </p>
          ) : (
            <div className="space-y-3">
              {interactions.map((interaction) => (
                <Card key={interaction.id} className="overflow-hidden">
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        {getInteractionIcon(interaction.type)}
                        <span className={`text-xs px-2 py-1 rounded-full ${getInteractionColor(interaction.type)}`}>
                          {interaction.type === 'positive' 
                            ? (language === 'en' ? 'Positive' : 'إيجابي')
                            : interaction.type === 'negative'
                              ? (language === 'en' ? 'Negative' : 'سلبي')
                              : (language === 'en' ? 'Neutral' : 'محايد')}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(interaction.date).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <p className="text-sm font-medium mb-2">{interaction.description}</p>
                    
                    {interaction.reflection && (
                      <div className="bg-muted/40 p-2 rounded text-sm">
                        <p className="text-xs font-medium mb-1">
                          {language === 'en' ? 'Reflection' : 'تأمل'}
                        </p>
                        <p className="text-muted-foreground">{interaction.reflection}</p>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          {language === 'en' ? 'View All Interactions' : 'عرض جميع التفاعلات'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RelationshipTracker;
