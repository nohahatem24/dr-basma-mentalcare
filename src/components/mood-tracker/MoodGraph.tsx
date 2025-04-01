
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

  // Prepare data for the graph
  const moodGraphData = {
    labels: moodEntries.map((entry) =>
      new Intl.DateTimeFormat(language === 'en' ? 'en-US' : 'ar-EG', {
        month: 'short',
        day: 'numeric',
      }).format(entry.date)
    ),
    datasets: [
      {
        label: language === 'en' ? 'Mood Over Time' : 'المزاج مع مرور الوقت',
        data: moodEntries.map((entry) => entry.mood),
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
    },
  };

  return (
    <div className="bg-accent/10 p-4 rounded-lg">
      <Line data={moodGraphData} options={moodGraphOptions} />
    </div>
  );
};
