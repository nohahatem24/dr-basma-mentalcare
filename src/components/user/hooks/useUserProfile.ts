
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface UserData {
  email: string;
  phone: string;
  username: string;
  birthday: string;
  gender: string;
  country: string;
}

export const useUserProfile = (language: string) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // State for user data
  const [userData] = useState<UserData>({
    email: 'nohahatem234@gmail.com',
    phone: '201554199143',
    username: 'Noha Hatem',
    birthday: '24/04/2002',
    gender: 'Female',
    country: 'Egypt'
  });
  
  // State for active tab
  const [activeTab, setActiveTab] = useState('upcoming');

  const handleLogout = () => {
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
  
  return {
    userData,
    activeTab,
    setActiveTab,
    handleLogout,
    handleChange,
    handleAddInsurance
  };
};
