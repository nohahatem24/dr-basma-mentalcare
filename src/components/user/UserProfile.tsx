import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/components/Header';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Video, Paperclip, Clock3, X, Loader2, RefreshCw, LogOut, Settings } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { format, addDays } from 'date-fns';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from '@/integrations/supabase/client';

interface Session {
  id: string;
  user_id: string;
  date: string;
  start_time: string;
  end_time: string;
  duration: '30' | '60';
  type: 'video' | 'in-person';
  status: 'completed' | 'upcoming' | 'cancelled';
  notes?: string;
  fee: number;
  created_at?: string;
}

interface UserData {
  email: string;
  phone: string;
  username: string;
  birthday: string;
  gender: string;
  country: string;
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
  const [isLoading, setIsLoading] = useState(true);
  
  // State for sessions
  const [sessions, setSessions] = useState<Session[]>([]);
  
  // State for user data
  const [userData, setUserData] = useState<UserData>({
    email: 'nohahatem234@gmail.com',
    phone: '201554199143',
    username: 'Noha Hatem',
    birthday: '24/04/2002',
    gender: 'Female',
    country: 'Egypt'
  });
  
  // Add new state for active tab
  const [activeTab, setActiveTab] = useState('upcoming');
  
  // Fetch user sessions from Supabase
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from('sessions')
          .select('*')
          .eq('user_id', user.id)
          .order('date', { ascending: true });

        if (error) throw error;
        setSessions(data || []);
      } catch (error) {
        console.error('Error fetching sessions:', error);
        toast({
          title: language === 'en' ? 'Error' : 'خطأ',
          description: language === 'en' 
            ? 'Failed to load your sessions' 
            : 'فشل في تحميل جلساتك',
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSessions();
  }, [language, toast]);

  // Process new booking
  useEffect(() => {
    const handleNewBooking = async () => {
      if (!location.state?.newBooking) return;

      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const booking = location.state.newBooking;
        const newSession: Omit<Session, 'id'> = {
          user_id: user.id,
          date: format(new Date(booking.date), 'yyyy-MM-dd'),
          start_time: booking.startTime,
          end_time: booking.endTime,
          duration: booking.duration,
          type: booking.appointmentType === 'video' ? 'video' : 'in-person',
          status: 'upcoming',
          fee: booking.fee
        };

        const { error } = await supabase
          .from('sessions')
          .insert([newSession]);

        if (error) throw error;

        // Refresh sessions
        const { data, error: fetchError } = await supabase
          .from('sessions')
          .select('*')
          .eq('user_id', user.id)
          .order('date', { ascending: true });

        if (fetchError) throw fetchError;
        setSessions(data || []);

        // Clear location state and navigate to profile
        window.history.replaceState({}, document.title);
        navigate('/profile', { 
          state: { 
            activeTab: 'upcoming',
            newBooking: true 
          }
        });

        toast({
          title: language === 'en' ? "Booking Confirmed" : "تم تأكيد الحجز",
          description: language === 'en' 
            ? "Your new session has been added to your schedule" 
            : "تمت إضافة الجلسة الجديدة إلى جدولك",
          variant: "default",
        });
      } catch (error) {
        console.error('Error processing new booking:', error);
        toast({
          title: language === 'en' ? 'Error' : 'خطأ',
          description: language === 'en' 
            ? 'Failed to process your booking' 
            : 'فشل في معالجة حجزك',
          variant: "destructive",
        });
      }
    };

    handleNewBooking();
  }, [location.state, language, toast, navigate]);
  
  const upcomingSessions = sessions.filter(session => session.status === 'upcoming');
  const previousSessions = sessions.filter(session => session.status === 'completed');
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(
      language === 'en' ? 'en-US' : 'ar-EG', 
      { year: 'numeric', month: 'long', day: 'numeric' }
    );
  };

  const handleCancelSession = async (session: Session) => {
    if (!cancellationReason.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('sessions')
        .update({ 
          status: 'cancelled',
          notes: cancellationReason 
        })
        .eq('id', session.id);

      if (error) throw error;

      setSessions(prevSessions => 
        prevSessions.map(s => 
          s.id === session.id 
            ? { ...s, status: 'cancelled', notes: cancellationReason }
            : s
        )
      );

      setCancelDialogOpen(false);
      setCancellationReason('');
      
      toast({
        title: language === 'en' ? "Session Cancelled" : "تم إلغاء الجلسة",
        description: language === 'en' 
          ? "Your session has been cancelled successfully" 
          : "تم إلغاء جلستك بنجاح",
        variant: "default",
      });
    } catch (error) {
      console.error('Error cancelling session:', error);
      toast({
        title: language === 'en' ? 'Error' : 'خطأ',
        description: language === 'en' 
          ? 'Failed to cancel your session' 
          : 'فشل في إلغاء جلستك',
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRescheduleSession = (session: Session) => {
    setSelectedSession(session);
    setRescheduleDialogOpen(true);
  };

  const handleAttachment = (session: Session) => {
    setSelectedSession(session);
    setAttachmentDialogOpen(true);
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

  const handleLogout = () => {
    // Implement logout logic here
    navigate('/auth');
  };

  const handleChange = (field: keyof UserData) => {
    toast({
      title: language === 'en' ? 'Coming Soon' : 'قريباً',
      description: language === 'en' 
        ? 'This feature will be available soon' 
        : 'هذه الميزة ستكون متاحة قريباً',
      variant: "default",
    });
  };

  const handleAddInsurance = () => {
    toast({
      title: language === 'en' ? 'Coming Soon' : 'قريباً',
      description: language === 'en' 
        ? 'Insurance company feature will be available soon' 
        : 'ميزة شركة التأمين ستكون متاحة قريباً',
      variant: "default",
    });
  };
  
  return (
    <div className="container py-8 max-w-7xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">
          {language === 'en' ? 'My Profile' : 'ملفي الشخصي'}
        </h1>
        <Button variant="outline" onClick={() => navigate('/account-settings')} className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          {language === 'en' ? 'Account Settings' : 'إعدادات الحساب'}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upcoming">
          {language === 'en' ? 'Upcoming Sessions' : 'الجلسات القادمة'}
          </TabsTrigger>
          <TabsTrigger value="previous">
            {language === 'en' ? 'Previous Sessions' : 'الجلسات السابقة'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          {isLoading ? (
            <Card>
              <CardContent className="py-6">
                <div className="flex justify-center">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              </CardContent>
            </Card>
          ) : upcomingSessions.length === 0 ? (
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
        </TabsContent>

        <TabsContent value="previous" className="space-y-4">
          {isLoading ? (
            <Card>
              <CardContent className="py-6">
                <div className="flex justify-center">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              </CardContent>
            </Card>
          ) : previousSessions.length === 0 ? (
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
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        </TabsContent>
      </Tabs>

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
                {selectedSession && `${selectedSession.start_time} - ${selectedSession.end_time}`}
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
              onClick={() => handleCancelSession(selectedSession!)}
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
                {selectedSession && `${selectedSession.start_time} - ${selectedSession.end_time}`}
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
                {selectedSession && `${selectedSession.start_time} - ${selectedSession.end_time}`}
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
