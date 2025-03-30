
import React from 'react';
import MentalHealthReport from '@/components/MentalHealthReport';
import RelationshipTracker from '@/components/RelationshipTracker';
import MoodTracker from '@/components/MoodTracker';
import CPTTechniques from '@/components/CPTTechniques';
import SelfReportingHeader from '@/components/self-reporting/SelfReportingHeader';
import NeedHelpCard from '@/components/self-reporting/NeedHelpCard';
import GuidedBreathing from '@/components/self-reporting/GuidedBreathing';

const SelfReporting = () => {
  return (
    <div className="container py-8">
      <SelfReportingHeader />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-3">
          <MentalHealthReport />
        </div>

        <div className="md:col-span-3">
          <CPTTechniques />
        </div>

        <div className="md:col-span-2 space-y-8">
          <MoodTracker />
          <RelationshipTracker />
        </div>

        <div className="space-y-8">
          <GuidedBreathing />
          <NeedHelpCard />
        </div>
      </div>
    </div>
  );
};

export default SelfReporting;
