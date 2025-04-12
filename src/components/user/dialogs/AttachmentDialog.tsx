
import React from 'react';
import { Session } from '@/types/mindtrack';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2, Paperclip } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface AttachmentDialogProps {
  language: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedSession: Session | null;
  attachmentNote: string;
  setAttachmentNote: (note: string) => void;
  attachment: File | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isSubmitting: boolean;
  onSubmit: () => void;
  formatDate: (date: string) => string;
}

const AttachmentDialog = ({
  language,
  isOpen,
  onOpenChange,
  selectedSession,
  attachmentNote,
  setAttachmentNote,
  attachment,
  onFileChange,
  isSubmitting,
  onSubmit,
  formatDate
}: AttachmentDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {language === 'en' ? 'Send Message to Dr. Basma' : 'إرسال رسالة إلى د. بسمة'}
          </DialogTitle>
          <DialogDescription>
            {language === 'en' 
              ? 'Share files or leave a message related to your session.' 
              : 'شارك ملفات أو اترك رسالة متعلقة بجلستك.'}
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
              {language === 'en' ? 'Upload File (Optional):' : 'تحميل ملف (اختياري):'}
            </h4>
            <div className="border rounded-md p-4">
              <input
                type="file"
                className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                onChange={onFileChange}
              />
              {attachment && (
                <div className="mt-2 text-sm text-muted-foreground">
                  {language === 'en' ? 'Selected file:' : 'الملف المحدد:'} {attachment.name}
                </div>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <h4 className="text-sm font-medium">
              {language === 'en' ? 'Message:' : 'الرسالة:'}
            </h4>
            <Textarea
              value={attachmentNote}
              onChange={(e) => setAttachmentNote(e.target.value)}
              placeholder={language === 'en' 
                ? 'Write a message to Dr. Basma' 
                : 'اكتب رسالة إلى د. بسمة'}
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
            {language === 'en' ? 'Cancel' : 'إلغاء'}
          </Button>
          <Button
            onClick={onSubmit}
            disabled={isSubmitting || (!attachment && !attachmentNote.trim())}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {language === 'en' ? 'Sending...' : 'جارٍ الإرسال...'}
              </>
            ) : (
              <>
                <Paperclip className="mr-2 h-4 w-4" />
                {language === 'en' ? 'Send Message' : 'إرسال الرسالة'}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AttachmentDialog;
