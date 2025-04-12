
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

interface AccountDetailsSectionProps {
  language: string;
  userData: {
    email: string;
    phone: string;
  };
  onEdit: (field: string) => void;
  onPasswordDialogOpen: () => void;
}

const AccountDetailsSection = ({ 
  language, 
  userData, 
  onEdit, 
  onPasswordDialogOpen 
}: AccountDetailsSectionProps) => {
  return (
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
              <Button variant="ghost" onClick={() => onEdit('email')} className="text-primary hover:text-primary">
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
              <Button variant="ghost" onClick={() => onEdit('phone')} className="text-primary hover:text-primary">
                {language === 'en' ? 'Change' : 'تغيير'}
              </Button>
            </div>
          </div>

          <div>
            <label className="text-sm text-muted-foreground">Password</label>
            <div className="flex items-center gap-2">
              <Input type="password" value="••••••••" readOnly className="bg-muted" />
              <Button variant="ghost" onClick={onPasswordDialogOpen} className="text-primary hover:text-primary">
                {language === 'en' ? 'Change' : 'تغيير'}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountDetailsSection;
