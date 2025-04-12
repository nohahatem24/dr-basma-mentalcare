
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

interface PersonalInfoSectionProps {
  language: string;
  userData: {
    fullName: string;
    dateOfBirth: string;
    gender: string;
    country: string;
  };
  onEdit: (field: string) => void;
}

const PersonalInfoSection = ({ 
  language, 
  userData, 
  onEdit 
}: PersonalInfoSectionProps) => {
  return (
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
              <Button variant="ghost" onClick={() => onEdit('fullName')} className="text-primary hover:text-primary">
                {language === 'en' ? 'Change' : 'تغيير'}
              </Button>
            </div>
          </div>

          <div>
            <label className="text-sm text-muted-foreground">Date of Birth</label>
            <div className="flex items-center gap-2">
              <Input value={userData.dateOfBirth} readOnly className="bg-muted" />
              <Button variant="ghost" onClick={() => onEdit('dateOfBirth')} className="text-primary hover:text-primary">
                {language === 'en' ? 'Change' : 'تغيير'}
              </Button>
            </div>
          </div>

          <div>
            <label className="text-sm text-muted-foreground">Gender</label>
            <div className="flex items-center gap-2">
              <Input value={userData.gender} readOnly className="bg-muted" />
              <Button variant="ghost" onClick={() => onEdit('gender')} className="text-primary hover:text-primary">
                {language === 'en' ? 'Change' : 'تغيير'}
              </Button>
            </div>
          </div>

          <div>
            <label className="text-sm text-muted-foreground">Country</label>
            <div className="flex items-center gap-2">
              <Input value={userData.country} readOnly className="bg-muted" />
              <Button variant="ghost" onClick={() => onEdit('country')} className="text-primary hover:text-primary">
                {language === 'en' ? 'Change' : 'تغيير'}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonalInfoSection;
