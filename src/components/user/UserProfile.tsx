
import React from 'react';
import { useLanguage } from '@/components/Header';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Video } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Session {
  id: string;
  date: string;
  time: string;
  type: 'video' | 'in-person';
  status: 'completed' | 'upcoming' | 'cancelled';
  notes?: string;
}

const UserProfile = () => {
  const { language } = useLanguage();
  
  // Mock sessions data - in a real app, this would come from Supabase
  const sessions: Session[] = [
    { 
      id: '1', 
      date: '2023-10-15', 
      time: '10:00 AM', 
      type: 'video', 
      status: 'completed',
      notes: 'Initial consultation' 
    },
    { 
      id: '2', 
      date: '2023-11-05', 
      time: '2:30 PM', 
      type: 'in-person', 
      status: 'completed' 
    },
    { 
      id: '3', 
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], 
      time: '11:00 AM', 
      type: 'video', 
      status: 'upcoming' 
    },
  ];
  
  const upcomingSessions = sessions.filter(session => session.status === 'upcoming');
  const previousSessions = sessions.filter(session => session.status === 'completed');
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(
      language === 'en' ? 'en-US' : 'ar-EG', 
      { year: 'numeric', month: 'long', day: 'numeric' }
    );
  };
  
  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-2xl font-bold mb-4">
          {language === 'en' ? 'Upcoming Sessions' : 'الجلسات القادمة'}
        </h2>
        
        {upcomingSessions.length === 0 ? (
          <Card>
            <CardContent className="py-6">
              <p className="text-center text-muted-foreground">
                {language === 'en' 
                  ? 'You have no upcoming sessions' 
                  : 'ليس لديك جلسات قادمة'}
              </p>
              <div className="flex justify-center mt-4">
                <Button asChild>
                  <Link to="/book-appointment">
                    {language === 'en' ? 'Book a Session' : 'حجز جلسة'}
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {upcomingSessions.map(session => (
              <Card key={session.id} className="relative overflow-hidden">
                <div className={`absolute top-0 right-0 w-2 h-full bg-green-500`}></div>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center justify-between">
                    <span>{language === 'en' ? 'Session with Dr. Bassma' : 'جلسة مع د. بسمة'}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>{formatDate(session.date)}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>{session.time}</span>
                    </div>
                    <div className="flex items-center">
                      <Video className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>
                        {session.type === 'video' 
                          ? (language === 'en' ? 'Video Session' : 'جلسة فيديو')
                          : (language === 'en' ? 'In-person Session' : 'جلسة شخصية')}
                      </span>
                    </div>
                    
                    <div className="pt-4 flex gap-2">
                      {session.type === 'video' && (
                        <Button asChild>
                          <Link to="/video-session">
                            {language === 'en' ? 'Join Session' : 'انضم للجلسة'}
                          </Link>
                        </Button>
                      )}
                      <Button variant="outline">
                        {language === 'en' ? 'Reschedule' : 'إعادة جدولة'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
      
      <section>
        <h2 className="text-2xl font-bold mb-4">
          {language === 'en' ? 'Previous Sessions' : 'الجلسات السابقة'}
        </h2>
        
        {previousSessions.length === 0 ? (
          <Card>
            <CardContent className="py-6">
              <p className="text-center text-muted-foreground">
                {language === 'en' 
                  ? 'You have no previous sessions' 
                  : 'ليس لديك جلسات سابقة'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {previousSessions.map(session => (
              <Card key={session.id} className="relative overflow-hidden">
                <div className={`absolute top-0 right-0 w-2 h-full bg-gray-400`}></div>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center justify-between">
                    <span>{language === 'en' ? 'Session with Dr. Bassma' : 'جلسة مع د. بسمة'}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>{formatDate(session.date)}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>{session.time}</span>
                    </div>
                    {session.notes && (
                      <div className="pt-2">
                        <h4 className="text-sm font-medium">
                          {language === 'en' ? 'Notes:' : 'ملاحظات:'}
                        </h4>
                        <p className="text-sm text-muted-foreground">{session.notes}</p>
                      </div>
                    )}
                    
                    <div className="pt-4">
                      <Button variant="outline" size="sm">
                        {language === 'en' ? 'View Session Notes' : 'عرض ملاحظات الجلسة'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default UserProfile;
