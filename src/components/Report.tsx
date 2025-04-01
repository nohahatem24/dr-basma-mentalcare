
import React from 'react';
import { Line } from 'react-chartjs-2';
import { Button } from '@/components/ui/button';
import { useMoodChartData } from '@/components/dashboard/MoodChartUtils';

interface ReportProps {
  moodEntries: {
    date: Date;
    mood: number;
  }[];
  relationshipData: {
    label: string;
    value: number;
  }[];
  language: 'en' | 'ar';
}

const Report: React.FC<ReportProps> = ({ moodEntries, relationshipData, language }) => {
  // Prepare mood graph data for the Chart.js visualization
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
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">
        {language === 'en' ? 'Mental Health Report' : 'تقرير الصحة النفسية'}
      </h1>

      {/* Mood Graph Section */}
      <section>
        <h2 className="text-xl font-semibold mb-4">
          {language === 'en' ? 'Mood Graph' : 'رسم بياني للمزاج'}
        </h2>
        <div className="space-y-8">
          <Line data={moodGraphData} options={moodGraphOptions} />
        </div>
      </section>

      {/* Relationship Tracker Section */}
      <section>
        <h2 className="text-xl font-semibold mb-4">
          {language === 'en' ? 'Relationship Tracker' : 'متتبع العلاقات'}
        </h2>
        <ul className="space-y-2">
          {relationshipData.map((item, index) => (
            <li key={index} className="flex justify-between">
              <span>{item.label}</span>
              <span>{item.value}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Print Button */}
      <Button onClick={() => window.print()} className="mt-4">
        {language === 'en' ? 'Print Report' : 'طباعة التقرير'}
      </Button>
    </div>
  );
};

export default Report;
