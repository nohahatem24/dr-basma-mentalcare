
export const getMoodLabel = (moodValue: number, language: 'en' | 'ar') => {
  if (moodValue >= 8) return language === 'en' ? 'Excellent' : 'ممتاز';
  if (moodValue >= 5) return language === 'en' ? 'Very Good' : 'جيد جدا';
  if (moodValue >= 2) return language === 'en' ? 'Good' : 'جيد';
  if (moodValue >= 0) return language === 'en' ? 'Neutral' : 'محايد';
  if (moodValue >= -2) return language === 'en' ? 'Low' : 'منخفض';
  if (moodValue >= -5) return language === 'en' ? 'Poor' : 'سيء';
  if (moodValue >= -8) return language === 'en' ? 'Very Poor' : 'سيء جدا';
  return language === 'en' ? 'Terrible' : 'سيء للغاية';
};

export const getMoodColor = (moodValue: number) => {
  if (moodValue >= 5) return 'bg-green-100 text-green-800';
  if (moodValue >= 0) return 'bg-blue-100 text-blue-800';
  if (moodValue >= -5) return 'bg-amber-100 text-amber-800';
  return 'bg-red-100 text-red-800';
};

export const formatDate = (date: Date, language: 'en' | 'ar') => {
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };

  return new Intl.DateTimeFormat(language === 'en' ? 'en-US' : 'ar-EG', options).format(date);
};
