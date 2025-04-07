import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface DoctorRatingContextType {
  averageRating: number;
  totalReviews: number;
  updateRating: (newRating: number) => void;
  addReview: (rating: number) => void;
}

const DoctorRatingContext = createContext<DoctorRatingContextType | undefined>(undefined);

export const useDoctorRating = () => {
  const context = useContext(DoctorRatingContext);
  if (context === undefined) {
    throw new Error('useDoctorRating must be used within a DoctorRatingProvider');
  }
  return context;
};

interface DoctorRatingProviderProps {
  children: ReactNode;
}

export const DoctorRatingProvider = ({ children }: DoctorRatingProviderProps) => {
  const [ratings, setRatings] = useState<number[]>([]);
  const [averageRating, setAverageRating] = useState(5);
  const [totalReviews, setTotalReviews] = useState(0);

  useEffect(() => {
    setTotalReviews(ratings.length);
    if (ratings.length === 0) {
      setAverageRating(5);
      return;
    }
    calculateAverageRating();
  }, [ratings]);

  const calculateAverageRating = () => {
    if (ratings.length === 0) return;
    const sum = ratings.reduce((acc, curr) => acc + curr, 0);
    const average = sum / ratings.length;
    setAverageRating(Number(average.toFixed(1)));
  };

  const updateRating = (newRating: number) => {
    setRatings(prev => [...prev, newRating]);
  };

  const addReview = (rating: number) => {
    setRatings(prev => [...prev, rating]);
  };

  return (
    <DoctorRatingContext.Provider 
      value={{ 
        averageRating, 
        totalReviews, 
        updateRating,
        addReview 
      }}
    >
      {children}
    </DoctorRatingContext.Provider>
  );
}; 