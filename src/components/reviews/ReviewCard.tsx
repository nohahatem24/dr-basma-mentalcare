
import React from 'react';
import { Card } from '@/components/ui/card';
import { ThumbsUp, User, Star } from 'lucide-react';
import { useLanguage } from '@/components/Header';
import { Review } from './types';
import { Badge } from '@/components/ui/badge';

interface ReviewCardProps {
  review: Review;
  renderStars: (count: number) => React.ReactNode;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review, renderStars }) => {
  const { language } = useLanguage();

  return (
    <Card key={review.id} className={`overflow-hidden ${review.isFeatured ? 'border-primary/50 bg-primary/5' : ''}`}>
      <div className="p-4">
        {review.isFeatured && (
          <Badge variant="outline" className="mb-2 bg-primary/10 text-primary">
            {language === 'en' ? 'Featured Review' : 'مراجعة مميزة'}
          </Badge>
        )}
        
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
            <span>{language === 'en' ? 'Recommends Dr. Basma' : 'يوصي بالدكتورة بسمة'}</span>
          </div>
        )}
        
        {review.reply && (
          <div className="bg-muted/40 p-3 rounded text-sm mt-3">
            <p className="font-medium mb-1">{language === 'en' ? 'Dr. Basma replied:' : 'رد الدكتورة بسمة:'}</p>
            <p className="text-muted-foreground">{review.reply}</p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ReviewCard;
