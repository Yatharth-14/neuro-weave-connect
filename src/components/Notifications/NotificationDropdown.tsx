
import React, { useState } from 'react';
import { Bell, Check, X, MessageCircle, Users, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useIsMobile } from '../../hooks/use-mobile';

interface Notification {
  id: string;
  type: 'comment' | 'collaboration' | 'like' | 'mention';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  link?: string;
}

const NotificationDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'comment',
      title: 'New Comment',
      message: 'Sarah commented on your thread "React 19 Features"',
      timestamp: '2 minutes ago',
      read: false,
      link: '/thread/1'
    },
    {
      id: '2',
      type: 'collaboration',
      title: 'Collaboration Request',
      message: 'John wants to collaborate on "AI in Web Development"',
      timestamp: '1 hour ago',
      read: false,
      link: '/thread/2'
    },
    {
      id: '3',
      type: 'like',
      title: 'Thread Liked',
      message: 'Your thread received 5 new likes',
      timestamp: '3 hours ago',
      read: true,
      link: '/thread/3'
    }
  ]);

  const isMobile = useIsMobile();
  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'comment': return <MessageCircle className="h-4 w-4" />;
      case 'collaboration': return <Users className="h-4 w-4" />;
      case 'like': return <Heart className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 relative"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop for mobile */}
            {isMobile && (
              <div 
                className="fixed inset-0 bg-black bg-opacity-25 z-40"
                onClick={() => setIsOpen(false)}
              />
            )}

            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={`
                absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50
                ${isMobile ? 'fixed top-16 right-4 left-4 w-auto' : ''}
              `}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Notifications
                </h3>
                <div className="flex items-center space-x-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
                    >
                      Mark all read
                    </button>
                  )}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Notifications List */}
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                    <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No notifications yet</p>
                  </div>
                ) : (
                  <div className="py-2">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`
                          flex items-start p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer border-l-4
                          ${notification.read 
                            ? 'border-transparent' 
                            : 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          }
                        `}
                        onClick={() => {
                          markAsRead(notification.id);
                          setIsOpen(false);
                          // Navigate to link if provided
                          if (notification.link) {
                            window.location.href = notification.link;
                          }
                        }}
                      >
                        <div className="flex-shrink-0 mr-3">
                          <div className={`
                            p-2 rounded-full 
                            ${notification.type === 'comment' ? 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400' : ''}
                            ${notification.type === 'collaboration' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' : ''}
                            ${notification.type === 'like' ? 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400' : ''}
                          `}>
                            {getIcon(notification.type)}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {notification.title}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                            {notification.timestamp}
                          </p>
                        </div>
                        {!notification.read && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              markAsRead(notification.id);
                            }}
                            className="flex-shrink-0 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
                          >
                            <Check className="h-4 w-4 text-gray-400" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <button className="w-full text-center text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium">
                  View All Notifications
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationDropdown;
