
import React from 'react';
import { useLanguage } from '@/components/Header';
import { Card, CardContent } from '@/components/ui/card';
import MindTrackNavigation from '@/components/MindTrackNavigation';
import NeedHelpCard from '@/components/self-reporting/NeedHelpCard';
import { Calendar } from '@/components/ui/calendar';

interface DashboardSidebarProps {
  activePage: string;
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
}

const DashboardSidebar = ({ activePage, date, setDate }: DashboardSidebarProps) => {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-4">
          <div>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
            />
          </div>
          <MindTrackNavigation activePage={activePage} />
          <NeedHelpCard />
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardSidebar;
