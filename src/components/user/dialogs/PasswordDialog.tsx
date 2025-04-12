
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface PasswordDialogProps {
  language: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const PasswordDialog = ({ language, isOpen, onOpenChange }: PasswordDialogProps) => {
  const { toast } = useToast();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: language === 'en' ? 'Error' : 'خطأ',
        description: language === 'en' 
          ? 'New passwords do not match' 
          : 'كلمات المرور الجديدة غير متطابقة',
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      handleClose();

      toast({
        title: language === 'en' ? 'Success' : 'تم بنجاح',
        description: language === 'en' 
          ? 'Your password has been updated successfully' 
          : 'تم تحديث كلمة المرور بنجاح',
        variant: "default",
      });
    } catch (error) {
      console.error('Error updating password:', error);
      toast({
        title: language === 'en' ? 'Error' : 'خطأ',
        description: language === 'en' 
          ? 'Failed to update password' 
          : 'فشل في تحديث كلمة المرور',
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {language === 'en' ? 'Change Password' : 'تغيير كلمة المرور'}
          </DialogTitle>
          <DialogDescription>
            {language === 'en' 
              ? 'Enter your current password and choose a new one.' 
              : 'أدخل كلمة المرور الحالية واختر كلمة مرور جديدة.'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              {language === 'en' ? 'Current Password' : 'كلمة المرور الحالية'}
            </label>
            <Input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">
              {language === 'en' ? 'New Password' : 'كلمة المرور الجديدة'}
            </label>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">
              {language === 'en' ? 'Confirm New Password' : 'تأكيد كلمة المرور الجديدة'}
            </label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            {language === 'en' ? 'Cancel' : 'إلغاء'}
          </Button>
          <Button
            onClick={handlePasswordChange}
            disabled={isSubmitting || !currentPassword || !newPassword || !confirmPassword}
          >
            {isSubmitting ? (
              language === 'en' ? 'Updating...' : 'جارٍ التحديث...'
            ) : (
              language === 'en' ? 'Update Password' : 'تحديث كلمة المرور'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PasswordDialog;
