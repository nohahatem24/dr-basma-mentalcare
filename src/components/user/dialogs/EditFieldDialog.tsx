
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface EditFieldDialogProps {
  language: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editField: string | null;
  editValue: string;
  setEditValue: (value: string) => void;
  setEditField: (field: string | null) => void;
  onSuccess: (field: string, value: string) => void;
}

const EditFieldDialog = ({
  language,
  isOpen,
  onOpenChange,
  editField,
  editValue,
  setEditValue,
  setEditField,
  onSuccess
}: EditFieldDialogProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

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

      onSuccess(editField, editValue);

      handleClose();

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

  const handleClose = () => {
    onOpenChange(false);
    setEditField(null);
    setEditValue('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
            onClick={handleClose}
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
  );
};

export default EditFieldDialog;
