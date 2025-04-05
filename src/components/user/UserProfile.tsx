import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/components/Header';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Video, Paperclip, Clock3, X, Loader2, RefreshCw } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { format, addDays } from 'date-fns';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface Session {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: '30' | '60'; // Minutes
  type: 'video' | 'in-person';
  status: 'completed' | 'upcoming' | 'cancelled';
  notes?: string;
  fee: number;
}

const UserProfile = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  // State for dialogs
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [rescheduleDialogOpen, setRescheduleDialogOpen] = useState(false);
  const [attachmentDialogOpen, setAttachmentDialogOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [cancellationReason, setCancellationReason] = useState('');
  const [attachment, setAttachment] = useState<File | null>(null);
  const [attachmentNote, setAttachmentNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // State for sessions
  const [sessions, setSessions] = useState<Session[]>([]);
  
  // Process new booking from location state
  useEffect(() => {
    if (location.state?.newBooking) {
      const booking = location.state.newBooking;
      
      // Create a new session from the booking
      const newSession: Session = {
        id: `session-${Date.now()}`, // Generate a unique ID
        date: format(new Date(booking.date), 'yyyy-MM-dd'),
        startTime: booking.startTime,
        endTime: booking.endTime,
        duration: booking.duration,
        type: booking.appointmentType === 'video' ? 'video' : 'in-person',
        status: 'upcoming',
        fee: booking.fee
      };
      
      // Add the new session to the list
      setSessions(prevSessions => [...prevSessions, newSession]);
      
      // Clear the location state
      window.history.replaceState({}, document.title);
      
      // Show confirmation
      toast({
        title: language === 'en' ? "Booking Confirmed" : "تم تأكيد الحجز",
        description: language === 'en' 
          ? "Your new session has been added to your schedule" 
          : "تمت إضافة الجلسة الجديدة إلى جدولك",
        variant: "default",
      });
    }
  }, [location.state, language, toast]);
  
  // Check if session was just rescheduled
  useEffect(() => {
    if (location.state?.rescheduled) {
      const { originalSessionId, newBooking } = location.state;
      
      setSessions(prevSessions => {
        // Remove the original session
        const updatedSessions = prevSessions.filter(s => s.id !== originalSessionId);
        
        // Add the new session
        const newSession: Session = {
          id: `session-${Date.now()}`, // Generate a unique ID
          date: format(new Date(newBooking.date), 'yyyy-MM-dd'),
          startTime: newBooking.startTime,
          endTime: newBooking.endTime,
          duration: newBooking.duration,
          type: newBooking.appointmentType === 'video' ? 'video' : 'in-person',
          status: 'upcoming',
          fee: newBooking.fee
        };
        
        return [...updatedSessions, newSession];
      });
      
      // Clear the location state
      window.history.replaceState({}, document.title);
      
      // Show confirmation
      toast({
        title: language === 'en' ? "Session Rescheduled" : "تمت إعادة جدولة الجلسة",
        description: language === 'en' 
          ? "Your session has been rescheduled successfully" 
          : "تمت إعادة جدولة جلستك بنجاح",
        variant: "default",
      });
    }
  }, [location.state, language, toast]);
  
  // Load sessions from localStorage on mount
  useEffect(() => {
    const storedSessions = localStorage.getItem('userSessions');
    if (storedSessions) {
      setSessions(JSON.parse(storedSessions));
    } else {
      // If no sessions in localStorage, use some demo data
      const demoSessions: Session[] = [
        { 
          id: '1', 
          date: format(addDays(new Date(), 7), 'yyyy-MM-dd'),
          startTime: '11:00 AM',
          endTime: '11:30 AM',
          duration: '30',
          type: 'video', 
          status: 'upcoming',
          fee: 260
        },
        { 
          id: '2', 
          date: format(addDays(new Date(), 3), 'yyyy-MM-dd'),
          startTime: '2:00 PM',
          endTime: '3:00 PM',
          duration: '60', 
          type: 'video', 
          status: 'upcoming',
          fee: 430
        },
        { 
          id: '3', 
          date: '2023-10-15', 
          startTime: '10:00 AM',
          endTime: '10:30 AM',
          duration: '30',
          type: 'video', 
          status: 'completed',
          notes: 'Initial consultation',
          fee: 260
        },
      ];
      setSessions(demoSessions);
    }
  }, []);
  
  // Save sessions to localStorage whenever they change
  useEffect(() => {
    if (sessions.length > 0) {
      localStorage.setItem('userSessions', JSON.stringify(sessions));
    }
  }, [sessions]);
  
  const upcomingSessions = sessions.filter(session => session.status === 'upcoming');
  const previousSessions = sessions.filter(session => session.status === 'completed');
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(
      language === 'en' ? 'en-US' : 'ar-EG', 
      { year: 'numeric', month: 'long', day: 'numeric' }
    );
  };

  const handleCancelSession = (session: Session) => {
    setSelectedSession(session);
    setCancelDialogOpen(true);
  };

  const handleRescheduleSession = (session: Session) => {
    setSelectedSession(session);
    setRescheduleDialogOpen(true);
  };

  const handleAttachment = (session: Session) => {
    setSelectedSession(session);
    setAttachmentDialogOpen(true);
  };

  const submitCancellation = () => {
    if (!selectedSession) return;
    
    setIsSubmitting(true);
    
    // Update the session status to cancelled
    setSessions(prevSessions => {
      return prevSessions.map(session => {
        if (session.id === selectedSession.id) {
          return {
            ...session,
            status: 'cancelled',
            notes: cancellationReason
          };
        }
        return session;
      });
    });
    
    setTimeout(() => {
      setIsSubmitting(false);
      setCancelDialogOpen(false);
      setCancellationReason('');
      
      toast({
        title: language === 'en' ? "Session Cancelled" : "تم إلغاء الجلسة",
        description: language === 'en' 
          ? "Your session has been cancelled successfully" 
          : "تم إلغاء جلستك بنجاح",
        variant: "default",
      });
    }, 1500);
  };

  const submitReschedule = () => {
    if (!selectedSession) return;
    
    setIsSubmitting(true);
    
    setTimeout(() => {
      setIsSubmitting(false);
      setRescheduleDialogOpen(false);
      navigate('/book-appointment', { 
        state: { 
          rescheduling: true, 
          sessionId: selectedSession.id,
          originalSession: selectedSession
        } 
      });
    }, 1000);
  };

  const submitAttachment = () => {
    if (!selectedSession) return;
    
    // Check if either a file or a note is provided
    if (!attachment && !attachmentNote.trim()) {
      toast({
        title: language === 'en' ? "Missing Information" : "معلومات ناقصة",
        description: language === 'en' 
          ? "Please provide either a file or a note" 
          : "يرجى تقديم ملف أو ملاحظة",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    setTimeout(() => {
      setIsSubmitting(false);
      setAttachmentDialogOpen(false);
      setAttachment(null);
      setAttachmentNote('');
      
      toast({
        title: language === 'en' ? "Message Sent" : "تم إرسال الرسالة",
        description: language === 'en' 
          ? attachment 
            ? "Your attachment and note have been sent to Dr. Bassma" 
            : "Your message has been sent to Dr. Bassma"
          : attachment 
            ? "تم إرسال المرفق والملاحظة إلى د. بسمة" 
            : "تم إرسال رسالتك إلى د. بسمة",
        variant: "default",
      });
    }, 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAttachment(e.target.files[0]);
    }
  };

  const clearAllSessions = () => {
    setSessions([]);
    localStorage.removeItem('userSessions');
    toast({
      title: language === 'en' ? "Sessions Cleared" : "تم مسح الجلسات",
      description: language === 'en' 
        ? "All sessions have been cleared" 
        : "تم مسح جميع الجلسات",
      variant: "default",
    });
  };
  
  return (
    <div className="space-y-8">
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">
            {language === 'en' ? 'Upcoming Sessions' : 'الجلسات القادمة'}
          </h2>
          <Button variant="ghost" size="sm" onClick={clearAllSessions}>
            {language === 'en' ? 'Clear All (Demo)' : 'مسح الكل (تجريبي)'}
          </Button>
        </div>
        
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
                <div className="absolute top-0 right-0 w-2 h-full bg-green-500"></div>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center justify-between">
                    <span>{language === 'en' ? 'Session with Dr. Bassma' : 'جلسة مع د. بسمة'}</span>
                    <span className="text-sm font-normal bg-primary/10 text-primary py-1 px-2 rounded-full">
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
                        <span>{session.startTime} - {session.endTime}</span>
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
                    
                    <div className="flex gap-2">
                      {session.type === 'video' && (
                        <Button asChild className="flex-1">
                          <Link to="/video-session">
                            {language === 'en' ? 'Join Session' : 'انضم للجلسة'}
                          </Link>
                        </Button>
                      )}
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => handleRescheduleSession(session)}
                      >
                        {language === 'en' ? 'Reschedule' : 'إعادة جدولة'}
                      </Button>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        className="flex-1 text-destructive hover:text-destructive"
                        onClick={() => handleCancelSession(session)}
                      >
                        <X className="mr-1 h-4 w-4" />
                        {language === 'en' ? 'Cancel' : 'إلغاء'}
                      </Button>
                      <Button 
                        variant="ghost" 
                        className="flex-1"
                        onClick={() => handleAttachment(session)}
                      >
                        <Paperclip className="mr-1 h-4 w-4" />
                        {language === 'en' ? 'Send Message' : 'إرسال رسالة'}
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
                <div className="absolute top-0 right-0 w-2 h-full bg-gray-400"></div>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center justify-between">
                    <span>{language === 'en' ? 'Session with Dr. Bassma' : 'جلسة مع د. بسمة'}</span>
                    <span className="text-sm font-normal bg-muted text-muted-foreground py-1 px-2 rounded-full">
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
                        <span>{session.startTime} - {session.endTime}</span>
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
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Cancel Session Dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {language === 'en' ? 'Cancel Session' : 'إلغاء الجلسة'}
            </DialogTitle>
            <DialogDescription>
              {language === 'en' 
                ? 'Are you sure you want to cancel this session? Please provide a reason.' 
                : 'هل أنت متأكد أنك تريد إلغاء هذه الجلسة؟ يرجى ذكر السبب.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">
                {language === 'en' ? 'Session Details:' : 'تفاصيل الجلسة:'}
              </h4>
              <p className="text-sm">
                {selectedSession && formatDate(selectedSession.date)}
                <br />
                {selectedSession && `${selectedSession.startTime} - ${selectedSession.endTime}`}
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium">
                {language === 'en' ? 'Reason for Cancellation:' : 'سبب الإلغاء:'}
              </h4>
              <Textarea
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                placeholder={language === 'en' 
                  ? 'Please provide a reason for cancellation' 
                  : 'يرجى ذكر سبب الإلغاء'}
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCancelDialogOpen(false)}
              disabled={isSubmitting}
            >
              {language === 'en' ? 'Back' : 'رجوع'}
            </Button>
            <Button
              variant="destructive"
              onClick={submitCancellation}
              disabled={isSubmitting || !cancellationReason.trim()}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {language === 'en' ? 'Processing...' : 'جارٍ المعالجة...'}
                </>
              ) : (
                language === 'en' ? 'Cancel Session' : 'إلغاء الجلسة'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reschedule Session Dialog */}
      <Dialog open={rescheduleDialogOpen} onOpenChange={setRescheduleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {language === 'en' ? 'Reschedule Session' : 'إعادة جدولة الجلسة'}
            </DialogTitle>
            <DialogDescription>
              {language === 'en' 
                ? 'You will be redirected to the booking page to select a new date and time.' 
                : 'سيتم توجيهك إلى صفحة الحجز لاختيار تاريخ ووقت جديدين.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">
                {language === 'en' ? 'Current Session:' : 'الجلسة الحالية:'}
              </h4>
              <p className="text-sm">
                {selectedSession && formatDate(selectedSession.date)}
                <br />
                {selectedSession && `${selectedSession.startTime} - ${selectedSession.endTime}`}
                <br />
                {selectedSession && `${selectedSession.duration} ${language === 'en' ? 'Minutes' : 'دقيقة'}`}
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRescheduleDialogOpen(false)}
              disabled={isSubmitting}
            >
              {language === 'en' ? 'Cancel' : 'إلغاء'}
            </Button>
            <Button
              onClick={submitReschedule}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {language === 'en' ? 'Processing...' : 'جارٍ المعالجة...'}
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  {language === 'en' ? 'Reschedule' : 'إعادة جدولة'}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Send Attachment Dialog */}
      <Dialog open={attachmentDialogOpen} onOpenChange={setAttachmentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {language === 'en' ? 'Send Message to Dr. Bassma' : 'إرسال رسالة إلى د. بسمة'}
            </DialogTitle>
            <DialogDescription>
              {language === 'en' 
                ? 'Share files or leave a message related to your session.' 
                : 'شارك ملفات أو اترك رسالة متعلقة بجلستك.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">
                {language === 'en' ? 'Session Details:' : 'تفاصيل الجلسة:'}
              </h4>
              <p className="text-sm">
                {selectedSession && formatDate(selectedSession.date)}
                <br />
                {selectedSession && `${selectedSession.startTime} - ${selectedSession.endTime}`}
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium">
                {language === 'en' ? 'Upload File (Optional):' : 'تحميل ملف (اختياري):'}
              </h4>
              <div className="border rounded-md p-4">
                <input
                  type="file"
                  className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                  onChange={handleFileChange}
                />
                {attachment && (
                  <div className="mt-2 text-sm text-muted-foreground">
                    {language === 'en' ? 'Selected file:' : 'الملف المحدد:'} {attachment.name}
                  </div>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium">
                {language === 'en' ? 'Message:' : 'الرسالة:'}
              </h4>
              <Textarea
                value={attachmentNote}
                onChange={(e) => setAttachmentNote(e.target.value)}
                placeholder={language === 'en' 
                  ? 'Write a message to Dr. Bassma' 
                  : 'اكتب رسالة إلى د. بسمة'}
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setAttachmentDialogOpen(false)}
              disabled={isSubmitting}
            >
              {language === 'en' ? 'Cancel' : 'إلغاء'}
            </Button>
            <Button
              onClick={submitAttachment}
              disabled={isSubmitting || (!attachment && !attachmentNote.trim())}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {language === 'en' ? 'Sending...' : 'جارٍ الإرسال...'}
                </>
              ) : (
                <>
                  <Paperclip className="mr-2 h-4 w-4" />
                  {language === 'en' ? 'Send Message' : 'إرسال الرسالة'}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserProfile;
