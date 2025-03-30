
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar } from "@/components/ui/avatar";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from '@/components/Header';
import DoctorReviews from '@/components/DoctorReviews';
import { Star, Video, Clock, Calendar as CalendarIcon, CheckCircle } from 'lucide-react';

const DoctorProfile = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [availableSlots, setAvailableSlots] = useState<string[]>([
    "9:00 AM", "10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM", "4:00 PM"
  ]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [doctorOnline, setDoctorOnline] = useState<boolean>(true);

  const bookAppointment = () => {
    if (!selectedSlot) {
      toast({
        title: language === 'en' ? "Select a time slot" : "اختر موعداً",
        description: language === 'en' ? "Please select an available time slot" : "يرجى اختيار وقت متاح",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: language === 'en' ? "Appointment Booked" : "تم حجز الموعد",
      description: language === 'en' 
        ? `Your appointment is confirmed for ${selectedDate?.toLocaleDateString()} at ${selectedSlot}` 
        : `تم تأكيد موعدك في ${selectedDate?.toLocaleDateString()} الساعة ${selectedSlot}`,
    });
  };

  const requestImmediateSession = () => {
    toast({
      title: language === 'en' ? "Request Sent" : "تم إرسال الطلب",
      description: language === 'en' 
        ? "Your request for an immediate session has been sent to Dr. Bassma" 
        : "تم إرسال طلبك للجلسة الفورية إلى الدكتورة بسمة",
    });
  };

  // Doctor information
  const doctorInfo = {
    name: language === 'en' ? "Dr. Bassma Adel" : "د. بسمة عادل",
    title: language === 'en' ? "Clinical Psychologist" : "أخصائية نفسية سريرية",
    bio: language === 'en' 
      ? "Dr. Bassma is a licensed clinical psychologist with over 10 years of experience specializing in cognitive behavioral therapy, anxiety disorders, and depression. She has helped hundreds of patients improve their mental well-being through evidence-based therapeutic approaches." 
      : "د. بسمة هي أخصائية نفسية سريرية مرخصة تتمتع بخبرة تزيد عن 10 سنوات متخصصة في العلاج المعرفي السلوكي واضطرابات القلق والاكتئاب. ساعدت مئات المرضى على تحسين صحتهم النفسية من خلال أساليب علاجية قائمة على الأدلة.",
    certifications: [
      language === 'en' ? "Ph.D. in Clinical Psychology" : "دكتوراه في علم النفس السريري",
      language === 'en' ? "Licensed Clinical Psychologist" : "أخصائية نفسية سريرية مرخصة",
      language === 'en' ? "Certified CBT Specialist" : "متخصصة معتمدة في العلاج المعرفي السلوكي",
      language === 'en' ? "Member of the American Psychological Association" : "عضو في الجمعية الأمريكية لعلم النفس"
    ],
    rating: 4.9,
    reviewCount: 87
  };

  return (
    <div className="container py-8 md:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Doctor Profile Card */}
        <Card className="col-span-1">
          <CardHeader className="text-center">
            <Avatar className="h-24 w-24 mx-auto">
              <img src="/placeholder.svg" alt={doctorInfo.name} className="h-full w-full object-cover" />
            </Avatar>
            
            <CardTitle className="mt-4">{doctorInfo.name}</CardTitle>
            <CardDescription>{doctorInfo.title}</CardDescription>
            
            <div className="flex justify-center items-center mt-2">
              <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
              <span className="ml-1 font-medium">{doctorInfo.rating}</span>
              <span className="ml-1 text-muted-foreground">({doctorInfo.reviewCount})</span>
            </div>
            
            <Badge 
              variant={doctorOnline ? "default" : "outline"} 
              className={`mt-3 ${doctorOnline ? "bg-green-500 hover:bg-green-600" : ""}`}
            >
              {doctorOnline 
                ? (language === 'en' ? "Available Now" : "متاحة الآن") 
                : (language === 'en' ? "Offline" : "غير متصلة")}
            </Badge>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">{language === 'en' ? "About" : "نبذة"}</h3>
              <p className="text-sm text-muted-foreground">{doctorInfo.bio}</p>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">{language === 'en' ? "Certifications" : "الشهادات"}</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                {doctorInfo.certifications.map((cert, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-primary" />
                    {cert}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
          
          {doctorOnline && (
            <CardFooter>
              <Button 
                className="w-full"
                onClick={requestImmediateSession}
              >
                <Video className="mr-2 h-4 w-4" />
                {language === 'en' ? "Request Immediate Session" : "طلب جلسة فورية"}
              </Button>
            </CardFooter>
          )}
        </Card>
        
        {/* Appointment Booking */}
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>{language === 'en' ? "Book an Appointment" : "حجز موعد"}</CardTitle>
            <CardDescription>
              {language === 'en' 
                ? "Select a date and time for your session with Dr. Bassma" 
                : "اختر تاريخًا ووقتًا لجلستك مع الدكتورة بسمة"}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Tabs defaultValue="calendar" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="calendar">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  {language === 'en' ? "Select Date" : "اختر التاريخ"}
                </TabsTrigger>
                <TabsTrigger value="custom">
                  <Clock className="h-4 w-4 mr-2" />
                  {language === 'en' ? "Request Custom Time" : "طلب وقت مخصص"}
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="calendar" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="flex justify-center">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      className="rounded-md border"
                      disabled={(date) => 
                        date < new Date() || 
                        date.getDay() === 0 || 
                        date.getDay() === 6
                      }
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-medium">
                      {language === 'en' ? "Available Time Slots" : "الأوقات المتاحة"}
                    </h3>
                    
                    <div className="grid grid-cols-2 gap-2">
                      {availableSlots.map((slot) => (
                        <Button
                          key={slot}
                          variant={selectedSlot === slot ? "default" : "outline"}
                          onClick={() => setSelectedSlot(slot)}
                          className="justify-center"
                        >
                          {slot}
                        </Button>
                      ))}
                    </div>
                    
                    <Button 
                      className="w-full mt-4" 
                      onClick={bookAppointment}
                    >
                      {language === 'en' ? "Book Appointment" : "حجز موعد"}
                    </Button>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="custom">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {language === 'en' ? "Request Custom Appointment" : "طلب موعد مخصص"}
                    </CardTitle>
                    <CardDescription>
                      {language === 'en' 
                        ? "If none of the available times work for you, send a custom request" 
                        : "إذا لم تكن أي من الأوقات المتاحة مناسبة لك، أرسل طلبًا مخصصًا"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Custom request form would go here */}
                    <p className="text-sm text-muted-foreground">
                      {language === 'en' 
                        ? "Dr. Bassma will review your request and confirm if she can accommodate your preferred time." 
                        : "ستراجع الدكتورة بسمة طلبك وتؤكد ما إذا كان بإمكانها استيعاب الوقت المفضل لديك."}
                    </p>
                    <Button className="w-full">
                      {language === 'en' ? "Send Request" : "إرسال الطلب"}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        {/* Reviews Section */}
        <Card className="col-span-1 lg:col-span-3">
          <CardHeader>
            <CardTitle>{language === 'en' ? "Patient Reviews" : "آراء المرضى"}</CardTitle>
            <CardDescription>
              {language === 'en' 
                ? "See what other patients are saying about Dr. Bassma" 
                : "انظر ماذا يقول المرضى الآخرون عن الدكتورة بسمة"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DoctorReviews />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DoctorProfile;
