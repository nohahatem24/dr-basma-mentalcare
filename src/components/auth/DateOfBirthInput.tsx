
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/components/Header';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface DateOfBirthInputProps {
  value?: string;
  onChange: (value: string) => void;
  label?: boolean;
}

const DateOfBirthInput = ({ value, onChange, label = true }: DateOfBirthInputProps) => {
  const { language } = useLanguage();
  const [day, setDay] = useState<string>('');
  const [month, setMonth] = useState<string>('');
  const [year, setYear] = useState<string>('');
  const [manualInput, setManualInput] = useState<string>('');
  const [inputMode, setInputMode] = useState<'dropdown' | 'manual'>('dropdown');

  // Generate options for days, months, and years
  const days = Array.from({ length: 31 }, (_, i) => String(i + 1));
  const months = language === 'en' 
    ? ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    : ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => String(currentYear - i));

  // Parse the initial value
  useEffect(() => {
    if (value) {
      try {
        const date = new Date(value);
        if (!isNaN(date.getTime())) {
          setDay(String(date.getDate()));
          setMonth(String(date.getMonth() + 1));
          setYear(String(date.getFullYear()));
          setManualInput(value.split('T')[0]); // Format as YYYY-MM-DD
        }
      } catch (e) {
        console.error("Invalid date format:", e);
      }
    }
  }, [value]);

  // Function to validate and combine date parts
  const updateDateFromParts = () => {
    // Basic validation
    const dayNum = parseInt(day);
    const monthNum = parseInt(month);
    const yearNum = parseInt(year);

    if (dayNum && monthNum && yearNum) {
      // Check for valid date
      const date = new Date(yearNum, monthNum - 1, dayNum);
      
      // Validate if the date is real (e.g., not Feb 30)
      if (
        date.getFullYear() === yearNum &&
        date.getMonth() === monthNum - 1 &&
        date.getDate() === dayNum
      ) {
        // Format as YYYY-MM-DD
        const formattedDate = `${yearNum}-${monthNum.toString().padStart(2, '0')}-${dayNum.toString().padStart(2, '0')}`;
        onChange(formattedDate);
      }
    }
  };

  // Function to handle manual input
  const handleManualInputChange = (input: string) => {
    setManualInput(input);
    
    // Try to parse the date
    if (input.length >= 10) {
      try {
        // Try to parse different formats
        let date: Date | null = null;
        
        // Try DD/MM/YYYY
        if (input.includes('/')) {
          const parts = input.split('/');
          if (parts.length === 3) {
            date = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
          }
        } 
        // Try YYYY-MM-DD
        else if (input.includes('-')) {
          date = new Date(input);
        }
        
        if (date && !isNaN(date.getTime())) {
          // If valid date, update the state and call onChange
          const formattedDate = date.toISOString().split('T')[0];
          onChange(formattedDate);
        }
      } catch (e) {
        console.error("Error parsing date:", e);
      }
    }
  };

  // Update the combined date whenever individual parts change
  useEffect(() => {
    if (inputMode === 'dropdown') {
      updateDateFromParts();
    }
  }, [day, month, year]);

  const toggleInputMode = () => {
    setInputMode(inputMode === 'dropdown' ? 'manual' : 'dropdown');
  };

  return (
    <div className="space-y-2">
      {label && (
        <Label>
          {language === 'en' ? 'Date of Birth' : 'تاريخ الميلاد'}
        </Label>
      )}
      
      <div className="flex items-center mb-2">
        <button 
          type="button" 
          onClick={toggleInputMode}
          className="text-xs text-primary underline hover:text-primary/80"
        >
          {language === 'en' 
            ? `Switch to ${inputMode === 'dropdown' ? 'manual' : 'dropdown'} input` 
            : `التبديل إلى الإدخال ${inputMode === 'dropdown' ? 'اليدوي' : 'القائمة المنسدلة'}`}
        </button>
      </div>
      
      {inputMode === 'dropdown' ? (
        <div className="grid grid-cols-3 gap-2">
          <div>
            <Select value={day} onValueChange={setDay}>
              <SelectTrigger>
                <SelectValue placeholder={language === 'en' ? "Day" : "اليوم"} />
              </SelectTrigger>
              <SelectContent>
                {days.map((d) => (
                  <SelectItem key={d} value={d}>
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Select value={month} onValueChange={setMonth}>
              <SelectTrigger>
                <SelectValue placeholder={language === 'en' ? "Month" : "الشهر"} />
              </SelectTrigger>
              <SelectContent>
                {months.map((m, index) => (
                  <SelectItem key={m} value={String(index + 1)}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Select value={year} onValueChange={setYear}>
              <SelectTrigger>
                <SelectValue placeholder={language === 'en' ? "Year" : "السنة"} />
              </SelectTrigger>
              <SelectContent>
                {years.map((y) => (
                  <SelectItem key={y} value={y}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      ) : (
        <Input
          type="text"
          value={manualInput}
          onChange={(e) => handleManualInputChange(e.target.value)}
          placeholder={language === 'en' ? "DD/MM/YYYY" : "اليوم/الشهر/السنة"}
        />
      )}
      
      <p className="text-xs text-muted-foreground">
        {language === 'en' 
          ? "Please enter your date of birth"
          : "يرجى إدخال تاريخ ميلادك"}
      </p>
    </div>
  );
};

export default DateOfBirthInput;
