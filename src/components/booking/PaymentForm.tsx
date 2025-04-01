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
  paymentMethod,
  setPaymentMethod,
  cardInfo,
  onCardInfoChange,
  isProcessing,
  onBookingComplete,
  fee
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onBookingComplete} className="space-y-4">
          <div className="space-y-2">
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              <option value="credit_card">Credit Card</option>
              <option value="debit_card">Debit Card</option>
            </select>
          </div>

          <Input
            type="text"
            name="cardNumber"
            value={cardInfo.cardNumber}
            onChange={onCardInfoChange}
            placeholder="Card Number"
          />
          <Input
            type="text"
            name="cardName"
            value={cardInfo.cardName}
            onChange={onCardInfoChange}
            placeholder="Name on Card"
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              type="text"
              name="expiry"
              value={cardInfo.expiry}
              onChange={onCardInfoChange}
              placeholder="MM/YY"
            />
            <Input
              type="text"
              name="cvv"
              value={cardInfo.cvv}
              onChange={onCardInfoChange}
              placeholder="CVV"
            />
          </div>
          <Button
            type="submit"
            disabled={isProcessing}
            className="w-full"
          >
            {isProcessing ? "Processing..." : `Pay $${fee}`}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PaymentForm;
