
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
  const { language } = useLanguage();
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
    
    setReviews([newReview, ...reviews]);
  };

  return (
    <ReviewsContext.Provider value={{ reviews, addReview }}>
      {children}
    </ReviewsContext.Provider>
  );
};
