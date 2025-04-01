import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PaymentFormProps } from '@/pages/PaymentPage';

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
            <Input type="text" placeholder="Card Number" />
            <Input type="text" placeholder="MM/YY" />
            <Input type="text" placeholder="CVC" />
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
