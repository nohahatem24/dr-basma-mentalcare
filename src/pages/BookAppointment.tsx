
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from '@/components/Header';
import { 
  Calendar, 
  Clock, 
  CreditCard, 
  CheckCircle, 
  Lock, 
  ShieldCheck, 
  Loader2
} from 'lucide-react';

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

const BookAppointment = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // State for appointment details
  const [appointmentInfo, setAppointmentInfo] = useState({
    date: '',
    time: '',
    reason: '',
    notes: '',
  });
  
  // State for payment
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [cardInfo, setCardInfo] = useState({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: '',
  });
  
  // State for processing payment
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Selected appointment from previous page (would come from context/state in a real app)
  const selectedAppointment = {
    date: '2023-10-15',
    time: '10:00 AM',
    doctorName: 'Dr. Bassma Adel',
    fee: 120
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAppointmentInfo((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleCardInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCardInfo((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleBookingComplete = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      
      toast({
        title: language === 'en' ? "Payment Successful" : "تمت عملية الدفع بنجاح",
        description: language === 'en' 
          ? "Your appointment has been confirmed" 
          : "تم تأكيد موعدك",
      });
      
      // Redirect to confirmation page or dashboard
      navigate('/dashboard');
    }, 2000);
  };
  
  return (
    <div className="container py-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6 text-center">
        {language === 'en' ? "Complete Your Booking" : "إكمال الحجز"}
      </h1>
      
      <div className="grid gap-6">
        {/* Appointment Summary */}
        <Card>
          <CardHeader>
            <CardTitle>
              {language === 'en' ? "Appointment Summary" : "ملخص الموعد"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                {language === 'en' ? "Doctor" : "الطبيب"}:
              </span>
              <span className="font-medium">{selectedAppointment.doctorName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                {language === 'en' ? "Date" : "التاريخ"}:
              </span>
              <span className="font-medium">{selectedAppointment.date}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                {language === 'en' ? "Time" : "الوقت"}:
              </span>
              <span className="font-medium">{selectedAppointment.time}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                {language === 'en' ? "Fee" : "الرسوم"}:
              </span>
              <span className="font-medium">${selectedAppointment.fee}</span>
            </div>
          </CardContent>
        </Card>
        
        {/* Appointment Details */}
        <Card>
          <CardHeader>
            <CardTitle>
              {language === 'en' ? "Appointment Details" : "تفاصيل الموعد"}
            </CardTitle>
            <CardDescription>
              {language === 'en' 
                ? "Please provide additional information for your session" 
                : "يرجى تقديم معلومات إضافية لجلستك"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reason">
                {language === 'en' ? "Reason for Visit" : "سبب الزيارة"}
              </Label>
              <Textarea 
                id="reason"
                name="reason"
                value={appointmentInfo.reason}
                onChange={handleInputChange}
                placeholder={language === 'en' ? "Briefly describe your reason for this appointment" : "صف بإيجاز سبب هذا الموعد"}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">
                {language === 'en' ? "Additional Notes" : "ملاحظات إضافية"}
              </Label>
              <Textarea 
                id="notes"
                name="notes"
                value={appointmentInfo.notes}
                onChange={handleInputChange}
                placeholder={language === 'en' ? "Any other information you'd like to share (optional)" : "أي معلومات أخرى ترغب في مشاركتها (اختياري)"}
              />
            </div>
          </CardContent>
        </Card>
        
        {/* Payment Information */}
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
            
            {paymentMethod === 'credit_card' && (
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
                      onChange={handleCardInfoChange}
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
                    onChange={handleCardInfoChange}
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
                      onChange={handleCardInfoChange}
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
                        onChange={handleCardInfoChange}
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
                    ? `Pay Now $${selectedAppointment.fee}` 
                    : `ادفع الآن $${selectedAppointment.fee}`}
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
      </div>
    </div>
  );
};

export default BookAppointment;
