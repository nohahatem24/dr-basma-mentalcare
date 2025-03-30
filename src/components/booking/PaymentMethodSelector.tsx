
import React from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useLanguage } from '@/components/Header';

// Payment method icons
const Visa = () => (
  <div className="px-2 py-1 border rounded bg-white">
    <span className="font-bold text-blue-800">VISA</span>
  </div>
);

const Mastercard = () => (
  <div className="px-2 py-1 border rounded bg-white">
    <span className="font-bold text-red-500">MC</span>
  </div>
);

interface PaymentMethodSelectorProps {
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  paymentMethod,
  setPaymentMethod
}) => {
  const { language } = useLanguage();
  
  return (
    <RadioGroup 
      defaultValue="credit_card" 
      value={paymentMethod}
      onValueChange={setPaymentMethod}
      className="space-y-3"
    >
      <div className="flex items-center space-x-2 rounded-md border p-3">
        <RadioGroupItem value="credit_card" id="credit_card" />
        <Label htmlFor="credit_card" className="flex-1 cursor-pointer">
          <div className="flex justify-between items-center">
            <span>{language === 'en' ? "Credit/Debit Card" : "بطاقة ائتمان/خصم"}</span>
            <div className="flex space-x-1">
              <Visa />
              <Mastercard />
            </div>
          </div>
        </Label>
      </div>
      
      <div className="flex items-center space-x-2 rounded-md border p-3">
        <RadioGroupItem value="digital_wallet" id="digital_wallet" />
        <Label htmlFor="digital_wallet" className="flex-1 cursor-pointer">
          <div className="flex justify-between items-center">
            <span>{language === 'en' ? "Digital Wallet" : "محفظة رقمية"}</span>
          </div>
        </Label>
      </div>
    </RadioGroup>
  );
};

export default PaymentMethodSelector;
