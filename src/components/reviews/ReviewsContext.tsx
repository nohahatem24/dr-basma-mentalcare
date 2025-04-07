import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Review } from './types';
import { useLanguage } from '@/components/Header';

interface ReviewsContextType {
  reviews: Review[];
  addReview: (name: string, rating: number, comment: string, isAnonymous: boolean) => void;
}

const ReviewsContext = createContext<ReviewsContextType | undefined>(undefined);

export const useReviews = () => {
  const context = useContext(ReviewsContext);
  if (context === undefined) {
    throw new Error('useReviews must be used within a ReviewsProvider');
  }
  return context;
};

export const ReviewsProvider = ({ children }: { children: ReactNode }) => {
  const [reviews, setReviews] = useState<Review[]>([]);

  const addReview = (name: string, rating: number, comment: string, isAnonymous: boolean) => {
    const newReview: Review = {
      id: Date.now().toString(),
      author: isAnonymous ? 'Anonymous' : name || 'User',
      rating,
      comment,
      date: new Date(),
      isAnonymous,
      isRecommended: rating > 3,
    };
    
    // Add new review and sort by rating in descending order
    setReviews(prevReviews => {
      const updatedReviews = [...prevReviews, newReview];
      return updatedReviews.sort((a, b) => b.rating - a.rating);
    });
  };

  return (
    <ReviewsContext.Provider value={{ 
      reviews: reviews.sort((a, b) => b.rating - a.rating), 
      addReview 
    }}>
      {children}
    </ReviewsContext.Provider>
  );
};
