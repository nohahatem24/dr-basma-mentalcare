
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { useLanguage } from '@/components/Header';

interface TherapeuticExercisesCardProps {
  children: React.ReactNode;
}

const TherapeuticExercisesCard = ({ children }: TherapeuticExercisesCardProps) => {
  const { language } = useLanguage();
  
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
        {children}
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

export default TherapeuticExercisesCard;
