import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { format } from 'date-fns';
import BassmaAdelImage from '@/assets/images/BassmaAdel.jpg';

const DoctorProfile = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const calculateExperienceYears = () => {
    const startYear = 2016;
    const currentYear = new Date().getFullYear();
    return currentYear - startYear;
  };

  const [selectedDuration, setSelectedDuration] = useState<'30' | '60'>('30');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [doctorOnline, setDoctorOnline] = useState<boolean>(true);
  
  const [customDate, setCustomDate] = useState<Date | undefined>(new Date());
  const [customTime, setCustomTime] = useState<string>("");
  const [customNotes, setCustomNotes] = useState<string>("");
  const [customDuration, setCustomDuration] = useState<'30' | '60'>('30');
  const [defaultValue, setDefaultValue] = useState<"calendar" | "custom">("calendar");
  const [bookedSlots, setBookedSlots] = useState<string[]>([]); // This would come from your backend

  interface TimeSlot {
    startTime: string;
    endTime: string;
    duration: '30' | '60';
  }

  const defaultTimeSlots: TimeSlot[] = [
    { startTime: "05:59 PM", endTime: "06:29 PM", duration: "30" },
    { startTime: "06:29 PM", endTime: "06:59 PM", duration: "30" },
    { startTime: "06:59 PM", endTime: "07:29 PM", duration: "30" },
    { startTime: "07:29 PM", endTime: "07:59 PM", duration: "30" },
    { startTime: "07:59 PM", endTime: "08:59 PM", duration: "60" },
    { startTime: "08:59 PM", endTime: "09:59 PM", duration: "60" },
    { startTime: "09:59 PM", endTime: "10:59 PM", duration: "60" },
    { startTime: "10:59 PM", endTime: "11:59 PM", duration: "60" },
  ];

  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);

  // Update available slots when date or duration changes
  useEffect(() => {
    if (!selectedDate) return;

    const today = new Date();
    const selected = new Date(selectedDate);
    selected.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    let filteredSlots = defaultTimeSlots.filter(slot => slot.duration === selectedDuration);

    if (selected.getTime() === today.getTime()) {
      // If selected date is today, only show future time slots
      const currentTime = new Date();
      const currentHour = currentTime.getHours();
      const currentMinute = currentTime.getMinutes();
      
      filteredSlots = filteredSlots.filter(slot => {
        const [time, period] = slot.startTime.split(' ');
        const [hours, minutes] = time.split(':').map(Number);
        
        // Convert slot time to 24-hour format
        let slotHour = hours;
        if (period === 'PM' && hours !== 12) slotHour += 12;
        else if (period === 'AM' && hours === 12) slotHour = 0;
        
        // Compare hours and minutes
        if (slotHour > currentHour) return true;
        if (slotHour === currentHour && minutes > currentMinute + 15) return true;
        return false;
      });
    } else if (selected.getTime() < today.getTime()) {
      // Past dates show no slots
      filteredSlots = [];
    }

    setAvailableSlots(filteredSlots);
    setSelectedSlot(null);
  }, [selectedDate, selectedDuration]);

  const handleSlotSelection = (slot: TimeSlot) => {
    const slotDateTime = new Date(selectedDate!);
    const [time, period] = slot.startTime.split(' ');
    const [hours, minutes] = time.split(':').map(Number);
    
    // Convert to 24 hour format
    let slotHour = hours;
    if (period === 'PM' && hours !== 12) slotHour += 12;
    else if (period === 'AM' && hours === 12) slotHour = 0;
    
    slotDateTime.setHours(slotHour, minutes, 0, 0);

    // Check if slot is at least 15 minutes in the future
    const minTime = new Date(Date.now() + 15 * 60000);
    if (slotDateTime <= minTime) {
      toast({
        title: language === 'en' ? "Invalid Time Slot" : "موعد غير صالح",
        description: language === 'en' 
          ? "Please select a time slot at least 15 minutes from now" 
          : "يرجى اختيار موعد يبعد 15 دقيقة على الأقل من الآن",
        variant: "destructive",
      });
      return;
    }

    setSelectedSlot(`${slot.startTime}-${slot.endTime}`);
    setSelectedDuration(slot.duration);
  };

  const handleDurationChange = (duration: '30' | '60') => {
    setSelectedDuration(duration);
    setSelectedSlot(null); // Reset selected slot when duration changes
  };

  const getFeeByDuration = (duration: '30' | '60', isCustomRequest: boolean = false) => {
    if (isCustomRequest) {
      return duration === '30' ? 260 : 430;
    }
    return duration === '30' ? 200 : 340;
  };

  const bookAppointment = () => {
    if (!selectedSlot) {
      toast({
        title: language === 'en' ? "Select a time slot" : "اختر موعداً",
        description: language === 'en' ? "Please select an available time slot" : "يرجى اختيار وقت متاح",
        variant: "destructive",
      });
      return;
    }

    const [startTimeStr] = selectedSlot.split('-');
    const [time, period] = startTimeStr.trim().split(' ');
    const [hours, minutes] = time.split(':').map(Number);
    
    const startTime = new Date(selectedDate!);
    let startHour = hours;
    if (period === 'PM' && hours !== 12) startHour += 12;
    else if (period === 'AM' && hours === 12) startHour = 0;
    startTime.setHours(startHour, minutes, 0, 0);
    
    const endTime = new Date(startTime.getTime() + (selectedDuration === '30' ? 30 : 60) * 60000);

    navigate('/payment', { 
      state: { 
        date: selectedDate,
        startTime: format(startTime, 'hh:mm a'),
        endTime: format(endTime, 'hh:mm a'),
        duration: selectedDuration,
        doctorName: "Dr. Bassma Adel",
        fee: getFeeByDuration(selectedDuration, false),
        appointmentType: "standard",
        currency: "EGP"
      } 
    });
  };

  const isTimeValid = (time: string, date: Date) => {
    const now = new Date();
    const selectedDateTime = new Date(date);
    const [hours, minutes] = time.split(':').map(Number);
    selectedDateTime.setHours(hours, minutes, 0, 0);

    // Check if time is at least 15 minutes in the future
    const minTime = new Date(now.getTime() + 15 * 60000);
    return selectedDateTime > minTime;
  };

  const isSlotBooked = (startTime: string, endTime: string, date: Date) => {
    // This would need to be integrated with your backend
    // For now, we'll use the bookedSlots array
    const slotKey = `${date.toDateString()}-${startTime}-${endTime}`;
    return bookedSlots.includes(slotKey);
  };

  const handleCustomTimeChange = (time: string) => {
    setCustomTime(time);
    if (customDate && time) {
      if (!isTimeValid(time, customDate)) {
        toast({
          title: language === 'en' ? "Invalid Time" : "وقت غير صالح",
          description: language === 'en' 
            ? "Please select a time at least 15 minutes from now" 
            : "يرجى اختيار وقت يبعد 15 دقيقة على الأقل من الآن",
          variant: "destructive",
        });
      }
    }
  };

  const sendCustomRequest = () => {
    if (!customDate || !customTime) {
      toast({
        title: language === 'en' ? "Missing information" : "معلومات ناقصة",
        description: language === 'en' ? "Please select both date and time" : "يرجى تحديد التاريخ والوقت",
        variant: "destructive",
      });
      return;
    }

    if (!isTimeValid(customTime, customDate)) {
      toast({
        title: language === 'en' ? "Invalid Time" : "وقت غير صالح",
        description: language === 'en' 
          ? "Please select a time at least 15 minutes from now" 
          : "يرجى اختيار وقت يبعد 15 دقيقة على الأقل من الآن",
        variant: "destructive",
      });
      return;
    }

    const [hours, minutes] = customTime.split(':').map(Number);
    const startTime = new Date(customDate);
    startTime.setHours(hours, minutes, 0, 0);
    const endTime = new Date(startTime.getTime() + (customDuration === '30' ? 30 : 60) * 60000);

    // Here you would send the request to your backend with the calculated times
    toast({
      title: language === 'en' ? "Request Sent" : "تم إرسال الطلب",
      description: language === 'en' 
        ? `Request sent for ${format(startTime, 'hh:mm a')} - ${format(endTime, 'hh:mm a')}` 
        : `تم إرسال الطلب للفترة ${format(endTime, 'hh:mm a')} - ${format(startTime, 'hh:mm a')}`,
    });
  };

  const requestImmediateSession = () => {
    const startTime = new Date(Date.now() + 15 * 60000); // 15 minutes from now
    const endTime = new Date(startTime.getTime() + 30 * 60000); // 30 minutes session

    if (!doctorOnline) {
      toast({
        title: language === 'en' ? "Doctor Offline" : "الطبيب غير متصل",
        description: language === 'en' 
          ? "Immediate sessions are only available when the doctor is online" 
          : "الجلسات الفورية متاحة فقط عندما يكون الطبيب متصل",
        variant: "destructive",
      });
      return;
    }

    navigate('/payment', { 
      state: { 
        doctorName: "Dr. Bassma Adel",
        fee: 260, // Fixed price for immediate sessions
        duration: '30', // Only 30 minutes for immediate sessions
        appointmentType: "immediate",
        date: startTime,
        startTime: format(startTime, 'hh:mm a'),
        endTime: format(endTime, 'hh:mm a'),
        currency: "EGP"
      } 
    });
  };

  const doctorInfo = {
    name: language === 'en' ? "Dr. Bassma Adel" : "د. بسمة عادل",
    title: language === 'en' ? "Clinical Psychologist" : "أخصائية نفسية سريرية",
    bio: language === 'en'
      ? `Dr. Bassma Adel is a licensed clinical psychologist with over ${calculateExperienceYears()} years of experience, specializing in cognitive-behavioral therapy (CBT), anxiety disorders, depression, and personality disorders. She has helped numerous patients improve their mental well-being through evidence-based therapy.`
      : `د. بسمة عادل هي أخصائية نفسية سريرية مرخصة تتمتع بخبرة تزيد عن ${calculateExperienceYears()} سنوات، متخصصة في العلاج المعرفي السلوكي (CBT)، واضطرابات القلق، والاكتئاب، والاكتئاب، واضطرابات الشخصية. ساعدت العديد من المرضى على تحسين صحتهم النفسية من خلال العلاج القائم على الأدلة.`,
    certifications: [
      language === 'en' ? "Master's in Positive Psychology – Mansoura University" : "ماجستير في علم النفس الإيجابي - جامعة المنصورة",
      language === 'en' ? "Licensed Clinical Psychologist" : "أخصائية نفسية سريرية مرخصة",
      language === 'en' ? "Certified CBT Specialist" : "متخصصة معتمدة في العلاج المعرفي السلوكي",
      language === 'en' ? "Member of the Egyptian Association for Psychotherapists" : "عضو في الجمعية المصرية للمعالجين النفسيين"
    ],
    rating: 4.9,
    reviewCount: 87
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="col-span-1">
            <CardHeader className="text-center">
              <Avatar className="h-24 w-24 mx-auto">
                <img src={BassmaAdelImage} alt={doctorInfo.name} className="h-full w-full object-cover" />
              </Avatar>
              
              <CardTitle className="mt-4">{doctorInfo.name}</CardTitle>
              <CardDescription>{doctorInfo.title}</CardDescription>
              
              <div className="flex justify-center items-center mt-2">
                <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                <span className="ml-1 font-medium">{doctorInfo.rating}</span>
                <span className="ml-1 text-muted-foreground">({doctorInfo.reviewCount})</span>
              </div>
              
              <Badge 
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
                <ul className="text-sm text-muted-foreground space-y-2">
                  {doctorInfo.certifications.map((cert, index) => (
                    <li key={index} className="flex items-center">
                      <CheckCircle className="h-5 w-5 mr-2 text-primary flex-shrink-0" />
                      <span>{cert}</span>
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
          
          <Card className="col-span-1 lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">
                {language === 'en' ? "Book an Appointment" : "حجز موعد"}
              </CardTitle>
              <CardDescription className="text-lg text-muted-foreground">
                {language === 'en' 
                  ? "Select a date and time for your session with Dr. Bassma" 
                  : "اختر تاريخًا ووقتًا لجلستك مع الدكتورة بسمة"}
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <Tabs value={defaultValue} onValueChange={(value) => setDefaultValue(value as "calendar" | "custom")} className="w-full">
                <div className="flex gap-4 mb-6">
                  <Button
                    variant={defaultValue === "calendar" ? "default" : "outline"}
                    className={`flex items-center gap-2 rounded-full px-6 py-2 transition-all duration-200 ${
                      defaultValue === "calendar" 
                        ? "bg-primary text-primary-foreground shadow-md" 
                        : "hover:bg-primary/10"
                    }`}
                    onClick={() => setDefaultValue("calendar")}
                  >
                    <CalendarIcon className="h-4 w-4" />
                    {language === 'en' ? "Select Date" : "اختر التاريخ"}
                  </Button>
                  <Button
                    variant={defaultValue === "custom" ? "default" : "outline"}
                    className={`flex items-center gap-2 rounded-full px-6 py-2 transition-all duration-200 ${
                      defaultValue === "custom" 
                        ? "bg-primary text-primary-foreground shadow-md" 
                        : "hover:bg-primary/10"
                    }`}
                    onClick={() => setDefaultValue("custom")}
                  >
                    <Clock className="h-4 w-4" />
                    {language === 'en' ? "Request Custom Time" : "طلب وقت مخصص"}
                  </Button>
                </div>
                
                <TabsContent value="calendar" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => {
                          setSelectedDate(date);
                          setSelectedSlot(null);
                        }}
                        className="rounded-lg border shadow-sm w-full max-w-[360px] mx-auto"
                        classNames={{
                          head_row: "flex w-full",
                          head_cell: "w-full text-muted-foreground font-medium text-sm rounded-md m-0.5 text-center",
                          row: "flex w-full mt-1",
                          cell: "w-full text-center relative p-0 focus-within:relative focus-within:z-20",
                          day: "h-10 w-10 p-0 font-normal text-sm aria-selected:opacity-100 hover:bg-primary/10 rounded-full mx-auto",
                          day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground rounded-full",
                          day_today: "bg-accent text-accent-foreground rounded-full",
                          day_outside: "text-muted-foreground opacity-50",
                          day_disabled: "text-muted-foreground opacity-50",
                          day_hidden: "invisible",
                          nav_button: "h-7 w-7 bg-transparent hover:bg-primary/10 rounded-full transition-colors",
                          nav_button_previous: "absolute left-2 top-3",
                          nav_button_next: "absolute right-2 top-3",
                          caption: "relative text-base font-medium py-3 px-10",
                          caption_label: "text-center",
                          table: "w-full border-collapse space-y-1",
                        }}
                        disabled={(date) => {
                          const today = new Date();
                          today.setHours(0, 0, 0, 0);
                          return date < today;
                        }}
                      />

                      {availableSlots.length === 0 && (
                        <div className="text-center text-muted-foreground p-4 bg-muted/10 rounded-lg">
                          {language === 'en' 
                            ? "No available time slots for this date" 
                            : "لا توجد مواعيد متاحة في هذا التاريخ"}
                        </div>
                      )}

                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">
                          {language === 'en' ? "Session Duration" : "مدة الجلسة"}
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                          <Button
                            variant={selectedDuration === '30' ? "default" : "outline"}
                            onClick={() => handleDurationChange('30')}
                            className={`h-auto py-4 ${selectedDuration === '30' ? 'bg-primary text-white' : ''}`}
                          >
                            <div className="text-center">
                              <div className="font-semibold">30 {language === 'en' ? "Minutes" : "دقيقة"}</div>
                              <div className="text-sm">{getFeeByDuration('30')} {language === 'en' ? "EGP" : "جنيه"}</div>
                            </div>
                          </Button>
                          <Button
                            variant={selectedDuration === '60' ? "default" : "outline"}
                            onClick={() => handleDurationChange('60')}
                            className={`h-auto py-4 ${selectedDuration === '60' ? 'bg-primary text-white' : ''}`}
                          >
                            <div className="text-center">
                              <div className="font-semibold">60 {language === 'en' ? "Minutes" : "دقيقة"}</div>
                              <div className="text-sm">{getFeeByDuration('60')} {language === 'en' ? "EGP" : "جنيه"}</div>
                            </div>
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">
                        {language === 'en' ? "Available Time Slots" : "الأوقات المتاحة"}
                      </h3>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {availableSlots.map((slot, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            onClick={() => handleSlotSelection(slot)}
                            className={`
                              relative flex flex-col items-center justify-center 
                              w-full min-h-[80px] p-2 rounded-lg 
                              hover:border-primary hover:bg-primary/5
                              transition-all duration-200 overflow-hidden
                              ${selectedSlot === `${slot.startTime}-${slot.endTime}` 
                                ? 'border-2 border-primary bg-primary/10 shadow-[0_0_0_2px_rgba(var(--primary),.2)]' 
                                : 'border hover:shadow-sm'
                              }
                            `}
                          >
                            <div className="text-center w-full px-1">
                              <div className="font-medium text-[11px] sm:text-xs break-words leading-tight">
                                {slot.startTime}-{slot.endTime}
                              </div>
                              <div className="text-[10px] text-muted-foreground mt-1">
                                {slot.duration} mins
                              </div>
                            </div>
                          </Button>
                        ))}
                      </div>
                      
                      <Button 
                        className={`
                          w-full mt-6 py-6 text-lg font-semibold rounded-lg
                          transition-all duration-200
                          ${selectedSlot 
                            ? 'bg-primary hover:bg-primary/90 transform hover:scale-[1.02]' 
                            : 'bg-muted text-muted-foreground cursor-not-allowed'
                          }
                        `}
                        onClick={bookAppointment}
                        disabled={!selectedSlot}
                      >
                        {language === 'en' 
                          ? selectedSlot 
                            ? "Book Appointment" 
                            : "Select a Time Slot"
                          : selectedSlot
                            ? "حجز موعد"
                            : "اختر موعداً"
                        }
                      </Button>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="custom">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <Calendar
                          mode="single"
                          selected={customDate}
                          onSelect={setCustomDate}
                        className="rounded-lg border shadow-sm w-full max-w-[360px] mx-auto"
                        classNames={{
                          head_row: "flex w-full",
                          head_cell: "w-full text-muted-foreground font-medium text-sm rounded-md m-0.5 text-center",
                          row: "flex w-full mt-1",
                          cell: "w-full text-center relative p-0 focus-within:relative focus-within:z-20",
                          day: "h-10 w-10 p-0 font-normal text-sm aria-selected:opacity-100 hover:bg-primary/10 rounded-full mx-auto",
                          day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground rounded-full",
                          day_today: "bg-accent text-accent-foreground rounded-full",
                          day_outside: "text-muted-foreground opacity-50",
                          day_disabled: "text-muted-foreground opacity-50",
                          day_hidden: "invisible",
                          nav_button: "h-7 w-7 bg-transparent hover:bg-primary/10 rounded-full transition-colors",
                          nav_button_previous: "absolute left-2 top-3",
                          nav_button_next: "absolute right-2 top-3",
                          caption: "relative text-base font-medium py-3 px-10",
                          caption_label: "text-center",
                          table: "w-full border-collapse space-y-1",
                        }}
                          disabled={(date) => date < new Date()}
                        />
                      </div>
                      
                    <div className="space-y-6">
                      <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          {language === 'en' ? "Preferred Time" : "الوقت المفضل"}
                        </label>
                        <Input 
                          type="time"
                          value={customTime}
                            onChange={(e) => handleCustomTimeChange(e.target.value)}
                            className="w-full"
                        />
                      </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">
                            {language === 'en' ? "Session Duration" : "مدة الجلسة"}
                          </label>
                          <div className="grid grid-cols-2 gap-4">
                            <Button
                              variant={customDuration === '30' ? "default" : "outline"}
                              onClick={() => setCustomDuration('30')}
                              className={`h-auto py-4 ${customDuration === '30' ? 'bg-primary text-white' : ''}`}
                            >
                              <div className="text-center">
                                <div className="font-semibold">30 {language === 'en' ? "Minutes" : "دقيقة"}</div>
                                <div className="text-sm">{getFeeByDuration('30', true)} {language === 'en' ? "EGP" : "جنيه"}</div>
                              </div>
                            </Button>
                            <Button
                              variant={customDuration === '60' ? "default" : "outline"}
                              onClick={() => setCustomDuration('60')}
                              className={`h-auto py-4 ${customDuration === '60' ? 'bg-primary text-white' : ''}`}
                            >
                              <div className="text-center">
                                <div className="font-semibold">60 {language === 'en' ? "Minutes" : "دقيقة"}</div>
                                <div className="text-sm">{getFeeByDuration('60', true)} {language === 'en' ? "EGP" : "جنيه"}</div>
                              </div>
                            </Button>
                          </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          {language === 'en' ? "Additional Notes" : "ملاحظات إضافية"}
                        </label>
                        <Textarea 
                          value={customNotes}
                          onChange={(e) => setCustomNotes(e.target.value)}
                          placeholder={language === 'en' 
                            ? "Any specific requirements or preferences" 
                            : "أي متطلبات أو تفضيلات محددة"}
                          rows={3}
                        />
                      </div>
                      
                      <p className="text-sm text-muted-foreground">
                        {language === 'en' 
                          ? "Dr. Bassma will review your request and confirm if she can accommodate your preferred time." 
                            : "ستراجع د. بسمة طلبك وتؤكد ما إذا كان بإمكانها استيعاب الوقت المفضل لديك."}
                        </p>

                        <Button 
                          className="w-full py-6 text-lg font-semibold"
                          onClick={sendCustomRequest}
                          disabled={!customDate || !customTime}
                        >
                        {language === 'en' ? "Send Request" : "إرسال الطلب"}
                      </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
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
    </div>
  );
};

export default DoctorProfile;
