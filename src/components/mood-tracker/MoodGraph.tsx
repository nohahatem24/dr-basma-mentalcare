
import React from 'react';
import { Line } from 'react-chartjs-2';
import { useLanguage } from '@/components/Header';

interface MoodGraphProps {
  moodEntries: {
    date: Date;
    mood: number;
  }[];
}

export const MoodGraph: React.FC<MoodGraphProps> = ({ moodEntries }) => {
  const { language } = useLanguage();

  // Return empty state if no entries
  if (!moodEntries || moodEntries.length === 0) {
    return (
      <div className="bg-accent/10 p-4 rounded-lg flex items-center justify-center h-48">
        <p className="text-muted-foreground">
          {language === 'en' 
            ? 'No mood data to display yet. Add your first mood entry!' 
            : 'لا توجد بيانات مزاجية للعرض بعد. أضف أول إدخال للمزاج!'}
        </p>
      </div>
    );
  }

  // Sort entries by date (oldest to newest)
  const sortedEntries = [...moodEntries].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Prepare data for the graph
  const moodGraphData = {
    labels: sortedEntries.map((entry) =>
      new Intl.DateTimeFormat(language === 'en' ? 'en-US' : 'ar-EG', {
        month: 'short',
        day: 'numeric',
      }).format(new Date(entry.date))
    ),
    datasets: [
      {
        label: language === 'en' ? 'Mood Over Time' : 'المزاج مع مرور الوقت',
        data: sortedEntries.map((entry) => entry.mood),
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,0.2)',
        fill: true,
      },
    ],
  };

  const moodGraphOptions = {
    scales: {
      y: {
        min: -10,
        max: 10,
        title: {
          display: true,
          text: language === 'en' ? 'Mood Scale (-10 to 10)' : 'مقياس المزاج (-١٠ إلى ١٠)',
        },
      },
      x: {
        ticks: {
          autoSkip: true,
          maxRotation: language === 'ar' ? 45 : 0, // Rotate Arabic labels for better visibility
          // Fix: Use literal "center" or "start" instead of string variable to match Chart.js types
          align: language === 'ar' ? 'start' as const : 'center' as const,
        }
      }
    },
    plugins: {
      tooltip: {
        rtl: language === 'ar', // Right to left for Arabic
        textDirection: language === 'ar' ? 'rtl' : 'ltr',
      },
      legend: {
        rtl: language === 'ar', // Right to left for Arabic
        textDirection: language === 'ar' ? 'rtl' : 'ltr',
      },
    },
  };

  return (
    <div className="bg-accent/10 p-4 rounded-lg" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <Line data={moodGraphData} options={moodGraphOptions} />
    </div>
  );
};

export default MoodGraph;
