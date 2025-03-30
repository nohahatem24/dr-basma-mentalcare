
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, ShieldCheck } from 'lucide-react';
import { useLanguage } from '@/components/Header';

interface CardInfo {
  cardNumber: string;
  cardName: string;
  expiry: string;
  cvv: string;
}

interface CreditCardFormProps {
  cardInfo: CardInfo;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CreditCardForm: React.FC<CreditCardFormProps> = ({ cardInfo, onChange }) => {
  const { language } = useLanguage();
  
  return (
    <div className="space-y-4 pt-2">
      <div className="space-y-2">
        <Label htmlFor="cardNumber">
          {language === 'en' ? "Card Number" : "رقم البطاقة"}
        </Label>
        <div className="relative">
          <Input 
            id="cardNumber"
            name="cardNumber"
            placeholder="1234 5678 9012 3456"
            value={cardInfo.cardNumber}
            onChange={onChange}
          />
          <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="cardName">
          {language === 'en' ? "Cardholder Name" : "اسم حامل البطاقة"}
        </Label>
        <Input 
          id="cardName"
          name="cardName"
          placeholder={language === 'en' ? "John Smith" : "محمد احمد"}
          value={cardInfo.cardName}
          onChange={onChange}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="expiry">
            {language === 'en' ? "Expiry Date" : "تاريخ الانتهاء"}
          </Label>
          <Input 
            id="expiry"
            name="expiry"
            placeholder="MM/YY"
            value={cardInfo.expiry}
            onChange={onChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="cvv">
            {language === 'en' ? "CVV" : "رمز التحقق"}
          </Label>
          <div className="relative">
            <Input 
              id="cvv"
              name="cvv"
              placeholder="123"
              value={cardInfo.cvv}
              onChange={onChange}
            />
            <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      </div>
      
      <div className="flex items-center rounded-md border p-3 bg-amber-50 text-amber-900">
        <ShieldCheck className="h-5 w-5 mr-2 flex-shrink-0" />
        <p className="text-sm">
          {language === 'en' 
            ? "Your payment information is encrypted and secure" 
            : "معلومات الدفع الخاصة بك مشفرة وآمنة"}
        </p>
      </div>
    </div>
  );
};

export default CreditCardForm;
