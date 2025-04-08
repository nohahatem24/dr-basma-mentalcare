
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from '@/components/Header';
import VideoCall from '@/components/VideoCall';
import { ThumbsUp, ThumbsDown, Star } from 'lucide-react';

const VideoSession = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [isCallEnded, setIsCallEnded] = useState(false);
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
  const [rating, setRating] = useState<number>(0);
  
  // Handle the end of the call
  const handleEndCall = () => {
    setIsCallEnded(true);
    setShowFeedbackDialog(true);
  };
  
  // Handle feedback submission
  const handleSubmitFeedback = () => {
    toast({
      title: language === 'en' ? "Thank You!" : "شكراً لك!",
      description: language === 'en' 
        ? "Your feedback helps us improve our services" 
        : "تساعدنا ملاحظاتك على تحسين خدماتنا",
    });
    
    setShowFeedbackDialog(false);
    
    // Redirect to dashboard after feedback
    setTimeout(() => {
      navigate('/dashboard');
    }, 1500);
  };
  
  return (
    <div className="container py-6 max-w-4xl">
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          {isCallEnded ? (
            <div className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">
                {language === 'en' ? "Call Ended" : "انتهت المكالمة"}
              </h2>
              <p className="text-muted-foreground mb-6">
                {language === 'en' 
                  ? "Your session with Dr. Basma Adel has ended" 
                  : "انتهت جلستك مع الدكتورة بسمة عادل"}
              </p>
              <Button 
                onClick={() => navigate('/dashboard')}
                className="mx-auto"
              >
                {language === 'en' ? "Return to Dashboard" : "العودة إلى لوحة المعلومات"}
              </Button>
            </div>
          ) : (
            <div className="h-[70vh]">
              <VideoCall 
                doctorName="Dr. Basma Adel"
                onEndCall={handleEndCall}
              />
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Session feedback dialog */}
      <Dialog open={showFeedbackDialog} onOpenChange={setShowFeedbackDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {language === 'en' ? "Rate Your Session" : "قيّم جلستك"}
            </DialogTitle>
            <DialogDescription>
              {language === 'en' 
                ? "How was your experience with Dr. Basma Adel?" 
                : "كيف كانت تجربتك مع الدكتورة بسمة عادل؟"}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            {/* Star rating */}
            <div className="flex justify-center space-x-2 mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="focus:outline-none"
                  onClick={() => setRating(star)}
                >
                  <Star 
                    className={`h-8 w-8 ${
                      rating >= star 
                        ? 'text-yellow-500 fill-yellow-500' 
                        : 'text-gray-300'
                    }`} 
                  />
                </button>
              ))}
            </div>
            
            {/* Quick feedback buttons */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <Button variant="outline" className="flex items-center justify-center">
                <ThumbsUp className="mr-2 h-4 w-4" />
                {language === 'en' ? "Helpful" : "مفيد"}
              </Button>
              <Button variant="outline" className="flex items-center justify-center">
                <ThumbsDown className="mr-2 h-4 w-4" />
                {language === 'en' ? "Could be better" : "يمكن أن يكون أفضل"}
              </Button>
            </div>
          </div>
          
          <DialogFooter className="sm:justify-end">
            <Button 
              variant="secondary" 
              onClick={() => setShowFeedbackDialog(false)}
            >
              {language === 'en' ? "Skip" : "تخطي"}
            </Button>
            <Button 
              type="button" 
              onClick={handleSubmitFeedback}
              disabled={rating === 0}
            >
              {language === 'en' ? "Submit" : "إرسال"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VideoSession;
