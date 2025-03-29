
import React from 'react';
import { Star } from 'lucide-react';

export const renderStars = (count: number) => {
  return Array(5).fill(0).map((_, i) => (
    <Star 
      key={i} 
      className={`h-5 w-5 ${i < count ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
    />
  ));
};
