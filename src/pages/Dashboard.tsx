
import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLanguage } from '@/components/Header';
import MentalHealthReport from '@/components/reports/MentalHealthReport';
import RelationshipTracker from '@/components/relationship-tracker/RelationshipTracker';
import CPTTechniques from '@/components/CPTTechniques';
import GuidedBreathing from '@/components/breathing/GuidedBreathing';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import JournalEntries from '@/components/journal/Journal';
import GratitudeJournal from '@/components/gratitude/Gratitude';
import Goals from '@/components/goals/Goals';
import AIInsights from '@/components/dashboard/AIInsights';
import TherapeuticExercises from '@/components/TherapeuticExercises';
import MoodTracker from '@/components/mood-tracker/MoodTracker';

const Dashboard = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { language } = useLanguage();
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'mood';

  // Render the appropriate component based on the active tab
  const renderActiveComponent = () => {
    switch(activeTab) {
      case 'mood':
        return <MoodTracker />;
      case 'journal':
        return <JournalEntries />;
      case 'gratitude':
        return <GratitudeJournal />;
      case 'goals':
        return <Goals />;
      case 'report':
        return <MentalHealthReport />;
      case 'breathing':
        return <GuidedBreathing />;
      case 'cpt':
        return <CPTTechniques />;
      case 'therapeutic':
        return <TherapeuticExercises />;
      case 'relationship':
        return <RelationshipTracker />;
      default:
        return <MoodTracker />;
    }
  };

  return (
    <div className={`container py-8 ${language === 'ar' ? 'arabic text-right' : ''}`}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h1 className="text-3xl font-bold header-gradient mb-4 md:mb-0">
          {language === 'en' ? 'MindTrack Dashboard' : 'لوحة تحكم مايند تراك'}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <DashboardSidebar 
            activePage={activeTab} 
            date={date} 
            setDate={setDate} 
          />
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {renderActiveComponent()}
          
          {/* AI Insights Card */}
          <AIInsights />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
