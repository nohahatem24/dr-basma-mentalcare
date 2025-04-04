
import React from 'react';
import { useLanguage } from '@/components/Header';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import DateOfBirthInput from '@/components/auth/DateOfBirthInput';

interface ProfileEditFormProps {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  gender: string;
  dateOfBirth: string;
  email: string;
  isUpdating: boolean;
  setFirstName: (value: string) => void;
  setLastName: (value: string) => void;
  setPhoneNumber: (value: string) => void;
  setGender: (value: string) => void;
  setDateOfBirth: (value: string) => void;
  handleUpdateProfile: (e: React.FormEvent) => void;
  setActiveTab: (value: string) => void;
}

const ProfileEditForm = ({
  firstName,
  lastName,
  phoneNumber,
  gender,
  dateOfBirth,
  email,
  isUpdating,
  setFirstName,
  setLastName,
  setPhoneNumber,
  setGender,
  setDateOfBirth,
  handleUpdateProfile,
  setActiveTab
}: ProfileEditFormProps) => {
  const { language } = useLanguage();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{language === 'en' ? 'Edit Profile' : 'تعديل الملف الشخصي'}</CardTitle>
        <CardDescription>
          {language === 'en' 
            ? 'Update your personal information' 
            : 'تحديث معلوماتك الشخصية'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first-name">
                {language === 'en' ? 'First Name' : 'الاسم الأول'}
              </Label>
              <Input
                id="first-name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="last-name">
                {language === 'en' ? 'Last Name' : 'الاسم الأخير'}
              </Label>
              <Input
                id="last-name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">
                {language === 'en' ? 'Email' : 'البريد الإلكتروني'}
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                disabled
              />
              <p className="text-xs text-muted-foreground">
                {language === 'en' 
                  ? 'Email cannot be changed' 
                  : 'لا يمكن تغيير البريد الإلكتروني'}
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">
                {language === 'en' ? 'Phone Number' : 'رقم الهاتف'}
              </Label>
              <Input
                id="phone"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="gender">
                {language === 'en' ? 'Gender' : 'الجنس'}
              </Label>
              <Select value={gender} onValueChange={setGender}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={language === 'en' ? 'Select gender' : 'اختر الجنس'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">{language === 'en' ? 'Male' : 'ذكر'}</SelectItem>
                  <SelectItem value="female">{language === 'en' ? 'Female' : 'أنثى'}</SelectItem>
                  <SelectItem value="other">{language === 'en' ? 'Other' : 'آخر'}</SelectItem>
                  <SelectItem value="prefer_not_to_say">{language === 'en' ? 'Prefer not to say' : 'أفضل عدم الإجابة'}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <DateOfBirthInput 
                value={dateOfBirth} 
                onChange={setDateOfBirth} 
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setActiveTab('overview')}>
              {language === 'en' ? 'Cancel' : 'إلغاء'}
            </Button>
            <Button type="submit" disabled={isUpdating}>
              {isUpdating 
                ? (language === 'en' ? 'Saving...' : 'جاري الحفظ...')
                : (language === 'en' ? 'Save Changes' : 'حفظ التغييرات')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProfileEditForm;
