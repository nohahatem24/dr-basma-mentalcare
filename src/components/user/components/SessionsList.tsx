
import React from 'react';
import { Link } from 'react-router-dom';
import { Session } from '@/types/mindtrack';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import SessionCard from './SessionCard';

interface SessionsListProps {
  sessions: Session[];
  isLoading: boolean;
  language: string;
  formatDate: (date: string) => string;
  isUpcoming: boolean;
  onReschedule?: (session: Session) => void;
  onCancel?: (session: Session) => void;
  onAttachment?: (session: Session) => void;
}

const SessionsList = ({
  sessions,
  isLoading,
  language,
  formatDate,
  isUpcoming,
  onReschedule,
  onCancel,
  onAttachment
}: SessionsListProps) => {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-6">
          <div className="flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (sessions.length === 0) {
    return (
      <Card>
        <CardContent className="py-6">
          <p className="text-center text-muted-foreground">
            {language === 'en' 
              ? isUpcoming ? 'You have no upcoming sessions' : 'You have no previous sessions'
              : isUpcoming ? 'ليس لديك جلسات قادمة' : 'ليس لديك جلسات سابقة'}
          </p>
          {isUpcoming && (
            <div className="flex justify-center mt-4">
              <Button asChild>
                <Link to="/book-appointment">
                  {language === 'en' ? 'Book a Session' : 'حجز جلسة'}
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {sessions.map(session => (
        <SessionCard
          key={session.id}
          session={session}
          language={language}
          formatDate={formatDate}
          isUpcoming={isUpcoming}
          onReschedule={isUpcoming ? onReschedule : undefined}
          onCancel={isUpcoming ? onCancel : undefined}
          onAttachment={isUpcoming ? onAttachment : undefined}
        />
      ))}
    </div>
  );
};

export default SessionsList;
