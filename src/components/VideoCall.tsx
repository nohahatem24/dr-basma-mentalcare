
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from '@/components/Header';
import { 
  Video, 
  Mic, 
  MicOff, 
  VideoOff, 
  Phone, 
  MessageCircle, 
  Share2, 
  Settings,
  Volume2,
  Volume
} from 'lucide-react';

interface VideoCallProps {
  sessionId?: string;
  doctorName?: string;
  onEndCall?: () => void;
}

const VideoCall: React.FC<VideoCallProps> = ({ 
  sessionId = "session-123", 
  doctorName = "Dr. Bassma Adel",
  onEndCall = () => {}
}) => {
  const { language } = useLanguage();
  const { toast } = useToast();
  
  // Call controls state
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [sessionTime, setSessionTime] = useState(0);
  const [isCallConnected, setIsCallConnected] = useState(false);
  
  // Format seconds into MM:SS format
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  // Session timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isCallConnected) {
      interval = setInterval(() => {
        setSessionTime((prevTime) => prevTime + 1);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isCallConnected]);
  
  // Connect call simulation
  useEffect(() => {
    const connectTimeout = setTimeout(() => {
      setIsCallConnected(true);
      toast({
        title: language === 'en' ? "Call Connected" : "تم الاتصال",
        description: language === 'en' ? `You are now connected with ${doctorName}` : `أنت الآن متصل مع ${doctorName}`,
      });
    }, 3000);
    
    return () => clearTimeout(connectTimeout);
  }, [doctorName, language, toast]);
  
  // Handle ending the call
  const handleEndCall = () => {
    toast({
      title: language === 'en' ? "Call Ended" : "انتهى الاتصال",
      description: language === 'en' ? `Call duration: ${formatTime(sessionTime)}` : `مدة المكالمة: ${formatTime(sessionTime)}`,
    });
    
    onEndCall();
  };
  
  return (
    <div className="w-full h-full flex flex-col">
      <div className="relative flex-1 bg-gray-900 rounded-lg overflow-hidden">
        {/* Remote video (doctor) - this would be connected to a real video stream */}
        <div className="w-full h-full">
          <div className="absolute inset-0 flex items-center justify-center">
            {!isCallConnected ? (
              <div className="text-center">
                <div className="animate-pulse w-24 h-24 bg-primary opacity-70 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="h-12 w-12 text-white" />
                </div>
                <p className="text-white text-lg font-medium">
                  {language === 'en' ? "Connecting..." : "جاري الاتصال..."}
                </p>
              </div>
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-900 to-gray-900">
                {/* Placeholder for the remote video stream */}
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="w-32 h-32 rounded-full bg-primary/20 mx-auto mb-4 flex items-center justify-center">
                      <span className="text-4xl text-white font-bold">
                        {doctorName.split(' ').map(name => name[0]).join('')}
                      </span>
                    </div>
                    <h3 className="text-white text-xl">{doctorName}</h3>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Local video (user) - this would be connected to a real video stream */}
          <div className="absolute bottom-4 right-4 w-32 h-24 bg-gray-800 rounded-lg overflow-hidden border-2 border-gray-700">
            {!isVideoOff ? (
              <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900">
                {/* Placeholder for the local video stream */}
                <div className="flex items-center justify-center h-full">
                  <span className="text-xl text-white font-bold">
                    {language === 'en' ? "You" : "أنت"}
                  </span>
                </div>
              </div>
            ) : (
              <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                <VideoOff className="h-6 w-6 text-white/70" />
              </div>
            )}
          </div>
          
          {/* Call timer */}
          <div className="absolute top-4 left-4 bg-black/50 py-1 px-3 rounded-full">
            <span className="text-white text-sm">
              {isCallConnected ? formatTime(sessionTime) : (language === 'en' ? "Connecting..." : "جاري الاتصال...")}
            </span>
          </div>
        </div>
      </div>
      
      {/* Call controls */}
      <div className="mt-4 flex justify-center">
        <div className="bg-gray-100 dark:bg-gray-800 rounded-full px-4 py-2 flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            className={`rounded-full ${isMuted ? 'bg-red-500 text-white hover:bg-red-600' : ''}`}
            onClick={() => setIsMuted(!isMuted)}
          >
            {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className={`rounded-full ${isVideoOff ? 'bg-red-500 text-white hover:bg-red-600' : ''}`}
            onClick={() => setIsVideoOff(!isVideoOff)}
          >
            {isVideoOff ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5" />}
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className={`rounded-full ${!isSpeakerOn ? 'bg-red-500 text-white hover:bg-red-600' : ''}`}
            onClick={() => setIsSpeakerOn(!isSpeakerOn)}
          >
            {isSpeakerOn ? <Volume2 className="h-5 w-5" /> : <Volume className="h-5 w-5" />}
          </Button>
          
          <Button
            variant="default"
            size="icon"
            className="rounded-full bg-red-500 hover:bg-red-600"
            onClick={handleEndCall}
          >
            <Phone className="h-5 w-5 rotate-135" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
          >
            <MessageCircle className="h-5 w-5" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VideoCall;
