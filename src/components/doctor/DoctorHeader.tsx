import React from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DoctorInfo } from '@/types/booking';
import { useLanguage } from '@/components/Header';

interface DoctorHeaderProps {
  doctorInfo: DoctorInfo;
  isOnline: boolean;
  onImmediateSession: () => void;
}

export const DoctorHeader: React.FC<DoctorHeaderProps> = ({
  doctorInfo,
  isOnline,
  onImmediateSession,
}) => {
  const { language } = useLanguage();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">{doctorInfo.name}</h2>
            <p className="text-muted-foreground">{doctorInfo.title}</p>
          </div>
          {isOnline && (
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              {language === 'en' ? 'Online' : 'متصل'}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Button
          onClick={onImmediateSession}
          className="w-full"
          disabled={!isOnline}
        >
          {language === 'en' ? 'Book Immediate Session' : 'حجز جلسة فورية'}
        </Button>
      </CardContent>
    </Card>
  );
};