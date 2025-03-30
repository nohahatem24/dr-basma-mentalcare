import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { MessageCircle, X, Send, Clock, User } from 'lucide-react';
import { useLanguage } from './Header';
import { useToast } from '@/hooks/use-toast';
import { useNotifications } from './NotificationSystem';

type ChatMessage = {
  id: string;
  text: string;
  sender: 'user' | 'agent';
  timestamp: Date;
};

const ChatSupport = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const { language } = useLanguage();
  const { toast } = useToast();
  const { addNotification } = useNotifications();
  const [isLoading, setIsLoading] = useState(true);
  const [requestedSupport, setRequestedSupport] = useState(false);

  useEffect(() => {
    const savedMessages = localStorage.getItem('chatHistory');
    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages);
        const formattedMessages = parsedMessages.map((msg: any) => ({
          ...msg,
          sender: msg.sender as 'user' | 'agent',
          timestamp: new Date(msg.timestamp)
        }));
        setMessages(formattedMessages);
      } catch (error) {
        console.error('Error parsing chat history:', error);
      }
    } else {
      setMessages([
        {
          id: Date.now().toString(),
          text: language === 'en' 
            ? 'Hello! How can I help you today?' 
            : 'مرحبا! كيف يمكنني مساعدتك اليوم؟',
          sender: 'agent',
          timestamp: new Date()
        }
      ]);
    }
    setIsLoading(false);
  }, [language]);

  useEffect(() => {
    // Simulate receiving a message from the therapist after 30 seconds
    // This is just for demo purposes - in a real app, this would come from a websocket or API
    const simulateTherapistResponse = setTimeout(() => {
      // Only simulate if there's user activity (messages exist)
      if (messages.length > 1 && !isOpen) {
        const therapistMessage = {
          id: Date.now().toString(),
          text: language === 'en'
            ? 'Dr. Bassma has replied to your message. Click to view.'
            : 'لقد ردت د. بسمة على رسالتك. انقر للعرض.',
          sender: 'agent' as const,
          timestamp: new Date()
        };
        
        addNotification({
          message: language === 'en' 
            ? 'Dr. Bassma: Thanks for reaching out. How are you feeling today?'
            : 'د. بسمة: شكراً للتواصل. كيف تشعر اليوم؟',
          type: 'message'
        });
        
        setMessages(prev => [...prev, therapistMessage]);
      }
    }, 30000);
    
    return () => clearTimeout(simulateTherapistResponse);
  }, [messages, isOpen, language, addNotification]);

  useEffect(() => {
    if (!isLoading && messages.length > 0) {
      localStorage.setItem('chatHistory', JSON.stringify(messages));
    }
  }, [messages, isLoading]);

  const toggleChat = () => setIsOpen(!isOpen);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: message,
      sender: 'user' as const,
      timestamp: new Date()
    };
    
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setMessage('');
    
    const needsHumanSupport = checkIfNeedsHumanSupport(message);
    
    setTimeout(() => {
      let responseText = '';
      
      if (needsHumanSupport && !requestedSupport) {
        responseText = language === 'en' 
          ? "I understand you'd like to speak with a human agent. Our support team has been notified and will respond to you shortly. Your case number is #" + Math.floor(10000 + Math.random() * 90000)
          : "أفهم أنك ترغب في التحدث مع وكيل بشري. تم إخطار فريق الدعم لدينا وسيرد عليك قريبًا. رقم حالتك هو #" + Math.floor(10000 + Math.random() * 90000);
        
        toast({
          title: language === 'en' ? 'Support Request Created' : 'تم إنشاء طلب الدعم',
          description: language === 'en' ? 'A human agent will assist you soon.' : 'سيقوم أحد المختصين بمساعدتك قريبًا.',
        });
        
        // Add notification for when the user is requesting to speak with Dr. Bassma
        setTimeout(() => {
          if (!isOpen) {
            addNotification({
              message: language === 'en' 
                ? 'Dr. Bassma will review your message soon'
                : 'ستقوم د. بسمة بمراجعة رسالتك قريبًا',
              type: 'message'
            });
          }
        }, 5000);
        
        setRequestedSupport(true);
      } else if (requestedSupport) {
        responseText = language === 'en' 
          ? "Our team is still working on your previous request. A human agent will respond as soon as possible."
          : "فريقنا لا يزال يعمل على طلبك السابق. سيرد عليك أحد المختصين في أقرب وقت ممكن.";
      } else {
        responseText = language === 'en' 
          ? "Thank you for your message. Is there anything specific about Dr. Bassma's services you'd like to know?"
          : "شكراً لرسالتك. هل هناك أي شيء محدد حول خدمات د. بسمة ترغب في معرفته؟";
      }
      
      const agentMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: 'agent' as const,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, agentMessage]);
    }, 1000);
  };

  const checkIfNeedsHumanSupport = (text: string): boolean => {
    const supportKeywords = [
      'human', 'agent', 'person', 'speak', 'talk', 'support', 'help', 'service', 'chat with someone',
      'إنسان', 'وكيل', 'شخص', 'تحدث', 'دعم', 'مساعدة', 'خدمة', 'محادثة مع شخص'
    ];
    
    const lowercaseText = text.toLowerCase();
    return supportKeywords.some(keyword => lowercaseText.includes(keyword.toLowerCase()));
  };

  const formatTimestamp = (date: Date): string => {
    return new Date(date).toLocaleTimeString(language === 'en' ? 'en-US' : 'ar-SA', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const clearChatHistory = () => {
    const welcomeMessage = {
      id: Date.now().toString(),
      text: language === 'en' 
        ? 'Hello! How can I help you today?' 
        : 'مرحبا! كيف يمكنني مساعدتك اليوم؟',
      sender: 'agent' as const,
      timestamp: new Date()
    };
    
    setMessages([welcomeMessage]);
    setRequestedSupport(false);
    
    toast({
      title: language === 'en' ? 'Chat History Cleared' : 'تم مسح سجل الدردشة',
      description: language === 'en' ? 'Your chat history has been cleared.' : 'تم مسح سجل الدردشة الخاص بك.',
    });
  };

  return (
    <>
      <Button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 rounded-full h-16 w-16 shadow-lg z-50 bg-primary hover:bg-primary/90"
        size="icon"
        aria-label="Chat Support"
      >
        {isOpen ? <X className="h-8 w-8" /> : <MessageCircle className="h-8 w-8" />}
      </Button>

      {isOpen && (
        <Card className="fixed bottom-24 right-6 w-80 md:w-96 shadow-xl z-50 border-2 border-primary/20">
          <CardHeader className="bg-primary/10 pb-2 flex flex-row justify-between items-center">
            <CardTitle className="text-lg">
              {language === 'en' ? 'Chat Support' : 'دعم المحادثة'}
            </CardTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearChatHistory}
              className="h-8 px-2"
            >
              {language === 'en' ? 'Clear Chat' : 'مسح المحادثة'}
            </Button>
          </CardHeader>
          <CardContent className="h-80 overflow-y-auto p-3 space-y-3">
            {isLoading ? (
              <div className="flex justify-center items-center h-full">
                <span className="text-muted-foreground">
                  {language === 'en' ? 'Loading messages...' : 'جاري تحميل الرسائل...'}
                </span>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`max-w-[80%] p-3 rounded-lg ${
                    msg.sender === 'user'
                      ? 'bg-primary/10 ml-auto text-right'
                      : 'bg-accent/40 mr-auto'
                  }`}
                >
                  <div className="flex items-center mb-1 gap-1 text-xs text-muted-foreground">
                    {msg.sender === 'user' ? (
                      <>
                        <span>{language === 'en' ? 'You' : 'أنت'}</span>
                        <User className="h-3 w-3" />
                      </>
                    ) : (
                      <>
                        <span>{language === 'en' ? 'Support' : 'الدعم'}</span>
                      </>
                    )}
                  </div>
                  {msg.text}
                  <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1 justify-end">
                    <Clock className="h-3 w-3" />
                    <span>{formatTimestamp(msg.timestamp)}</span>
                  </div>
                </div>
              ))
            )}
          </CardContent>
          <CardFooter className="border-t p-2">
            <form onSubmit={handleSendMessage} className="flex w-full gap-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={language === 'en' ? 'Type your message...' : 'اكتب رسالتك...'}
                className="flex-grow"
              />
              <Button type="submit" size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </CardFooter>
        </Card>
      )}
    </>
  );
};

export default ChatSupport;
