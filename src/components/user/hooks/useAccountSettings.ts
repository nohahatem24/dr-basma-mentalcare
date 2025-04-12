
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface UserData {
  email: string;
  phone: string;
  fullName: string;
  dateOfBirth: string;
  gender: string;
  country: string;
}

export const useAccountSettings = (language: string) => {
  const { toast } = useToast();

  // State for user data
  const [userData, setUserData] = useState<UserData>({
    email: '',
    phone: '',
    fullName: '',
    dateOfBirth: '',
    gender: '',
    country: ''
  });

  // State for password change
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);

  // State for edit dialogs
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editField, setEditField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        if (data) {
          setUserData({
            email: user.email || '',
            phone: data.phone || '',
            fullName: `${data.first_name || ''} ${data.last_name || ''}`.trim(),
            dateOfBirth: data.date_of_birth || '',
            gender: data.gender || '',
            country: data.language || '' // Using language field as country for now
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast({
          title: language === 'en' ? 'Error' : 'خطأ',
          description: language === 'en' 
            ? 'Failed to load your account information' 
            : 'فشل في تحميل معلومات حسابك',
          variant: "destructive",
        });
      }
    };

    fetchUserData();
  }, [language, toast]);

  const handleEdit = (field: string) => {
    setEditField(field);
    setEditValue(userData[field as keyof UserData]);
    setEditDialogOpen(true);
  };

  const handleFieldUpdate = (field: string, value: string) => {
    setUserData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: language === 'en' ? 'Error' : 'خطأ',
        description: language === 'en' 
          ? 'Failed to sign out' 
          : 'فشل في تسجيل الخروج',
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    userData,
    passwordDialogOpen,
    setPasswordDialogOpen,
    editDialogOpen,
    setEditDialogOpen,
    editField,
    setEditField,
    editValue,
    setEditValue,
    handleEdit,
    handleFieldUpdate,
    handleLogout
  };
};
