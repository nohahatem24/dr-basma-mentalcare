
import React from 'react';
import { useLanguage } from '@/components/Header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';

const MessagesTab = () => {
  const { language } = useLanguage();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{language === 'en' ? 'Messages' : 'الرسائل'}</CardTitle>
        <CardDescription>
          {language === 'en' 
            ? 'Communicate securely with your therapist' 
            : 'تواصل بشكل آمن مع معالجك النفسي'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <MessageCircle className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">
            {language === 'en' ? 'No Messages Yet' : 'لا توجد رسائل حتى الآن'}
          </h3>
          <p className="text-muted-foreground max-w-md mb-6">
            {language === 'en' 
              ? 'Once you book a session with your therapist, you can send messages and receive responses here.' 
              : 'بمجرد حجز جلسة مع معالجك النفسي، يمكنك إرسال الرسائل وتلقي الردود هنا.'}
          </p>
          <Button asChild>
            <a href="/book-appointment">
              {language === 'en' ? 'Book a Session' : 'حجز جلسة'}
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MessagesTab;
