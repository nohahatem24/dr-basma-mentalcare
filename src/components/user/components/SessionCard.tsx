
import React from 'react';
import { Link } from 'react-router-dom';
import { Session } from '@/types/mindtrack';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, Clock3, Video, X, Paperclip } from 'lucide-react';

interface SessionCardProps {
  session: Session;
  language: string;
  formatDate: (date: string) => string;
  isUpcoming: boolean;
  onReschedule?: (session: Session) => void;
  onCancel?: (session: Session) => void;
  onAttachment?: (session: Session) => void;
}

const SessionCard = ({ 
  session, 
  language, 
  formatDate, 
  isUpcoming,
  onReschedule,
  onCancel,
  onAttachment
}: SessionCardProps) => {
  return (
    <Card className="relative overflow-hidden">
      <div className={`absolute top-0 right-0 w-2 h-full ${isUpcoming ? 'bg-green-500' : 'bg-gray-400'}`}></div>
      <CardHeader>
        <CardTitle className="text-lg flex items-center justify-between">
          <span>{language === 'en' ? 'Session with Dr. Basma' : 'جلسة مع د. بسمة'}</span>
          <span className={`text-sm font-normal ${isUpcoming ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'} py-1 px-2 rounded-full`}>
            {session.fee} {language === 'en' ? 'EGP' : 'جنيه'}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center">
              <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>{formatDate(session.date)}</span>
            </div>
            <div className="flex items-center">
              <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>{session.start_time} - {session.end_time}</span>
            </div>
            <div className="flex items-center">
              <Clock3 className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>
                {session.duration} {language === 'en' ? 'Minutes' : 'دقيقة'}
              </span>
            </div>
            <div className="flex items-center">
              <Video className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>
                {session.type === 'video' 
                  ? (language === 'en' ? 'Video Session' : 'جلسة فيديو')
                  : (language === 'en' ? 'In-person Session' : 'جلسة شخصية')}
              </span>
            </div>
          </div>
          
          {isUpcoming && (
            <>
              <div className="flex gap-2">
                {session.type === 'video' && (
                  <Button asChild className="flex-1">
                    <Link to="/video-session">
                      {language === 'en' ? 'Join Session' : 'انضم للجلسة'}
                    </Link>
                  </Button>
                )}
                {onReschedule && (
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => onReschedule(session)}
                  >
                    {language === 'en' ? 'Reschedule' : 'إعادة جدولة'}
                  </Button>
                )}
              </div>
              
              <div className="flex gap-2">
                {onCancel && (
                  <Button 
                    variant="ghost" 
                    className="flex-1 text-destructive hover:text-destructive"
                    onClick={() => onCancel(session)}
                  >
                    <X className="mr-1 h-4 w-4" />
                    {language === 'en' ? 'Cancel' : 'إلغاء'}
                  </Button>
                )}
                {onAttachment && (
                  <Button 
                    variant="ghost" 
                    className="flex-1"
                    onClick={() => onAttachment(session)}
                  >
                    <Paperclip className="mr-1 h-4 w-4" />
                    {language === 'en' ? 'Send Message' : 'إرسال رسالة'}
                  </Button>
                )}
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SessionCard;
