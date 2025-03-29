
import React from 'react';
import { Star, StarHalf } from 'lucide-react';
import { Review } from './types';

export const renderStars = (count: number) => {
  const stars = [];
  const fullStars = Math.floor(count);
  const hasHalfStar = count - fullStars >= 0.5;
  
  // Add full stars
  for (let i = 0; i < fullStars; i++) {
    stars.push(
      <Star 
        key={`full-${i}`} 
        className="h-5 w-5 text-yellow-400 fill-yellow-400" 
      />
    );
  }
  
  // Add half star if needed
  if (hasHalfStar) {
    stars.push(
      <StarHalf 
        key="half" 
        className="h-5 w-5 text-yellow-400 fill-yellow-400" 
      />
    );
  }
  
  // Add empty stars
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  for (let i = 0; i < emptyStars; i++) {
    stars.push(
      <Star 
        key={`empty-${i}`} 
        className="h-5 w-5 text-gray-300" 
      />
    );
  }
  
  return stars;
};

export const calculateAverageRating = (reviews: Review[]): number => {
  if (reviews.length === 0) return 0;
  const sum = reviews.reduce((total, review) => total + review.rating, 0);
  return parseFloat((sum / reviews.length).toFixed(1));
};

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
};
