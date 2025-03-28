
import React, { useEffect, useState } from 'react';
import { Bell, BellDot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { useLanguage } from './Header';
import { useToast } from '@/hooks/use-toast';

type Notification = {
  id: string;
  message: string;
  type: 'message' | 'appointment' | 'report';
  read: boolean;
  timestamp: Date;
};

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { toast } = useToast();
  
  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false,
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    updateUnreadCount([newNotification, ...notifications]);
    
    // Show toast for new notification
    toast({
      title: notification.type === 'message' 
        ? 'New Message' 
        : notification.type === 'appointment' 
          ? 'Appointment Update'
          : 'Report Available',
      description: notification.message,
    });
  };
  
  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true } 
          : notification
      )
    );
    updateUnreadCount(notifications.map(notification => 
      notification.id === id 
        ? { ...notification, read: true } 
        : notification
    ));
  };
  
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    setUnreadCount(0);
  };
  
  const updateUnreadCount = (notificationsList: Notification[]) => {
    setUnreadCount(notificationsList.filter(n => !n.read).length);
  };
  
  // Load notifications from localStorage on mount
  useEffect(() => {
    const savedNotifications = localStorage.getItem('notifications');
    if (savedNotifications) {
      try {
        const parsedNotifications = JSON.parse(savedNotifications);
        const formattedNotifications = parsedNotifications.map((n: any) => ({
          ...n,
          timestamp: new Date(n.timestamp)
        }));
        setNotifications(formattedNotifications);
        updateUnreadCount(formattedNotifications);
      } catch (error) {
        console.error('Error parsing notifications:', error);
      }
    }
  }, []);
  
  // Save notifications to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);
  
  return {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead
  };
};

const NotificationSystem = () => {
  const { language } = useLanguage();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  
  const formatTimestamp = (date: Date) => {
    return new Date(date).toLocaleString(language === 'en' ? 'en-US' : 'ar-SA', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const handleClick = (notification: Notification) => {
    markAsRead(notification.id);
    
    // Navigate based on notification type
    if (notification.type === 'message') {
      // Open chat support
      const chatSupportButton = document.querySelector('[aria-label="Chat Support"]');
      if (chatSupportButton) {
        (chatSupportButton as HTMLButtonElement).click();
      }
    } else if (notification.type === 'report') {
      // Navigate to reports
      window.location.href = '/dashboard';
    } else if (notification.type === 'appointment') {
      // Navigate to appointments
      window.location.href = '/dashboard';
    }
    
    setIsOpen(false);
  };
  
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          {unreadCount > 0 ? (
            <>
              <BellDot className="h-5 w-5" />
              <span className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-xs text-white">
                {unreadCount}
              </span>
            </>
          ) : (
            <Bell className="h-5 w-5" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium">
            {language === 'en' ? 'Notifications' : 'الإشعارات'}
          </h3>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={markAllAsRead}
              className="text-xs h-8"
            >
              {language === 'en' ? 'Mark all as read' : 'تعيين الكل كمقروء'}
            </Button>
          )}
        </div>
        <Separator className="my-2" />
        <div className="max-h-80 overflow-y-auto space-y-3">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <div 
                key={notification.id} 
                className={`p-3 rounded-md cursor-pointer transition-colors ${
                  notification.read 
                    ? 'bg-background hover:bg-accent/50' 
                    : 'bg-accent/60 hover:bg-accent/80'
                }`}
                onClick={() => handleClick(notification)}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="font-medium text-sm">
                    {notification.type === 'message' 
                      ? (language === 'en' ? 'New Message' : 'رسالة جديدة')
                      : notification.type === 'appointment' 
                        ? (language === 'en' ? 'Appointment' : 'موعد')
                        : (language === 'en' ? 'Report' : 'تقرير')}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatTimestamp(notification.timestamp)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{notification.message}</p>
              </div>
            ))
          ) : (
            <div className="py-6 text-center text-muted-foreground">
              {language === 'en' 
                ? 'No notifications yet' 
                : 'لا توجد إشعارات حتى الآن'}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationSystem;
