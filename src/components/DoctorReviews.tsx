
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/components/Header';
import { Star, MessageCircle, User, ThumbsUp, Filter } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: Date;
  isAnonymous: boolean;
  isRecommended: boolean;
  reply?: string;
}

const DoctorReviews = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: '1',
      author: 'Sarah',
      rating: 5,
      comment: language === 'en'
        ? 'Dr. Bassma was extremely helpful in my journey. Her approach to CBT techniques really helped me overcome my anxiety. Highly recommended!'
        : 'كانت الدكتورة بسمة مفيدة للغاية في رحلتي. ساعدني نهجها في تقنيات العلاج المعرفي السلوكي حقًا على التغلب على قلقي. موصى به بشدة!',
      date: new Date(Date.now() - 7 * 86400000),
      isAnonymous: false,
      isRecommended: true
    },
    {
      id: '2',
      author: 'Anonymous',
      rating: 4,
      comment: language === 'en'
        ? 'The MindTrack app has been a great tool for monitoring my emotions. Dr. Bassma\'s insights during our sessions complement the app perfectly.'
        : 'كان تطبيق MindTrack أداة رائعة لمراقبة عواطفي. تكمل رؤى الدكتورة بسمة خلال جلساتنا التطبيق بشكل مثالي.',
      date: new Date(Date.now() - 14 * 86400000),
      isAnonymous: true,
      isRecommended: true
    },
    {
      id: '3',
      author: 'Ahmed',
      rating: 5,
      comment: language === 'en'
        ? 'I was skeptical about online therapy at first, but Dr. Bassma completely changed my perspective. Her compassionate approach and practical strategies have made a huge difference in my daily life.'
        : 'كنت متشككًا في العلاج عبر الإنترنت في البداية، لكن الدكتورة بسمة غيرت وجهة نظري تمامًا. لقد أحدث نهجها الرحيم واستراتيجياتها العملية فرقًا كبيرًا في حياتي اليومية.',
      date: new Date(Date.now() - 21 * 86400000),
      isAnonymous: false,
      isRecommended: true,
      reply: language === 'en'
        ? 'Thank you for your kind words, Ahmed! I\'m glad I could provide the support you needed.'
        : 'شكرًا لكلماتك اللطيفة، أحمد! أنا سعيدة لأنني تمكنت من تقديم الدعم الذي تحتاجه.'
    }
  ]);
  
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [name, setName] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [filter, setFilter] = useState('all');
  
  const handleAddReview = () => {
    if (!comment.trim()) {
      toast({
        title: language === 'en' ? 'Review Required' : 'التعليق مطلوب',
        description: language === 'en' ? 'Please add your review before submitting.' : 'يرجى إضافة مراجعتك قبل التقديم.',
        variant: 'destructive',
      });
      return;
    }
    
    const newReview: Review = {
      id: Date.now().toString(),
      author: isAnonymous ? 'Anonymous' : name || 'User',
      rating,
      comment,
      date: new Date(),
      isAnonymous,
      isRecommended: rating > 3,
    };
    
    setReviews([newReview, ...reviews]);
    setName('');
    setRating(5);
    setComment('');
    setIsAnonymous(false);
    setShowReviewForm(false);
    
    toast({
      title: language === 'en' ? 'Review Submitted' : 'تم تقديم المراجعة',
      description: language === 'en' ? 'Thank you for your feedback!' : 'شكرا لملاحظاتك!',
    });
  };
  
  const getFilteredReviews = () => {
    switch(filter) {
      case 'highest':
        return [...reviews].sort((a, b) => b.rating - a.rating);
      case 'lowest':
        return [...reviews].sort((a, b) => a.rating - b.rating);
      case 'recent':
        return [...reviews].sort((a, b) => b.date.getTime() - a.date.getTime());
      default:
        return reviews;
    }
  };
  
  const renderStars = (count: number) => {
    return Array(5).fill(0).map((_, i) => (
      <Star 
        key={i} 
        className={`h-5 w-5 ${i < count ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
      />
    ));
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
          <div className="space-y-4 bg-accent/10 p-4 rounded-lg">
            <h3 className="font-medium">
              {language === 'en' ? 'Share Your Experience' : 'شارك تجربتك'}
            </h3>
            
            <div className="space-y-2">
              <Label>{language === 'en' ? 'Your Name' : 'اسمك'}</Label>
              <Input 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={language === 'en' ? 'Your name' : 'اسمك'}
                disabled={isAnonymous}
              />
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="anonymous"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="h-4 w-4"
                />
                <Label htmlFor="anonymous" className="text-sm cursor-pointer">
                  {language === 'en' ? 'Post anonymously' : 'النشر مجهول الهوية'}
                </Label>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>{language === 'en' ? 'Your Rating' : 'تقييمك'}</Label>
              <div className="flex gap-1">
                {Array(5).fill(0).map((_, i) => (
                  <Star 
                    key={i}
                    className={`h-6 w-6 cursor-pointer ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                    onClick={() => setRating(i + 1)}
                  />
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>{language === 'en' ? 'Your Review' : 'مراجعتك'}</Label>
              <Textarea 
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={language === 'en' ? 'Share your experience with Dr. Bassma...' : 'شارك تجربتك مع الدكتورة بسمة...'}
                className="h-32"
              />
            </div>
            
            <div className="flex gap-2">
              <Button onClick={handleAddReview}>
                {language === 'en' ? 'Submit Review' : 'إرسال المراجعة'}
              </Button>
              <Button variant="outline" onClick={() => setShowReviewForm(false)}>
                {language === 'en' ? 'Cancel' : 'إلغاء'}
              </Button>
            </div>
          </div>
        )}
        
        <div className="flex justify-between items-center">
          <h3 className="font-medium">
            {language === 'en' ? 'All Reviews' : 'جميع المراجعات'}
          </h3>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="text-sm border rounded px-2 py-1"
            >
              <option value="all">{language === 'en' ? 'All Reviews' : 'جميع المراجعات'}</option>
              <option value="highest">{language === 'en' ? 'Highest Rated' : 'أعلى تقييم'}</option>
              <option value="lowest">{language === 'en' ? 'Lowest Rated' : 'أدنى تقييم'}</option>
              <option value="recent">{language === 'en' ? 'Most Recent' : 'الأحدث'}</option>
            </select>
          </div>
        </div>
        
        <div className="space-y-4">
          {getFilteredReviews().length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              {language === 'en' 
                ? 'No reviews yet. Be the first to share your experience!'
                : 'لا توجد مراجعات حتى الآن. كن أول من يشارك تجربته!'}
            </p>
          ) : (
            getFilteredReviews().map((review) => (
              <Card key={review.id} className="overflow-hidden">
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      {review.isAnonymous ? (
                        <div className="bg-muted w-8 h-8 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-muted-foreground" />
                        </div>
                      ) : (
                        <div className="bg-primary/10 w-8 h-8 rounded-full flex items-center justify-center">
                          <span className="text-primary font-medium">{review.author.charAt(0)}</span>
                        </div>
                      )}
                      <div>
                        <p className="font-medium">{review.author}</p>
                        <div className="flex">
                          {renderStars(review.rating)}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {review.date.toLocaleDateString()}
                    </span>
                  </div>
                  
                  <p className="mb-3 text-sm">{review.comment}</p>
                  
                  {review.isRecommended && (
                    <div className="flex items-center gap-1 text-green-600 text-sm mb-3">
                      <ThumbsUp className="h-4 w-4" />
                      <span>{language === 'en' ? 'Recommends Dr. Bassma' : 'يوصي بالدكتورة بسمة'}</span>
                    </div>
                  )}
                  
                  {review.reply && (
                    <div className="bg-muted/40 p-3 rounded text-sm mt-3">
                      <p className="font-medium mb-1">{language === 'en' ? 'Dr. Bassma replied:' : 'رد الدكتورة بسمة:'}</p>
                      <p className="text-muted-foreground">{review.reply}</p>
                    </div>
                  )}
                </div>
              </Card>
            ))
          )}
        </div>
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
