import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from 'lucide-react';
import { useLanguage } from '@/components/Header';
import PaymentMethodSelector from './PaymentMethodSelector';
import CreditCardForm from './CreditCardForm';

interface CardInfo {
  cardNumber: string;
  cardName: string;
  expiry: string;
  cvv: string;
}

interface PaymentFormProps {
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
  cardInfo: CardInfo;
  handleCardInfoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isProcessing: boolean;
  handleBookingComplete: (e: React.FormEvent) => void;
  fee: number;
  currency: string;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  paymentMethod,
  setPaymentMethod,
  cardInfo,
  handleCardInfoChange,
  isProcessing,
  handleBookingComplete,
  fee,
  currency = 'EGP'
}) => {
  const { language } = useLanguage();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {language === 'en' ? "Payment Method" : "طريقة الدفع"}
        </CardTitle>
        <CardDescription>
          {language === 'en' 
            ? "All transactions are secure and encrypted" 
            : "جميع المعاملات آمنة ومشفرة"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <PaymentMethodSelector 
          paymentMethod={paymentMethod} 
          setPaymentMethod={setPaymentMethod} 
        />
        
        {paymentMethod === 'credit_card' && (
          <CreditCardForm 
            cardInfo={cardInfo} 
            onChange={handleCardInfoChange} 
          />
        )}
        
        {paymentMethod === 'digital_wallet' && (
          <div className="pt-2">
            <p className="text-sm text-muted-foreground mb-4">
              {language === 'en' 
                ? "You'll be redirected to complete your payment" 
                : "ستتم إعادة توجيهك لإكمال الدفع"}
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex-col space-y-2">
        <Button 
          className="w-full" 
          disabled={isProcessing}
          onClick={handleBookingComplete}
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {language === 'en' ? "Processing..." : "جارٍ المعالجة..."}
            </>
          ) : (
            <>
              {language === 'en' 
                ? `Pay Now ${fee} ${currency}` 
                : `ادفع الآن ${fee} ${currency === 'EGP' ? "جنيه مصري" : currency}`}
            </>
          )}
        </Button>
        <p className="text-xs text-center text-muted-foreground">
          {language === 'en' 
            ? "By proceeding, you agree to our terms and cancellation policy" 
            : "بالمتابعة، فإنك توافق على شروطنا وسياسة الإلغاء"}
        </p>
      </CardFooter>
    </Card>
  );
};

export default PaymentForm;
