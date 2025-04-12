
import { format } from 'date-fns';
import { useLanguage } from '@/components/Header';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface AppointmentDetails {
  date?: Date;
  doctorName: string;
  fee: number;
  duration: string;
  appointmentType: 'standard' | 'custom' | 'immediate';
  startTime?: string;
  endTime?: string;
  notes?: string;
  currency: string;
}

interface BookingSummaryProps {
  appointmentDetails: AppointmentDetails;
}

const BookingSummary: React.FC<BookingSummaryProps> = ({ appointmentDetails }) => {
  const { language } = useLanguage();
  
  const formatDate = (date?: Date) => {
    if (!date) return "";
    return format(date, language === 'en' ? 'MMMM d, yyyy' : 'yyyy/MM/dd');
  };
  
  const getAppointmentTypeDisplay = () => {
    switch (appointmentDetails.appointmentType) {
      case 'immediate':
        return language === 'en' ? "Immediate Session" : "جلسة فورية";
      case 'custom':
        return language === 'en' ? "Custom Appointment" : "موعد مخصص";
      default:
        return language === 'en' ? "Standard Appointment" : "موعد قياسي";
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {language === 'en' ? "Booking Summary" : "ملخص الحجز"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">
            {language === 'en' ? "Doctor" : "الطبيب"}
          </p>
          <p className="font-medium">{appointmentDetails.doctorName}</p>
        </div>
        
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">
            {language === 'en' ? "Appointment Type" : "نوع الموعد"}
          </p>
          <p className="font-medium">{getAppointmentTypeDisplay()}</p>
        </div>
        
        {appointmentDetails.date && appointmentDetails.startTime && appointmentDetails.endTime && (
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">
              {language === 'en' ? "Date & Time" : "التاريخ والوقت"}
            </p>
            <p className="font-medium">
              {formatDate(appointmentDetails.date)} - {appointmentDetails.startTime} to {appointmentDetails.endTime}
            </p>
          </div>
        )}
        
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">
            {language === 'en' ? "Duration" : "المدة"}
          </p>
          <p className="font-medium">
            {appointmentDetails.duration} {language === 'en' ? "Minutes" : "دقيقة"}
          </p>
        </div>
        
        {appointmentDetails.notes && (
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">
              {language === 'en' ? "Notes" : "ملاحظات"}
            </p>
            <p className="font-medium">{appointmentDetails.notes}</p>
          </div>
        )}
        
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">
            {language === 'en' ? "Fee" : "الرسوم"}
          </p>
          <p className="font-medium">
            {appointmentDetails.fee} {language === 'en' ? "EGP" : "جنيه مصري"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingSummary;
