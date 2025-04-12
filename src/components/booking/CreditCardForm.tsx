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
          <div className="grid grid-cols-2 gap-2">
            <select 
              id="expiryMonth"
              name="expiryMonth"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              onChange={(e) => {
                const month = e.target.value.padStart(2, '0');
                const year = cardInfo.expiry.split('/')[1] || '';
                onChange({
                  target: {
                    name: 'expiry',
                    value: `${month}/${year}`
                  }
                } as React.ChangeEvent<HTMLInputElement>);
              }}
              value={cardInfo.expiry.split('/')[0] || ''}
            >
              <option value="" disabled>{language === 'en' ? 'MM' : 'شهر'}</option>
              {Array.from({ length: 12 }, (_, i) => {
                const month = String(i + 1).padStart(2, '0');
                return (
                  <option key={month} value={month}>
                    {month}
                  </option>
                );
              })}
            </select>
            
            <select 
              id="expiryYear"
              name="expiryYear"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              onChange={(e) => {
                const month = cardInfo.expiry.split('/')[0] || '';
                const year = e.target.value.slice(-2);
                onChange({
                  target: {
                    name: 'expiry',
                    value: `${month}/${year}`
                  }
                } as React.ChangeEvent<HTMLInputElement>);
              }}
              value={cardInfo.expiry.split('/')[1] ? `20${cardInfo.expiry.split('/')[1]}` : ''}
            >
              <option value="" disabled>{language === 'en' ? 'YY' : 'سنة'}</option>
              {Array.from({ length: 10 }, (_, i) => {
                const year = new Date().getFullYear() + i;
                return (
                  <option key={year} value={year}>
                    {year}
                  </option>
                );
              })}
            </select>
          </div>
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
