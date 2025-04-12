
import React from 'react';
import { useLanguage } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAccountSettings } from './hooks/useAccountSettings';
import AccountDetailsSection from './sections/AccountDetailsSection';
import PersonalInfoSection from './sections/PersonalInfoSection';
import PasswordDialog from './dialogs/PasswordDialog';
import EditFieldDialog from './dialogs/EditFieldDialog';

const AccountSettings = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  
  const {
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
  } = useAccountSettings(language);

  const onLogout = async () => {
    const success = await handleLogout();
    if (success) {
      navigate('/auth');
    }
  };

  return (
    <div className="container py-8 max-w-7xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">
          {language === 'en' ? 'Account Settings' : 'إعدادات الحساب'}
        </h1>
        <Button variant="ghost" onClick={onLogout} className="flex items-center gap-2">
          <LogOut className="h-5 w-5" />
          {language === 'en' ? 'Log Out' : 'تسجيل الخروج'}
        </Button>
      </div>

      <div className="grid gap-8">
        {/* Account Details */}
        <AccountDetailsSection 
          language={language}
          userData={userData}
          onEdit={handleEdit}
          onPasswordDialogOpen={() => setPasswordDialogOpen(true)}
        />

        {/* Personal Information */}
        <PersonalInfoSection 
          language={language}
          userData={userData}
          onEdit={handleEdit}
        />
      </div>

      {/* Password Change Dialog */}
      <PasswordDialog 
        language={language}
        isOpen={passwordDialogOpen}
        onOpenChange={setPasswordDialogOpen}
      />

      {/* Edit Field Dialog */}
      <EditFieldDialog 
        language={language}
        isOpen={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        editField={editField}
        editValue={editValue}
        setEditValue={setEditValue}
        setEditField={setEditField}
        onSuccess={handleFieldUpdate}
      />
    </div>
  );
};

export default AccountSettings;
