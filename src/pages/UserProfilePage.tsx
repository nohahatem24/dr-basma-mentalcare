
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { TabsContent } from '@/components/ui/tabs';
import { toast } from 'sonner';

// Import our new components
import ProfileSidebar from '@/components/user/ProfileSidebar';
import ProfileOverview from '@/components/user/ProfileOverview';
import SessionsTab from '@/components/user/SessionsTab';
import MoodHistoryTab from '@/components/user/MoodHistoryTab';
import MessagesTab from '@/components/user/MessagesTab';
import ProfileEditForm from '@/components/user/ProfileEditForm';
import { useMoodChartData } from '@/components/dashboard/MoodChartUtils';
import { useLanguage } from '@/components/Header';

interface MoodEntry {
  id: string;
  date: Date;
  mood: number;
  notes: string;
  triggers: string[];
}

const UserProfilePage = () => {
  const { language } = useLanguage();
  const { session, updateProfile, signOut, refreshProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  
  const [isUpdating, setIsUpdating] = useState(false);
  const [firstName, setFirstName] = useState(session.profile?.first_name || '');
  const [lastName, setLastName] = useState(session.profile?.last_name || '');
  const [phoneNumber, setPhoneNumber] = useState(session.user?.phone || session.user?.user_metadata?.phone || '');
  const [gender, setGender] = useState(session.user?.user_metadata?.gender || '');
  const [dateOfBirth, setDateOfBirth] = useState(session.user?.user_metadata?.date_of_birth || '');
  
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [isLoadingMoodEntries, setIsLoadingMoodEntries] = useState(false);
  
  // Fetch mood entries
  useEffect(() => {
    const fetchMoodEntries = async () => {
      if (!session.user?.id) return;
      
      setIsLoadingMoodEntries(true);
      try {
        const { data, error } = await supabase
          .from('mood_entries')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false })
          .limit(7);
          
        if (error) throw error;
        
        const formattedEntries = data.map(entry => ({
          id: entry.id,
          date: new Date(entry.created_at),
          mood: entry.mood_score,
          notes: entry.notes || '',
          triggers: entry.triggers || []
        }));
        
        setMoodEntries(formattedEntries);
      } catch (error) {
        console.error('Error fetching mood entries:', error);
      } finally {
        setIsLoadingMoodEntries(false);
      }
    };
    
    fetchMoodEntries();
  }, [session.user?.id]);
  
  const moodChartData = useMoodChartData(moodEntries);
  
  // Update form fields when session changes
  useEffect(() => {
    if (session.profile) {
      setFirstName(session.profile.first_name || '');
      setLastName(session.profile.last_name || '');
    }
    
    if (session.user) {
      setPhoneNumber(session.user.phone || session.user.user_metadata?.phone || '');
      setGender(session.user.user_metadata?.gender || '');
      setDateOfBirth(session.user.user_metadata?.date_of_birth || '');
    }
  }, [session]);
  
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    
    try {
      const { success, error } = await updateProfile({
        first_name: firstName,
        last_name: lastName,
      });
      
      // Also update user metadata
      await supabase.auth.updateUser({
        data: {
          phone: phoneNumber,
          gender: gender,
          first_name: firstName,
          last_name: lastName,
          full_name: `${firstName} ${lastName}`.trim(),
          date_of_birth: dateOfBirth,
        }
      });
      
      if (!success && error) {
        throw new Error(error);
      }
      
      // Refresh the profile to get the latest data
      await refreshProfile();
      
      toast(language === 'en' 
        ? 'Profile updated successfully' 
        : 'تم تحديث الملف الشخصي بنجاح'
      );
      
      setActiveTab('overview');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsUpdating(false);
    }
  };
  
  const handleLogout = async () => {
    await signOut();
  };
  
  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <ProfileSidebar 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            handleLogout={handleLogout}
          />
        </div>
        
        <div className="md:col-span-2">
          <TabsContent value="overview" className="mt-0">
            <ProfileOverview
              moodChartData={moodChartData}
              isLoadingMoodEntries={isLoadingMoodEntries}
              moodEntries={moodEntries}
              setActiveTab={setActiveTab}
            />
          </TabsContent>
          
          <TabsContent value="sessions" className="mt-0">
            <SessionsTab />
          </TabsContent>
          
          <TabsContent value="mood-history" className="mt-0">
            <MoodHistoryTab
              isLoadingMoodEntries={isLoadingMoodEntries}
              moodEntries={moodEntries}
              moodChartData={moodChartData}
            />
          </TabsContent>
          
          <TabsContent value="messages" className="mt-0">
            <MessagesTab />
          </TabsContent>
          
          <TabsContent value="settings" className="mt-0">
            <ProfileEditForm
              firstName={firstName}
              lastName={lastName}
              phoneNumber={phoneNumber}
              gender={gender}
              dateOfBirth={dateOfBirth}
              email={session.user?.email || ''}
              isUpdating={isUpdating}
              setFirstName={setFirstName}
              setLastName={setLastName}
              setPhoneNumber={setPhoneNumber}
              setGender={setGender}
              setDateOfBirth={setDateOfBirth}
              handleUpdateProfile={handleUpdateProfile}
              setActiveTab={setActiveTab}
            />
          </TabsContent>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
