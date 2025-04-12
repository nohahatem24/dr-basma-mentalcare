
import React from 'react';
import { Session } from '@/types/mindtrack';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface CancelSessionDialogProps {
  language: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedSession: Session | null;
  cancellationReason: string;
  setCancellationReason: (reason: string) => void;
  isSubmitting: boolean;
  onCancel: () => void;
  formatDate: (date: string) => string;
}

const CancelSessionDialog = ({
  language,
  isOpen,
  onOpenChange,
  selectedSession,
  cancellationReason,
  setCancellationReason,
  isSubmitting,
  onCancel,
  formatDate
}: CancelSessionDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {language === 'en' ? 'Cancel Session' : 'إلغاء الجلسة'}
          </DialogTitle>
          <DialogDescription>
            {language === 'en' 
              ? 'Are you sure you want to cancel this session? Please provide a reason.' 
              : 'هل أنت متأكد أنك تريد إلغاء هذه الجلسة؟ يرجى ذكر السبب.'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <h4 className="text-sm font-medium">
              {language === 'en' ? 'Session Details:' : 'تفاصيل الجلسة:'}
            </h4>
            <p className="text-sm">
              {selectedSession && formatDate(selectedSession.date)}
              <br />
              {selectedSession && `${selectedSession.start_time} - ${selectedSession.end_time}`}
            </p>
          </div>
          
          <div className="space-y-2">
            <h4 className="text-sm font-medium">
              {language === 'en' ? 'Reason for Cancellation:' : 'سبب الإلغاء:'}
            </h4>
            <Textarea
              value={cancellationReason}
              onChange={(e) => setCancellationReason(e.target.value)}
              placeholder={language === 'en' 
                ? 'Please provide a reason for cancellation' 
                : 'يرجى ذكر سبب الإلغاء'}
              rows={3}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            {language === 'en' ? 'Back' : 'رجوع'}
          </Button>
          <Button
            variant="destructive"
            onClick={onCancel}
            disabled={isSubmitting || !cancellationReason.trim()}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {language === 'en' ? 'Processing...' : 'جارٍ المعالجة...'}
              </>
            ) : (
              language === 'en' ? 'Cancel Session' : 'إلغاء الجلسة'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CancelSessionDialog;
