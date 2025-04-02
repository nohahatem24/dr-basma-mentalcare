
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/components/Header';
import { MessageCircle } from 'lucide-react';
import ReviewForm from './reviews/ReviewForm';
import ReviewsList from './reviews/ReviewsList';
import { renderStars } from './reviews/utils';
import { useReviews } from './reviews/ReviewsContext';

const DoctorReviews = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const { reviews, addReview } = useReviews();
  
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [filter, setFilter] = useState('all');
  
  const handleAddReview = (name: string, rating: number, comment: string, isAnonymous: boolean) => {
    if (!comment.trim()) {
      toast({
        title: language === 'en' ? 'Review Required' : 'التعليق مطلوب',
        description: language === 'en' ? 'Please add your review before submitting.' : 'يرجى إضافة مراجعتك قبل التقديم.',
        variant: 'destructive',
      });
      return;
    }
    
    addReview(name, rating, comment, isAnonymous);
    setShowReviewForm(false);
    
    toast({
      title: language === 'en' ? 'Review Submitted' : 'تم تقديم المراجعة',
      description: language === 'en' ? 'Thank you for your feedback!' : 'شكرا لملاحظاتك!',
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-primary" />
          {language === 'en' ? 'Client Reviews' : 'آراء العملاء'}
        </CardTitle>
        <CardDescription>
          {language === 'en'
            ? 'Read what others are saying about Dr. Bassma\'s services'
            : 'اقرأ ما يقوله الآخرون عن خدمات الدكتورة بسمة'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!showReviewForm ? (
          <Button 
            onClick={() => setShowReviewForm(true)}
            className="w-full"
          >
            {language === 'en' ? 'Write a Review' : 'اكتب مراجعة'}
          </Button>
        ) : (
          <ReviewForm 
            onSubmit={handleAddReview} 
            onCancel={() => setShowReviewForm(false)} 
          />
        )}
        
        <ReviewsList 
          reviews={reviews} 
          filter={filter} 
          setFilter={setFilter} 
          renderStars={renderStars}
        />
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          {language === 'en' ? 'View All Reviews' : 'عرض جميع المراجعات'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DoctorReviews;
