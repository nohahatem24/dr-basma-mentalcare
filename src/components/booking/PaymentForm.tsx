import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export interface PaymentFormProps {
  paymentMethod: string;
  setPaymentMethod: React.Dispatch<React.SetStateAction<string>>;
  cardInfo: {
    cardNumber: string;
    cardName: string;
    expiry: string;
    cvv: string;
  };
  onCardInfoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isProcessing: boolean;
  onBookingComplete: (e: React.FormEvent) => Promise<void>;
  fee: number;
}

export const PaymentForm: React.FC<PaymentFormProps> = ({
  fee,
  isProcessing,
  onBookingComplete,
  cardInfo,
  onCardInfoChange,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onBookingComplete}>
          <div className="space-y-4">
            <Input
              type="text"
              placeholder="Card Number"
              value={cardInfo.cardNumber}
              onChange={onCardInfoChange}
            />
            <Input
              type="text"
              placeholder="Card Name"
              value={cardInfo.cardName}
              onChange={onCardInfoChange}
            />
            <Input
              type="text"
              placeholder="MM/YY"
              value={cardInfo.expiry}
              onChange={onCardInfoChange}
            />
            <Input
              type="text"
              placeholder="CVC"
              value={cardInfo.cvv}
              onChange={onCardInfoChange}
            />
          </div>
          <Button type="submit" disabled={isProcessing} className="w-full">
            {isProcessing ? "Processing..." : `Pay $${fee}`}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PaymentForm;
