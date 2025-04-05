import React, { useState } from 'react';
import { useLanguage } from '@/components/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LogOut } from 'lucide-react';
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

const AccountSettings = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [userData, setUserData] = useState<UserData>({
    email: 'nohahatem234@gmail.com',
    phone: '201554199143',
    username: 'Noha Hatem',
    birthday: '24/04/2002',
    gender: 'Female',
    country: 'Egypt'
  });

  const handleLogout = () => {
    // Implement logout logic here
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

  return (
    <div className="container py-8 max-w-7xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">
          {language === 'en' ? 'My Account' : 'حسابي'}
        </h1>
        <Button variant="ghost" onClick={handleLogout} className="flex items-center gap-2">
          <LogOut className="h-5 w-5" />
          {language === 'en' ? 'Log Out' : 'تسجيل الخروج'}
        </Button>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
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
                  <Button variant="ghost" onClick={() => handleChange('email')} className="text-primary hover:text-primary">
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
                  <Button variant="ghost" onClick={() => handleChange('phone')} className="text-primary hover:text-primary">
                    {language === 'en' ? 'Change' : 'تغيير'}
                  </Button>
                </div>
              </div>

              <div>
                <label className="text-sm text-muted-foreground">Password</label>
                <div className="flex items-center gap-2">
                  <Input type="password" value="••••••••" readOnly className="bg-muted" />
                  <Button variant="ghost" onClick={() => handleChange('password')} className="text-primary hover:text-primary">
                    {language === 'en' ? 'Change' : 'تغيير'}
                  </Button>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold">
                    {language === 'en' ? 'Insurance Company' : 'شركة التأمين'}
                  </h3>
                  <Button variant="ghost" onClick={handleAddInsurance} className="text-primary hover:text-primary">
                    {language === 'en' ? 'Add' : 'إضافة'}
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
                <label className="text-sm text-muted-foreground">Username</label>
                <div className="flex items-center gap-2">
                  <Input value={userData.username} readOnly className="bg-muted" />
                  <Button variant="ghost" onClick={() => handleChange('username')} className="text-primary hover:text-primary">
                    {language === 'en' ? 'Change' : 'تغيير'}
                  </Button>
                </div>
              </div>

              <div>
                <label className="text-sm text-muted-foreground">Birthday</label>
                <div className="flex items-center gap-2">
                  <Input value={userData.birthday} readOnly className="bg-muted" />
                  <Button variant="ghost" onClick={() => handleChange('birthday')} className="text-primary hover:text-primary">
                    {language === 'en' ? 'Change' : 'تغيير'}
                  </Button>
                </div>
              </div>

              <div>
                <label className="text-sm text-muted-foreground">Gender</label>
                <div className="flex items-center gap-2">
                  <Input value={userData.gender} readOnly className="bg-muted" />
                  <Button variant="ghost" onClick={() => handleChange('gender')} className="text-primary hover:text-primary">
                    {language === 'en' ? 'Change' : 'تغيير'}
                  </Button>
                </div>
              </div>

              <div>
                <label className="text-sm text-muted-foreground">Country</label>
                <div className="flex items-center gap-2">
                  <Input value={userData.country} readOnly className="bg-muted" />
                  <Button variant="ghost" onClick={() => handleChange('country')} className="text-primary hover:text-primary">
                    {language === 'en' ? 'Change' : 'تغيير'}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subscription */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-6">
              {language === 'en' ? 'My Subscription' : 'اشتراكي'}
            </h2>
            <div className="text-center py-8 text-muted-foreground">
              {language === 'en' 
                ? 'There is no subscription for this user' 
                : 'لا يوجد اشتراك لهذا المستخدم'}
            </div>
          </CardContent>
        </Card>

        {/* Wallet */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-6">
              {language === 'en' ? 'My Wallet' : 'محفظتي'}
            </h2>
            <div>
              <label className="text-sm text-muted-foreground">
                {language === 'en' ? 'Current Balance' : 'الرصيد الحالي'}
              </label>
              <Input value="0 EGP" readOnly className="bg-muted" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AccountSettings; 