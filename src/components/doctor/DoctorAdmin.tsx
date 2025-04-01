
import React, { useState } from 'react';
import { useLanguage } from '@/components/Header';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Clock, Plus, X, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TimeSlot {
  id: string;
  date: string;
  time: string;
  isAvailable: boolean;
}

const DoctorAdmin = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([
    { id: '1', date: new Date().toISOString().split('T')[0], time: '09:00 AM', isAvailable: true },
    { id: '2', date: new Date().toISOString().split('T')[0], time: '10:00 AM', isAvailable: false },
    { id: '3', date: new Date().toISOString().split('T')[0], time: '11:00 AM', isAvailable: true },
  ]);
  const [newTime, setNewTime] = useState('');
  
  const handleAddTimeSlot = () => {
    if (!selectedDate || !newTime) return;
    
    const formattedDate = selectedDate.toISOString().split('T')[0];
    const newSlot: TimeSlot = {
      id: Date.now().toString(),
      date: formattedDate,
      time: newTime,
      isAvailable: true
    };
    
    setTimeSlots([...timeSlots, newSlot]);
    setNewTime('');
    
    toast({
      title: language === 'en' ? 'Time Slot Added' : 'تمت إضافة الموعد',
      description: language === 'en' 
        ? `Added ${newTime} on ${formattedDate}` 
        : `تمت إضافة ${newTime} في ${formattedDate}`
    });
  };
  
  const handleRemoveTimeSlot = (id: string) => {
    setTimeSlots(timeSlots.filter(slot => slot.id !== id));
    
    toast({
      title: language === 'en' ? 'Time Slot Removed' : 'تمت إزالة الموعد',
    });
  };
  
  const handleToggleAvailability = (id: string) => {
    setTimeSlots(timeSlots.map(slot => 
      slot.id === id ? {...slot, isAvailable: !slot.isAvailable} : slot
    ));
  };
  
  const filteredTimeSlots = selectedDate 
    ? timeSlots.filter(slot => slot.date === selectedDate.toISOString().split('T')[0])
    : [];
    
  const timeOptions = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
  ];
  
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">
        {language === 'en' ? 'Doctor Admin Panel' : 'لوحة تحكم الطبيب'}
      </h1>
      
      <Card>
        <CardHeader>
          <CardTitle>
            {language === 'en' ? 'Manage Appointment Slots' : 'إدارة مواعيد الحجز'}
          </CardTitle>
          <CardDescription>
            {language === 'en' 
              ? 'Add, remove, or modify available appointment slots' 
              : 'إضافة أو إزالة أو تعديل مواعيد الحجز المتاحة'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-2">
                {language === 'en' ? 'Select Date' : 'اختر التاريخ'}
              </h3>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
                disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
              />
            </div>
            
            <div>
              <h3 className="font-medium mb-4">
                {language === 'en' ? 'Time Slots' : 'المواعيد'}
              </h3>
              
              {/* Form to add new slot */}
              <div className="flex gap-2 mb-6">
                <select 
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                >
                  <option value="">{language === 'en' ? 'Select time' : 'اختر الوقت'}</option>
                  {timeOptions.map(time => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
                <Button 
                  type="button" 
                  onClick={handleAddTimeSlot}
                  disabled={!newTime || !selectedDate}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  {language === 'en' ? 'Add' : 'إضافة'}
                </Button>
              </div>
              
              {/* List of time slots */}
              {filteredTimeSlots.length === 0 ? (
                <p className="text-muted-foreground">
                  {language === 'en' 
                    ? 'No time slots added for this date' 
                    : 'لم تتم إضافة مواعيد لهذا التاريخ'}
                </p>
              ) : (
                <div className="space-y-2">
                  {filteredTimeSlots.map(slot => (
                    <div key={slot.id} className="flex items-center justify-between p-3 border rounded-md">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{slot.time}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant={slot.isAvailable ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleToggleAvailability(slot.id)}
                        >
                          {slot.isAvailable ? 
                            (<><Check className="h-4 w-4 mr-1" />{language === 'en' ? 'Available' : 'متاح'}</>) : 
                            (language === 'en' ? 'Mark Available' : 'جعله متاحًا')}
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="icon"
                          onClick={() => handleRemoveTimeSlot(slot.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DoctorAdmin;
