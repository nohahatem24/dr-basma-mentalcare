import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { 
  Mic, MicOff, Video, VideoOff, PhoneOff, ScreenShare, 
  StopCircle, MessageSquare, Maximize, Minimize, Volume2, VolumeX,
  AlertCircle, CheckCircle 
} from 'lucide-react';

interface VideoCallProps {
  appointmentId: string;
  doctorId: string;
  patientId: string;
  onEndCall: () => void;
}

type CallStatus = 'connecting' | 'connected' | 'reconnecting' | 'disconnected';

export const VideoCall: React.FC<VideoCallProps> = ({
  appointmentId,
  doctorId,
  patientId,
  onEndCall,
}) => {
  const { t } = useTranslation();
  const [callStatus, setCallStatus] = useState<CallStatus>('connecting');
  const [micEnabled, setMicEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [isSharingScreen, setIsSharingScreen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [callTime, setCallTime] = useState(0); // in seconds
  const [remoteAudioEnabled, setRemoteAudioEnabled] = useState(true);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  
  // References for video elements
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const screenShareRef = useRef<HTMLVideoElement>(null);
  
  // Reference for timer interval
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Reference for local and remote streams
  const localStreamRef = useRef<MediaStream | null>(null);
  const remoteStreamRef = useRef<MediaStream | null>(null);
  const screenShareStreamRef = useRef<MediaStream | null>(null);
  
  // Initialize call on component mount
  useEffect(() => {
    // Start the connection process
    initializeCall();
    
    // Set up call timer
    timerIntervalRef.current = setInterval(() => {
      setCallTime(prev => prev + 1);
    }, 1000);
    
    // Clean up on unmount
    return () => {
      endCall();
      
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, []);
  
  const initializeCall = async () => {
    try {
      setConnectionError(null);
      setCallStatus('connecting');
      
      // Request user media (video and audio)
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      
      // Set local stream
      localStreamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      
      // In a real implementation, this would be where you set up WebRTC connections
      // For this demo, we'll simulate a connection after a delay
      setTimeout(() => {
        // Simulate a remote stream (in a real app this would come from the other party)
        simulateRemoteStream();
        setCallStatus('connected');
      }, 2000);
      
    } catch (error) {
      console.error('Error initializing call:', error);
      
      // Handle unsupported media devices
      if (error instanceof DOMException && error.name === 'NotFoundError') {
        setConnectionError(t('noMediaDevicesFound'));
      } else {
        setConnectionError(t('errorOccurred'));
      }
      
      setCallStatus('disconnected');
    }
  };
  
  // Simulate receiving a remote stream (for demo purposes)
  const simulateRemoteStream = () => {
    // In a real implementation, the remote stream would come from WebRTC
    // For this demo, we'll just clone the local stream as a placeholder
    if (localStreamRef.current && remoteVideoRef.current) {
      remoteStreamRef.current = localStreamRef.current.clone();
      remoteVideoRef.current.srcObject = remoteStreamRef.current;
      remoteVideoRef.current.addEventListener('loadedmetadata', () => {
        remoteVideoRef.current?.play();
      });
    }
  };
  
  // Toggle microphone
  const toggleMicrophone = () => {
    if (localStreamRef.current) {
      const audioTracks = localStreamRef.current.getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = !micEnabled;
      });
      setMicEnabled(!micEnabled);
    }
  };
  
  // Toggle video
  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTracks = localStreamRef.current.getVideoTracks();
      videoTracks.forEach(track => {
        track.enabled = !videoEnabled;
      });
      setVideoEnabled(!videoEnabled);
    }
  };
  
  // Toggle remote audio
  const toggleRemoteAudio = () => {
    if (remoteVideoRef.current) {
      remoteVideoRef.current.muted = !remoteVideoRef.current.muted;
      setRemoteAudioEnabled(!remoteAudioEnabled);
    }
  };
  
  // Start screen sharing
  const startScreenSharing = async () => {
    try {
      // Request screen sharing
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });
      
      // Set screen sharing stream
      screenShareStreamRef.current = screenStream;
      if (screenShareRef.current) {
        screenShareRef.current.srcObject = screenStream;
      }
      
      setIsSharingScreen(true);
      
      // Add event listener for when the user stops sharing
      screenStream.getVideoTracks()[0].addEventListener('ended', () => {
        stopScreenSharing();
      });
      
    } catch (error) {
      console.error('Error starting screen sharing:', error);
    }
  };
  
  // Stop screen sharing
  const stopScreenSharing = () => {
    if (screenShareStreamRef.current) {
      screenShareStreamRef.current.getTracks().forEach(track => track.stop());
      screenShareStreamRef.current = null;
    }
    
    if (screenShareRef.current) {
      screenShareRef.current.srcObject = null;
    }
    
    setIsSharingScreen(false);
  };
  
  // Toggle chat
  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };
  
  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };
  
  // End the call
  const handleEndCall = () => {
    endCall();
    onEndCall();
  };
  
  // Clean up media resources
  const endCall = () => {
    // Stop all tracks in the local stream
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
      localStreamRef.current = null;
    }
    
    // Stop screen sharing if active
    if (screenShareStreamRef.current) {
      screenShareStreamRef.current.getTracks().forEach(track => track.stop());
      screenShareStreamRef.current = null;
    }
    
    // Clean up video elements
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
    
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }
    
    if (screenShareRef.current) {
      screenShareRef.current.srcObject = null;
    }
    
    setCallStatus('disconnected');
  };
  
  // Format call time as MM:SS
  const formatCallTime = () => {
    const minutes = Math.floor(callTime / 60);
    const seconds = callTime % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="bg-gray-900 text-white relative overflow-hidden rounded-xl w-full h-full min-h-[500px]">
      {/* Status indicator */}
      <div className="absolute top-4 left-4 z-10 flex items-center bg-gray-800 bg-opacity-80 rounded-full px-3 py-1">
        {callStatus === 'connecting' && (
          <>
            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse mr-2"></div>
            <span>{t('connecting')}</span>
          </>
        )}
        
        {callStatus === 'connected' && (
          <>
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            <span>{formatCallTime()}</span>
          </>
        )}
        
        {callStatus === 'reconnecting' && (
          <>
            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse mr-2"></div>
            <span>{t('reconnecting')}</span>
          </>
        )}
        
        {callStatus === 'disconnected' && (
          <>
            <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
            <span>{t('disconnected')}</span>
          </>
        )}
      </div>
      
      {/* Connection error message */}
      {connectionError && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 bg-red-900 bg-opacity-90 rounded-lg p-6 text-center max-w-md">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
          <h3 className="text-xl font-semibold mb-2">{t('errorOccurred')}</h3>
          <p className="mb-4">{connectionError}</p>
          <button 
            onClick={initializeCall}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
          >
            {t('tryAgain')}
          </button>
        </div>
      )}
      
      {/* Remote video (full screen) */}
      <div className="w-full h-full">
        <video 
          ref={remoteVideoRef}
          autoPlay 
          playsInline
          className={`w-full h-full object-cover ${!isSharingScreen ? 'block' : 'hidden'}`}
        ></video>
      </div>
      
      {/* Screen sharing video (shown when active) */}
      {isSharingScreen && (
        <div className="absolute inset-0 bg-black">
          <video 
            ref={screenShareRef}
            autoPlay 
            playsInline
            className="w-full h-full object-contain"
          ></video>
        </div>
      )}
      
      {/* Local video (small overlay) */}
      <div className="absolute bottom-20 right-4 z-10 w-[160px] h-[120px] rounded-lg overflow-hidden border-2 border-white shadow-lg">
        <video 
          ref={localVideoRef}
          autoPlay 
          playsInline 
          muted 
          className="w-full h-full object-cover"
        ></video>
        
        {/* Video disabled indicator */}
        {!videoEnabled && (
          <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
            <VideoOff className="w-8 h-8 text-gray-400" />
          </div>
        )}
        
        {/* Mic indicator */}
        <div className={`absolute bottom-2 left-2 w-6 h-6 rounded-full flex items-center justify-center ${micEnabled ? 'bg-green-500' : 'bg-red-500'}`}>
          {micEnabled ? <Mic className="w-3 h-3 text-white" /> : <MicOff className="w-3 h-3 text-white" />}
        </div>
      </div>
      
      {/* Chat panel (shown when active) */}
      {isChatOpen && (
        <div className="absolute right-0 top-0 bottom-16 w-80 bg-gray-800 z-10 flex flex-col rounded-l-lg overflow-hidden">
          <div className="bg-gray-900 p-3 font-medium">
            {t('chat')}
          </div>
          
          <div className="flex-1 p-3 overflow-y-auto">
            {/* Chat messages would go here in a real implementation */}
            <div className="text-center text-gray-400 py-10">
              {t('chatNotImplemented')}
            </div>
          </div>
          
          <div className="p-3 border-t border-gray-700">
            <div className="flex">
              <input 
                type="text" 
                placeholder={t('typeMessage')}
                className="flex-1 bg-gray-700 text-white px-3 py-2 rounded-l-md focus:outline-none"
                disabled
              />
              <button 
                className="bg-blue-600 px-3 py-2 rounded-r-md disabled:opacity-50"
                disabled
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Control bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-gray-800 bg-opacity-90 px-4 py-3 flex justify-center items-center z-10">
        <div className="flex space-x-4">
          {/* Microphone toggle */}
          <button 
            onClick={toggleMicrophone}
            className={`w-12 h-12 rounded-full flex items-center justify-center ${micEnabled ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-600 hover:bg-red-700'}`}
            title={micEnabled ? t('microphoneOn') : t('microphoneOff')}
          >
            {micEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
          </button>
          
          {/* Video toggle */}
          <button 
            onClick={toggleVideo}
            className={`w-12 h-12 rounded-full flex items-center justify-center ${videoEnabled ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-600 hover:bg-red-700'}`}
            title={videoEnabled ? t('cameraOn') : t('cameraOff')}
          >
            {videoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
          </button>
          
          {/* Screen sharing toggle */}
          <button 
            onClick={isSharingScreen ? stopScreenSharing : startScreenSharing}
            className={`w-12 h-12 rounded-full flex items-center justify-center ${isSharingScreen ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-700 hover:bg-gray-600'}`}
            title={isSharingScreen ? t('stopSharing') : t('shareScreen')}
          >
            {isSharingScreen ? <StopCircle className="w-5 h-5" /> : <ScreenShare className="w-5 h-5" />}
          </button>
          
          {/* Remote audio toggle */}
          <button 
            onClick={toggleRemoteAudio}
            className={`w-12 h-12 rounded-full flex items-center justify-center ${remoteAudioEnabled ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-600 hover:bg-red-700'}`}
            title={remoteAudioEnabled ? t('remoteAudioOn') : t('remoteAudioOff')}
          >
            {remoteAudioEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>
          
          {/* Chat toggle */}
          <button 
            onClick={toggleChat}
            className={`w-12 h-12 rounded-full flex items-center justify-center ${isChatOpen ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-700 hover:bg-gray-600'}`}
            title={isChatOpen ? t('closeChat') : t('openChat')}
          >
            <MessageSquare className="w-5 h-5" />
          </button>
          
          {/* Fullscreen toggle */}
          <button 
            onClick={toggleFullscreen}
            className="w-12 h-12 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center"
            title={isFullscreen ? t('exitFullscreen') : t('enterFullscreen')}
          >
            {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
          </button>
          
          {/* End call button */}
          <button 
            onClick={handleEndCall}
            className="w-12 h-12 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center"
            title={t('endCall')}
          >
            <PhoneOff className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      {/* Call ended status (shown when disconnected) */}
      {callStatus === 'disconnected' && !connectionError && (
        <div className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center z-20">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <PhoneOff className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">{t('callEnded')}</h2>
            <p className="text-gray-300 mb-6">{t('callDuration')}: {formatCallTime()}</p>
            <button
              onClick={onEndCall}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full"
            >
              {t('back')}
            </button>
          </div>
        </div>
      )}
      
      {/* Connection successful message (shown briefly when first connected) */}
      {callStatus === 'connected' && callTime < 2 && (
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-20 bg-green-900 bg-opacity-90 rounded-lg px-4 py-2 flex items-center transition-opacity duration-500">
          <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
          <span>{t('connectionEstablished')}</span>
        </div>
      )}
    </div>
  );
}; 