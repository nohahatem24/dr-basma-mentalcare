
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/components/Header';
import { Star, MessageCircle, User, ThumbsUp, Filter } from 'lucide-react';
import { Label } from '@/components/ui/label';

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
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isRecommended, setIsRecommended] = useState(true);
  const [isAddingReview, setIsAddingReview] = useState(false);
  const [sortOrder, setSortOrder] = useState<'newest' | 'highest' | 'lowest'>('newest');
  
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: '1',
      author: 'Sarah Johnson',
      rating: 5,
      comment: language === 'en' 
        ? 'Dr. Bassma was incredibly helpful in my journey. Her approach to CBT techniques really helped me overcome my anxiety. Highly recommended!'
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
      author: 'Ahmed Hassan',
      rating: 5,
      comment: language === 'en'
        ? 'Dr. Bassma provides a safe space to explore difficult emotions. Her expertise in both Arabic and English therapy methods is invaluable.'
        : 'توفر الدكتورة بسمة مساحة آمنة لاستكشاف المشاعر الصعبة. خبرتها في أساليب العلاج باللغتين العربية والإنجليزية لا تقدر بثمن.',
      date: new Date(Date.now() - 30 * 86400000),
      isAnonymous: false,
      isRecommended: true,
      reply: language === 'en'
        ? 'Thank you for your kind words, Ahmed! I\'m glad I could provide the support you needed.'
        : 'شكرًا لكلماتك اللطيفة، أحمد! أنا سعيدة لأنني تمكنت من تقديم الدعم الذي تحتاجه.'
    }
  ]);
  
  const handleSubmitReview = () => {
    if (rating === 0) {
      toast({
        title: language === 'en' ? 'Rating Required' : 'التقييم مطلوب',
        description: language === 'en' ? 'Please select a star rating before submitting.' : 'يرجى تحديد تقييم النجوم قبل الإرسال.',
        variant: 'destructive',
      });
      return;
    }
    
    if (!comment.trim()) {
      toast({
        title: language === 'en' ? 'Comment Required' : 'التعليق مطلوب',
        description: language === 'en' ? 'Please write a comment about your experience.' : 'يرجى كتابة تعليق حول تجربتك.',
        variant: 'destructive',
      });
      return;
    }
    
    const newReview: Review = {
      id: Date.now().toString(),
      author: isAnonymous ? 'Anonymous' : 'Current User',
      rating,
      comment,
      date: new Date(),
      isAnonymous,
      isRecommended
    };
    
    setReviews([newReview, ...reviews]);
    setRating(0);
    setComment('');
    setIsAnonymous(false);
    setIsRecommended(true);
    setIsAddingReview(false);
    
    toast({
      title: language === 'en' ? 'Review Submitted' : 'تم إرسال المراجعة',
      description: language === 'en' ? 'Thank you for sharing your experience!' : 'شكرا لمشاركة تجربتك!',
    });
  };
  
  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / reviews.length).toFixed(1);
  };
  
  const getSortedReviews = () => {
    return [...reviews].sort((a, b) => {
      if (sortOrder === 'newest') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      if (sortOrder === 'highest') {
        return b.rating - a.rating;
      }
      // lowest
      return a.rating - b.rating;
    });
  };
  
  const renderStars = (count: number, isInteractive = false) => {
    return (
      <div className="flex">
        {Array.from({ length: 5 }).map((_, i) => (
          <button
            key={i}
            type="button"
            className={`p-1 ${isInteractive ? 'cursor-pointer' : ''}`}
            onClick={isInteractive ? () => setRating(i + 1) : undefined}
            onMouseEnter={isInteractive ? () => setHoverRating(i + 1) : undefined}
            onMouseLeave={isInteractive ? () => setHoverRating(0) : undefined}
          >
            <Star 
              className={`h-5 w-5 ${
                (isInteractive ? (hoverRating || rating) : count) > i 
                  ? 'text-yellow-400 fill-yellow-400' 
                  : 'text-gray-300'
              }`} 
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-primary" />
              {language === 'en' ? 'Reviews & Feedback' : 'المراجعات والتعليقات'}
            </CardTitle>
            <CardDescription>
              {language === 'en'
                ? 'See what others are saying about Dr. Bassma'
                : 'شاهد ما يقوله الآخرون عن الدكتورة بسمة'}
            </CardDescription>
          </div>
          
          <div className="flex flex-col items-center bg-accent/10 p-3 rounded-lg">
            <div className="flex items-baseline">
              <span className="text-3xl font-bold">{getAverageRating()}</span>
              <span className="text-sm text-muted-foreground ml-1">/5</span>
            </div>
            <div className="flex my-1">
              {renderStars(parseFloat(getAverageRating()))}
            </div>
            <p className="text-xs text-muted-foreground">
              {language === 'en'
                ? `Based on ${reviews.length} reviews`
                : `بناءً على ${reviews.length} مراجعات`}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isAddingReview ? (
          <div className="space-y-4 bg-accent/10 p-4 rounded-lg">
            <h3 className="font-medium">
              {language === 'en' ? 'Write a Review' : 'اكتب مراجعة'}
            </h3>
            
            <div className="space-y-2">
              <Label>
                {language === 'en' ? 'Your Rating' : 'تقييمك'}
              </Label>
              <div className="flex items-center gap-2">
                {renderStars(0, true)}
                <span className="text-sm text-muted-foreground">
                  {rating > 0 
                    ? language === 'en' 
                      ? `${rating} star${rating !== 1 ? 's' : ''}` 
                      : `${rating} نجم${rating !== 1 ? 'ة' : ''}`
                    : ''}
                </span>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>
                {language === 'en' ? 'Your Review' : 'مراجعتك'}
              </Label>
              <Textarea 
                placeholder={language === 'en' 
                  ? 'Share your experience with Dr. Bassma...' 
                  : 'شارك تجربتك مع الدكتورة بسمة...'}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="h-32"
              />
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="anonymous" 
                  checked={isAnonymous} 
                  onChange={() => setIsAnonymous(!isAnonymous)}
                  className="rounded text-primary" 
                />
                <Label htmlFor="anonymous" className="cursor-pointer text-sm">
                  {language === 'en' ? 'Post Anonymously' : 'النشر بشكل مجهول'}
                </Label>
              </div>
              
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="recommend" 
                  checked={isRecommended} 
                  onChange={() => setIsRecommended(!isRecommended)}
                  className="rounded text-primary" 
                />
                <Label htmlFor="recommend" className="cursor-pointer text-sm">
                  {language === 'en' ? 'I Recommend Dr. Bassma' : 'أوصي بالدكتورة بسمة'}
                </Label>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button onClick={handleSubmitReview}>
                {language === 'en' ? 'Submit Review' : 'إرسال المراجعة'}
              </Button>
              <Button variant="outline" onClick={() => setIsAddingReview(false)}>
                {language === 'en' ? 'Cancel' : 'إلغاء'}
              </Button>
            </div>
          </div>
        ) : (
          <Button
            onClick={() => setIsAddingReview(true)}
            className="w-full"
          >
            {language === 'en' ? 'Write a Review' : 'اكتب مراجعة'}
          </Button>
        )}
        
        <div className="flex items-center justify-between">
          <h3 className="font-medium">
            {language === 'en' ? 'All Reviews' : 'جميع المراجعات'}
          </h3>
          
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select 
              className="bg-transparent text-sm border-none focus:ring-0"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as any)}
            >
              <option value="newest">{language === 'en' ? 'Newest' : 'الأحدث'}</option>
              <option value="highest">{language === 'en' ? 'Highest Rating' : 'أعلى تقييم'}</option>
              <option value="lowest">{language === 'en' ? 'Lowest Rating' : 'أدنى تقييم'}</option>
            </select>
          </div>
        </div>
        
        <div className="space-y-4">
          {getSortedReviews().map((review) => (
            <Card key={review.id} className="overflow-hidden">
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    {review.isAnonymous ? (
                      <div className="bg-muted h-8 w-8 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-muted-foreground" />
                      </div>
                    ) : (
                      <div className="bg-primary h-8 w-8 rounded-full flex items-center justify-center text-primary-foreground font-medium">
                        {review.author.charAt(0)}
                      </div>
                    )}
                    <div>
                      <p className="font-medium">{review.author}</p>
                      <div className="flex items-center">
                        {renderStars(review.rating)}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(review.date).toLocaleDateString()}
                  </span>
                </div>
                
                {review.isRecommended && (
                  <div className="flex items-center gap-1 text-green-600 text-sm mb-2">
                    <ThumbsUp className="h-3 w-3" />
                    <span>{language === 'en' ? 'Recommends Dr. Bassma' : 'يوصي بالدكتورة بسمة'}</span>
                  </div>
                )}
                
                <p className="text-sm mb-3">{review.comment}</p>
                
                {review.reply && (
                  <div className="bg-muted/30 p-3 rounded border-l-2 border-primary ml-2">
                    <p className="text-xs font-medium mb-1">
                      {language === 'en' ? 'Response from Dr. Bassma' : 'رد من الدكتورة بسمة'}
                    </p>
                    <p className="text-sm">{review.reply}</p>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          {language === 'en' ? 'Load More Reviews' : 'تحميل المزيد من المراجعات'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DoctorReviews;
