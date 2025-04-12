
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@/types/mindtrack';
import { useNavigate, useLocation } from 'react-router-dom';

export const useUserSessions = (language: string) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // State for dialogs
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [rescheduleDialogOpen, setRescheduleDialogOpen] = useState(false);
  const [attachmentDialogOpen, setAttachmentDialogOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [cancellationReason, setCancellationReason] = useState('');
  const [attachment, setAttachment] = useState<File | null>(null);
  const [attachmentNote, setAttachmentNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch user sessions
  const fetchSessions = async () => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: true });

      if (error) throw error;
      
      if (!data || data.length === 0) {
        console.log('No sessions found for user');
        setIsLoading(false);
        setSessions([]);
        return;
      }
      
      // Process sessions and update their status based on date and time
      const processedSessions = data.map(session => {
        const sessionDate = new Date(session.date);
        const sessionEndTime = session.end_time;
        
        // Parse hours and minutes from the end time string
        let hours = 0;
        let minutes = 0;
        
        if (sessionEndTime) {
          // Handle different time formats (12-hour or 24-hour)
          if (sessionEndTime.includes(':')) {
            const timeParts = sessionEndTime.split(':');
            hours = parseInt(timeParts[0]);
            
            // Handle minutes and AM/PM if present
            const minutesPart = timeParts[1];
            if (minutesPart.includes(' ')) {
              const [mins, period] = minutesPart.split(' ');
              minutes = parseInt(mins);
              if (period.toLowerCase() === 'pm' && hours < 12) {
                hours += 12;
              }
              if (period.toLowerCase() === 'am' && hours === 12) {
                hours = 0;
              }
            } else {
              minutes = parseInt(minutesPart);
            }
          } else if (sessionEndTime.toLowerCase().includes('am') || sessionEndTime.toLowerCase().includes('pm')) {
            // Handle format like "10 AM" or "2 PM"
            const timeParts = sessionEndTime.split(' ');
            hours = parseInt(timeParts[0]);
            if (timeParts[1].toLowerCase() === 'pm' && hours < 12) {
              hours += 12;
            }
            if (timeParts[1].toLowerCase() === 'am' && hours === 12) {
              hours = 0;
            }
          }
        }
        
        // Set the session end time
        sessionDate.setHours(hours, minutes);
        
        // Mark session as completed if it's in the past and was 'upcoming'
        if (session.status === 'upcoming' && sessionDate < new Date()) {
          return { ...session, status: 'completed' };
        }
        
        return session;
      });
      
      // Update any sessions that have changed status in the database
      const sessionsToUpdate = processedSessions.filter(
        session => session.status !== data.find(s => s.id === session.id)?.status
      );
      
      if (sessionsToUpdate.length > 0) {
        await Promise.all(sessionsToUpdate.map(session => 
          supabase
            .from('sessions')
            .update({ status: session.status })
            .eq('id', session.id)
        ));
      }
      
      setSessions(processedSessions);
      console.log('Sessions loaded successfully:', processedSessions);
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

  // Initial load of sessions
  useEffect(() => {
    fetchSessions();
    
    // Handle location state if coming from a successful booking
    if (location.state?.activeTab === 'upcoming') {
      console.log('Redirected from successful booking, refreshing sessions');
    }
  }, [language, toast, location.state]);

  const handleCancelSession = async () => {
    if (!selectedSession || !cancellationReason.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('sessions')
        .update({ 
          status: 'cancelled',
          notes: cancellationReason 
        })
        .eq('id', selectedSession.id);

      if (error) throw error;

      setSessions(prevSessions => 
        prevSessions.map(s => 
          s.id === selectedSession.id 
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

  const handleAttachment = (session: Session) => {
    setSelectedSession(session);
    setAttachmentDialogOpen(true);
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
            ? "Your attachment and note have been sent to Dr. Basma" 
            : "Your message has been sent to Dr. Basma"
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(
      language === 'en' ? 'en-US' : 'ar-EG', 
      { year: 'numeric', month: 'long', day: 'numeric' }
    );
  };

  return {
    sessions,
    upcomingSessions: sessions.filter(session => session.status === 'upcoming'),
    previousSessions: sessions.filter(session => ['completed', 'cancelled'].includes(session.status)),
    isLoading,
    cancelDialogOpen,
    setCancelDialogOpen,
    rescheduleDialogOpen,
    setRescheduleDialogOpen,
    attachmentDialogOpen,
    setAttachmentDialogOpen,
    selectedSession,
    setSelectedSession,
    cancellationReason,
    setCancellationReason,
    attachment,
    attachmentNote,
    setAttachmentNote,
    isSubmitting,
    handleCancelSession,
    handleRescheduleSession,
    handleAttachment,
    submitReschedule,
    submitAttachment,
    handleFileChange,
    formatDate,
    fetchSessions // Export this to allow manual refresh when needed
  };
};
