import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from '@/components/Header';

interface PaymentFormProps {
  fee: number;
  isProcessing: boolean;
  onPaymentComplete: () => void;
}

export const PaymentForm: React.FC<PaymentFormProps> = ({
  fee,
  isProcessing,
  onPaymentComplete,
}) => {
  const { language } = useLanguage();

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {language === 'en' ? 'Payment Details' : 'تفاصيل الدفع'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          type="text"
          placeholder={language === 'en' ? 'Card Number' : 'رقم البطاقة'}
        />
        <div className="grid grid-cols-2 gap-4">
          <Input
            type="text"
            placeholder={language === 'en' ? 'MM/YY' : 'شهر/سنة'}
          />
          <Input
            type="text"
            placeholder={language === 'en' ? 'CVC' : 'رمز التحقق'}
          />
        </div>
        <Button
          onClick={onPaymentComplete}
          disabled={isProcessing}
          className="w-full"
        >
          {isProcessing
            ? language === 'en'
              ? 'Processing...'
              : 'جاري المعالجة...'
            : language === 'en'
            ? `Pay $${fee}`
            : `ادفع $${fee}`}
        </Button>
      </CardContent>
    </Card>
  );
};
