
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@/types/mindtrack';
import { useNavigate } from 'react-router-dom';

export const useUserSessions = (language: string) => {
  const { toast } = useToast();
  const navigate = useNavigate();
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
        setSessions(data as Session[]);
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

  // Process new booking from location state
  useEffect(() => {
    const handleNewBooking = async (newBooking: any) => {
      if (!newBooking) return;

      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const newSession = {
          user_id: user.id,
          doctor_id: "basma_adel_123",
          date: format(new Date(newBooking.date), 'yyyy-MM-dd'),
          start_time: newBooking.startTime,
          end_time: newBooking.endTime,
          duration: newBooking.duration,
          type: newBooking.appointmentType === 'video' ? 'video' : 'in-person',
          status: 'upcoming',
          fee: newBooking.fee
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
        setSessions(data as Session[]);

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

    // Check location state for new booking
    const locationState = window.history.state?.state;
    if (locationState?.newBooking) {
      handleNewBooking(locationState.newBooking);
    }
  }, [navigate, toast, language]);

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
    previousSessions: sessions.filter(session => session.status === 'completed'),
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
    formatDate
  };
};
