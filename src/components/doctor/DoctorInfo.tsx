import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from '@/components/Header';

interface DoctorInfoProps {
  doctorInfo: {
    name: string;
    title: string;
    bio: string;
    certifications: string[];
    rating: number;
    reviewCount: number;
  };
}

export const DoctorInfo: React.FC<DoctorInfoProps> = ({ doctorInfo }) => {
  const { language } = useLanguage();

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {language === 'en' ? 'Doctor Information' : 'معلومات الطبيب'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold">{doctorInfo.name}</h3>
          <p className="text-sm text-muted-foreground">{doctorInfo.title}</p>
        </div>
        <p>{doctorInfo.bio}</p>
        <div>
          <h4 className="font-medium mb-2">
            {language === 'en' ? 'Certifications' : 'الشهادات'}
          </h4>
          <ul className="list-disc list-inside text-sm space-y-1">
            {doctorInfo.certifications.map((cert, index) => (
              <li key={index}>{cert}</li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};