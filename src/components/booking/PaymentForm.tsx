import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export interface PaymentFormProps {
  fee: number;
  isProcessing: boolean;
  onPaymentComplete: () => void;
}

export const PaymentForm: React.FC<PaymentFormProps> = ({
  fee,
  isProcessing,
  onPaymentComplete,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={(e) => { e.preventDefault(); onPaymentComplete(); }}>
          <div className="space-y-4">
            <input type="text" placeholder="Card Number" className="input" />
            <input type="text" placeholder="MM/YY" className="input" />
            <input type="text" placeholder="CVC" className="input" />
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
