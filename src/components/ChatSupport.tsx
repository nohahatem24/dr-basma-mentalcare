
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { MessageCircle, X, Send } from 'lucide-react';
import { useLanguage } from './Header';

const ChatSupport = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<{text: string, sender: 'user' | 'agent'}[]>([
    { text: 'Hello! How can I help you today?', sender: 'agent' }
  ]);
  const { language } = useLanguage();

  const toggleChat = () => setIsOpen(!isOpen);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    // Add user message
    const newMessages = [...messages, { text: message, sender: 'user' as const }];
    setMessages(newMessages);
    setMessage('');
    
    // Simulate agent response
    setTimeout(() => {
      setMessages([
        ...newMessages,
        { 
          text: language === 'en' 
            ? "Thank you for your message. Dr. Bassma's team will respond shortly." 
            : "شكراً لرسالتك. سيرد فريق د. بسمة قريباً.",
          sender: 'agent' as const 
        }
      ]);
    }, 1000);
  };

  return (
    <>
      {/* Chat Support Button */}
      <Button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 rounded-full h-14 w-14 shadow-lg z-50 bg-primary hover:bg-primary/90"
        size="icon"
        aria-label="Chat Support"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </Button>

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-24 right-6 w-80 md:w-96 shadow-xl z-50 border-2 border-primary/20">
          <CardHeader className="bg-primary/10 pb-2">
            <CardTitle className="text-lg">
              {language === 'en' ? 'Chat Support' : 'دعم المحادثة'}
            </CardTitle>
          </CardHeader>
          <CardContent className="h-80 overflow-y-auto p-3 space-y-3">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`max-w-[80%] p-3 rounded-lg ${
                  msg.sender === 'user'
                    ? 'bg-primary/10 ml-auto text-right'
                    : 'bg-accent/40 mr-auto'
                }`}
              >
                {msg.text}
              </div>
            ))}
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
