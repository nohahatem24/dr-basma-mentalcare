
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/components/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Profile } from '@/types/mindtrack';

interface UserData {
  email: string;
  phone: string;
  fullName: string;
  dateOfBirth: string;
  gender: string;
  country: string;
}

const AccountSettings = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
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
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State for edit dialogs
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editField, setEditField] = useState<keyof UserData | null>(null);
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

      setPasswordDialogOpen(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

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

  const handleEdit = (field: keyof UserData) => {
    setEditField(field);
    setEditValue(userData[field]);
    setEditDialogOpen(true);
  };

  const handleUpdateField = async () => {
    if (!editField) return;

    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      if (editField === 'email') {
        const { error } = await supabase.auth.updateUser({
          email: editValue
        });
        if (error) throw error;
      } else {
        // Map the UserData fields to profile fields
        let updateData = {};
        
        switch (editField) {
          case 'fullName':
            const [firstName = '', lastName = ''] = editValue.split(' ', 2);
            updateData = { first_name: firstName, last_name: lastName };
            break;
          case 'phone':
            updateData = { phone: editValue };
            break;
          case 'dateOfBirth':
            updateData = { date_of_birth: editValue };
            break;
          case 'gender':
            updateData = { gender: editValue };
            break;
          case 'country':
            updateData = { language: editValue }; // Using language field for country
            break;
        }

        const { error } = await supabase
          .from('profiles')
          .update(updateData)
          .eq('id', user.id);

        if (error) throw error;
      }

      setUserData(prev => ({
        ...prev,
        [editField]: editValue
      }));

      setEditDialogOpen(false);
      setEditField(null);
      setEditValue('');

      toast({
        title: language === 'en' ? 'Success' : 'تم بنجاح',
        description: language === 'en' 
          ? `Your ${editField} has been updated successfully` 
          : `تم تحديث ${editField === 'email' ? 'البريد الإلكتروني' : 
              editField === 'phone' ? 'رقم الهاتف' :
              editField === 'fullName' ? 'اسم المستخدم' :
              editField === 'dateOfBirth' ? 'تاريخ الميلاد' :
              editField === 'gender' ? 'الجنس' :
              'البلد'} بنجاح`,
        variant: "default",
      });
    } catch (error) {
      console.error('Error updating field:', error);
      toast({
        title: language === 'en' ? 'Error' : 'خطأ',
        description: language === 'en' 
          ? `Failed to update ${editField}` 
          : `فشل في تحديث ${editField === 'email' ? 'البريد الإلكتروني' : 
              editField === 'phone' ? 'رقم الهاتف' :
              editField === 'fullName' ? 'اسم المستخدم' :
              editField === 'dateOfBirth' ? 'تاريخ الميلاد' :
              editField === 'gender' ? 'الجنس' :
              'البلد'}`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate('/auth');
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: language === 'en' ? 'Error' : 'خطأ',
        description: language === 'en' 
          ? 'Failed to sign out' 
          : 'فشل في تسجيل الخروج',
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container py-8 max-w-7xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">
          {language === 'en' ? 'Account Settings' : 'إعدادات الحساب'}
        </h1>
        <Button variant="ghost" onClick={handleLogout} className="flex items-center gap-2">
          <LogOut className="h-5 w-5" />
          {language === 'en' ? 'Log Out' : 'تسجيل الخروج'}
        </Button>
      </div>

      <div className="grid gap-8">
        {/* Account Details */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-6">
              {language === 'en' ? 'Account details' : 'تفاصيل الحساب'}
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground">Email</label>
                <div className="flex items-center gap-2">
                  <Input value={userData.email} readOnly className="bg-muted" />
                  <Button variant="ghost" onClick={() => handleEdit('email')} className="text-primary hover:text-primary">
                    {language === 'en' ? 'Change' : 'تغيير'}
                  </Button>
                </div>
              </div>

              <div>
                <label className="text-sm text-muted-foreground">
                  {language === 'en' ? 'Phone number' : 'رقم الهاتف'}
                </label>
                <div className="flex items-center gap-2">
                  <Input value={userData.phone} readOnly className="bg-muted" />
                  <Button variant="ghost" onClick={() => handleEdit('phone')} className="text-primary hover:text-primary">
                    {language === 'en' ? 'Change' : 'تغيير'}
                  </Button>
                </div>
              </div>

              <div>
                <label className="text-sm text-muted-foreground">Password</label>
                <div className="flex items-center gap-2">
                  <Input type="password" value="••••••••" readOnly className="bg-muted" />
                  <Button variant="ghost" onClick={() => setPasswordDialogOpen(true)} className="text-primary hover:text-primary">
                    {language === 'en' ? 'Change' : 'تغيير'}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-6">
              {language === 'en' ? 'Personal information' : 'المعلومات الشخصية'}
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground">Full Name</label>
                <div className="flex items-center gap-2">
                  <Input value={userData.fullName} readOnly className="bg-muted" />
                  <Button variant="ghost" onClick={() => handleEdit('fullName')} className="text-primary hover:text-primary">
                    {language === 'en' ? 'Change' : 'تغيير'}
                  </Button>
                </div>
              </div>

              <div>
                <label className="text-sm text-muted-foreground">Date of Birth</label>
                <div className="flex items-center gap-2">
                  <Input value={userData.dateOfBirth} readOnly className="bg-muted" />
                  <Button variant="ghost" onClick={() => handleEdit('dateOfBirth')} className="text-primary hover:text-primary">
                    {language === 'en' ? 'Change' : 'تغيير'}
                  </Button>
                </div>
              </div>

              <div>
                <label className="text-sm text-muted-foreground">Gender</label>
                <div className="flex items-center gap-2">
                  <Input value={userData.gender} readOnly className="bg-muted" />
                  <Button variant="ghost" onClick={() => handleEdit('gender')} className="text-primary hover:text-primary">
                    {language === 'en' ? 'Change' : 'تغيير'}
                  </Button>
                </div>
              </div>

              <div>
                <label className="text-sm text-muted-foreground">Country</label>
                <div className="flex items-center gap-2">
                  <Input value={userData.country} readOnly className="bg-muted" />
                  <Button variant="ghost" onClick={() => handleEdit('country')} className="text-primary hover:text-primary">
                    {language === 'en' ? 'Change' : 'تغيير'}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Password Change Dialog */}
      <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
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
              onClick={() => {
                setPasswordDialogOpen(false);
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
              }}
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

      {/* Edit Field Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {language === 'en' 
                ? `Update ${editField === 'email' ? 'Email' :
                    editField === 'phone' ? 'Phone Number' :
                    editField === 'fullName' ? 'Full Name' :
                    editField === 'dateOfBirth' ? 'Date of Birth' :
                    editField === 'gender' ? 'Gender' :
                    editField === 'country' ? 'Country' : ''}`
                : `تحديث ${editField === 'email' ? 'البريد الإلكتروني' :
                    editField === 'phone' ? 'رقم الهاتف' :
                    editField === 'fullName' ? 'اسم المستخدم' :
                    editField === 'dateOfBirth' ? 'تاريخ الميلاد' :
                    editField === 'gender' ? 'الجنس' :
                    editField === 'country' ? 'البلد' : ''}`}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {editField === 'gender' ? (
              <Select value={editValue} onValueChange={setEditValue}>
                <SelectTrigger>
                  <SelectValue placeholder={language === 'en' ? "Select gender" : "اختر الجنس"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">{language === 'en' ? "Male" : "ذكر"}</SelectItem>
                  <SelectItem value="female">{language === 'en' ? "Female" : "أنثى"}</SelectItem>
                </SelectContent>
              </Select>
            ) : editField === 'dateOfBirth' ? (
              <Input
                type="date"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
              />
            ) : (
              <Input
                type={editField === 'email' ? 'email' : 'text'}
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
              />
            )}
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setEditDialogOpen(false);
                setEditField(null);
                setEditValue('');
              }}
              disabled={isSubmitting}
            >
              {language === 'en' ? 'Cancel' : 'إلغاء'}
            </Button>
            <Button
              onClick={handleUpdateField}
              disabled={isSubmitting || !editValue.trim()}
            >
              {isSubmitting ? (
                language === 'en' ? 'Updating...' : 'جارٍ التحديث...'
              ) : (
                language === 'en' ? 'Update' : 'تحديث'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AccountSettings; 
