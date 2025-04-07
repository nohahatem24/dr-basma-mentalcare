import React from 'react';
import { Filter } from 'lucide-react';
import { useLanguage } from '@/components/Header';
import ReviewCard from './ReviewCard';
import { Review } from './types';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';

interface ReviewsListProps {
  reviews: Review[];
  filter: string;
  setFilter: (filter: string) => void;
  renderStars: (count: number) => React.ReactNode;
}

const ReviewsList: React.FC<ReviewsListProps> = ({ 
  reviews, 
  filter, 
  setFilter,
  renderStars
}) => {
  const { language } = useLanguage();

  const getFilteredReviews = () => {
    switch(filter) {
      case 'highest':
      case 'all':
        return [...reviews].sort((a, b) => b.rating - a.rating);
      case 'lowest':
        return [...reviews].sort((a, b) => a.rating - b.rating);
      case 'recent':
        return [...reviews].sort((a, b) => b.date.getTime() - a.date.getTime());
      default:
        return [...reviews].sort((a, b) => b.rating - a.rating);
    }
  };

  return (
    <div className="space-y-4">
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
            <option value="highest">{language === 'en' ? 'Highest Rated' : 'أعلى تقييم'}</option>
            <option value="recent">{language === 'en' ? 'Most Recent' : 'الأحدث'}</option>
            <option value="lowest">{language === 'en' ? 'Lowest Rated' : 'أدنى تقييم'}</option>
            <option value="all">{language === 'en' ? 'All Reviews' : 'جميع المراجعات'}</option>
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
            <ReviewCard 
              key={review.id} 
              review={review} 
              renderStars={renderStars} 
            />
          ))
        )}
      </div>
    </div>
  );
};

export default ReviewsList;
