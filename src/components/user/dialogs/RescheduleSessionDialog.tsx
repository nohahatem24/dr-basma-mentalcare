
import React from 'react';
import { Session } from '@/types/mindtrack';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface RescheduleSessionDialogProps {
  language: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedSession: Session | null;
  isSubmitting: boolean;
  onReschedule: () => void;
  formatDate: (date: string) => string;
}

const RescheduleSessionDialog = ({
  language,
  isOpen,
  onOpenChange,
  selectedSession,
  isSubmitting,
  onReschedule,
  formatDate
}: RescheduleSessionDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {language === 'en' ? 'Reschedule Session' : 'إعادة جدولة الجلسة'}
          </DialogTitle>
          <DialogDescription>
            {language === 'en' 
              ? 'You will be redirected to the booking page to select a new date and time.' 
              : 'سيتم توجيهك إلى صفحة الحجز لاختيار تاريخ ووقت جديدين.'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <h4 className="text-sm font-medium">
              {language === 'en' ? 'Current Session:' : 'الجلسة الحالية:'}
            </h4>
            <p className="text-sm">
              {selectedSession && formatDate(selectedSession.date)}
              <br />
              {selectedSession && `${selectedSession.start_time} - ${selectedSession.end_time}`}
              <br />
              {selectedSession && `${selectedSession.duration} ${language === 'en' ? 'Minutes' : 'دقيقة'}`}
            </p>
          </div>
        </div>
        
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            {language === 'en' ? 'Cancel' : 'إلغاء'}
          </Button>
          <Button
            onClick={onReschedule}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {language === 'en' ? 'Processing...' : 'جارٍ المعالجة...'}
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                {language === 'en' ? 'Reschedule' : 'إعادة جدولة'}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RescheduleSessionDialog;
