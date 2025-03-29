
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Star } from 'lucide-react';
import { useLanguage } from '@/components/Header';

interface ReviewFormProps {
  onSubmit: (name: string, rating: number, comment: string, isAnonymous: boolean) => void;
  onCancel: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ onSubmit, onCancel }) => {
  const { language } = useLanguage();
  const [name, setName] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);

  const handleSubmit = () => {
    onSubmit(name, rating, comment, isAnonymous);
  };

  return (
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
        <Button onClick={handleSubmit}>
          {language === 'en' ? 'Submit Review' : 'إرسال المراجعة'}
        </Button>
        <Button variant="outline" onClick={onCancel}>
          {language === 'en' ? 'Cancel' : 'إلغاء'}
        </Button>
      </div>
    </div>
  );
};

export default ReviewForm;
