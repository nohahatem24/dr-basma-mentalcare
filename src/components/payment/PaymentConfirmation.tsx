
import { Check } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/components/Header';

interface PaymentConfirmationProps {
  doctorName: string;
}

const PaymentConfirmation: React.FC<PaymentConfirmationProps> = ({ doctorName }) => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  
  return (
    <Card className="border-green-500">
      <CardContent className="pt-6 pb-6 text-center">
        <div className="mx-auto mb-4 bg-green-100 h-16 w-16 rounded-full flex items-center justify-center">
          <Check className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-semibold mb-2">
          {language === 'en' ? "Booking Confirmed!" : "تم تأكيد الحجز!"}
        </h2>
        <p className="text-muted-foreground mb-6">
          {language === 'en' 
            ? `Your appointment with ${doctorName} has been scheduled.` 
            : `تم جدولة موعدك مع ${doctorName}.`}
        </p>
        <Button onClick={() => navigate('/dashboard')}>
          {language === 'en' ? "Go to Dashboard" : "الذهاب إلى لوحة التحكم"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default PaymentConfirmation;
