
import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLanguage } from '@/components/Header';
import MentalHealthReport from '@/components/MentalHealthReport';
import RelationshipTracker from '@/components/RelationshipTracker';
import MoodTracker from '@/components/MoodTracker';
import CPTTechniques from '@/components/CPTTechniques';
import GuidedBreathing from '@/components/self-reporting/GuidedBreathing';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import JournalEntries from '@/components/dashboard/JournalEntries';
import GratitudeJournal from '@/components/dashboard/GratitudeJournal';
import GoalsTracker from '@/components/dashboard/GoalsTracker';
import MoodChart from '@/components/dashboard/MoodChart';
import AIInsights from '@/components/dashboard/AIInsights';

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
        return <GoalsTracker />;
      case 'report':
        return <MentalHealthReport />;
      case 'breathing':
        return <GuidedBreathing />;
      case 'cpt':
        return <CPTTechniques />;
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
          
          {/* Only show mood trends if on mood tab */}
          {activeTab === 'mood' && <MoodChart />}
          
          {/* AI Insights Card */}
          <AIInsights />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
