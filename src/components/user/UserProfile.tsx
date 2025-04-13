import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { LogOut, Settings } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Import custom hooks
import { useUserProfile } from './hooks/useUserProfile';
import { useUserSessions } from './hooks/useUserSessions';

// Import components
import SessionsList from './components/SessionsList';
import CancelSessionDialog from './dialogs/CancelSessionDialog';
import RescheduleSessionDialog from './dialogs/RescheduleSessionDialog';
import AttachmentDialog from './dialogs/AttachmentDialog';

const UserProfile = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Custom hooks
  const { 
    userData, 
    activeTab, 
    setActiveTab, 
    handleLogout
  } = useUserProfile(language);
  
  const { 
    upcomingSessions,
    previousSessions,
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
    fetchSessions
  } = useUserSessions(language);
  
  // Handle location state for new bookings
  useEffect(() => {
    // If we're coming from a successful booking or payment
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
      
      // If shouldRefresh flag is set, force a refresh of sessions
      if (location.state.shouldRefresh) {
        console.log('Forcing session refresh due to new booking');
        fetchSessions();
      }
      
      // Clear the state to avoid unnecessary refreshing
      window.history.replaceState({}, document.title);
    }
  }, [location.state, setActiveTab, fetchSessions]);
  
  const openCancelDialog = (session: any) => {
    setSelectedSession(session);
    setCancelDialogOpen(true);
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
          <SessionsList
            sessions={upcomingSessions}
            isLoading={isLoading}
            language={language}
            formatDate={formatDate}
            isUpcoming={true}
            onReschedule={handleRescheduleSession}
            onCancel={openCancelDialog}
            onAttachment={handleAttachment}
          />
        </TabsContent>

        <TabsContent value="previous" className="space-y-4">
          <SessionsList
            sessions={previousSessions}
            isLoading={isLoading}
            language={language}
            formatDate={formatDate}
            isUpcoming={false}
          />
        </TabsContent>
      </Tabs>

      {/* Cancel Session Dialog */}
      <CancelSessionDialog
        language={language}
        isOpen={cancelDialogOpen}
        onOpenChange={setCancelDialogOpen}
        selectedSession={selectedSession}
        cancellationReason={cancellationReason}
        setCancellationReason={setCancellationReason}
        isSubmitting={isSubmitting}
        onCancel={handleCancelSession}
        formatDate={formatDate}
      />

      {/* Reschedule Session Dialog */}
      <RescheduleSessionDialog
        language={language}
        isOpen={rescheduleDialogOpen}
        onOpenChange={setRescheduleDialogOpen}
        selectedSession={selectedSession}
        isSubmitting={isSubmitting}
        onReschedule={submitReschedule}
        formatDate={formatDate}
      />

      {/* Send Attachment Dialog */}
      <AttachmentDialog
        language={language}
        isOpen={attachmentDialogOpen}
        onOpenChange={setAttachmentDialogOpen}
        selectedSession={selectedSession}
        attachmentNote={attachmentNote}
        setAttachmentNote={setAttachmentNote}
        attachment={attachment}
        onFileChange={handleFileChange}
        isSubmitting={isSubmitting}
        onSubmit={submitAttachment}
        formatDate={formatDate}
      />
    </div>
  );
};

export default UserProfile;
