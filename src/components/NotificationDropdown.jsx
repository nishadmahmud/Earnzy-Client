import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FiBell, FiCheck, FiX, FiCheckCircle } from 'react-icons/fi';
import { useNotifications, useMarkAsRead, useMarkAllAsRead, useDeleteNotification } from '../hooks/useNotifications';
import { useNavigate } from 'react-router';

const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const navigate = useNavigate();
  
  const { notifications, isLoading } = useNotifications();
  const markAsReadMutation = useMarkAsRead();
  const markAllAsReadMutation = useMarkAllAsRead();
  const deleteNotificationMutation = useDeleteNotification();
  
  const unreadCount = notifications.filter(n => !n.read).length;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
          buttonRef.current && !buttonRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleNotificationClick = (notification) => {
    // Mark as read if not already read
    if (!notification.read) {
      markAsReadMutation.mutate(notification._id);
    }
    
    // Navigate to the action route
    if (notification.actionRoute) {
      navigate(notification.actionRoute);
    }
    
    setIsOpen(false);
  };

  const handleMarkAsRead = (e, notificationId) => {
    e.stopPropagation();
    markAsReadMutation.mutate(notificationId);
  };

  const handleDelete = (e, notificationId) => {
    e.stopPropagation();
    deleteNotificationMutation.mutate(notificationId);
  };

  const handleMarkAllAsRead = () => {
    markAllAsReadMutation.mutate();
  };

  const formatTime = (time) => {
    const now = new Date();
    const notificationTime = new Date(time);
    const diffInHours = (now - notificationTime) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now - notificationTime) / (1000 * 60));
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  // Get button position for mobile modal positioning
  const getButtonPosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      return {
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right,
        left: rect.left
      };
    }
    return { top: 60, right: 16, left: 'auto' };
  };

  const buttonPosition = getButtonPosition();

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl bg-white/40 backdrop-blur-sm border border-white/30 hover:bg-white/60 text-slate-600 hover:text-blue-600 transition-all duration-200 shadow-sm hover:shadow-md"
      >
        <FiBell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-lg animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown - Mobile and Desktop */}
      {isOpen && (
        <>
          {/* Mobile Modal (Full Screen Overlay) */}
          <div className="md:hidden">
            {createPortal(
              <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-16 px-4">
                {/* Backdrop */}
                <div 
                  className="absolute inset-0 bg-black/20 backdrop-blur-sm"
                  onClick={() => setIsOpen(false)}
                />
                
                {/* Modal Content */}
                <div 
                  ref={dropdownRef}
                  className="relative w-full max-w-md bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 max-h-[70vh] overflow-hidden animate-in slide-in-from-top-4 duration-300"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between p-4 border-b border-slate-200/50 bg-gradient-to-r from-blue-50/50 to-indigo-50/50">
                    <h3 className="text-lg font-bold text-slate-800 flex items-center">
                      <FiBell className="h-5 w-5 mr-2 text-blue-600" />
                      Notifications
                    </h3>
                    <div className="flex items-center space-x-2">
                      {unreadCount > 0 && (
                        <button
                          onClick={handleMarkAllAsRead}
                          className="text-xs text-blue-600 hover:text-blue-700 font-medium px-2 py-1 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                          disabled={markAllAsReadMutation.isLoading}
                        >
                          Mark all read
                        </button>
                      )}
                      <button
                        onClick={() => setIsOpen(false)}
                        className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors"
                      >
                        <FiX className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  {/* Notifications List */}
                  <div className="max-h-96 overflow-y-auto">
                    {isLoading ? (
                      <div className="flex items-center justify-center p-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent"></div>
                      </div>
                    ) : notifications.length === 0 ? (
                      <div className="text-center p-12 text-slate-500">
                        <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                          <FiBell className="h-8 w-8 text-slate-300" />
                        </div>
                        <p className="font-medium mb-1">No notifications yet</p>
                        <p className="text-sm">You're all caught up!</p>
                      </div>
                    ) : (
                      notifications.map((notification) => (
                        <div
                          key={notification._id}
                          onClick={() => handleNotificationClick(notification)}
                          className={`relative p-4 border-b border-slate-100/50 cursor-pointer hover:bg-slate-50/50 transition-colors ${
                            !notification.read ? 'bg-blue-50/30' : ''
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0 pr-2">
                              <p className={`text-sm leading-relaxed ${!notification.read ? 'font-medium text-slate-900' : 'text-slate-700'}`}>
                                {notification.message}
                              </p>
                              <p className="text-xs text-slate-500 mt-2 flex items-center">
                                <span className="w-1 h-1 bg-slate-400 rounded-full mr-2"></span>
                                {formatTime(notification.time)}
                              </p>
                            </div>
                            
                            <div className="flex items-center space-x-1">
                              {!notification.read && (
                                <button
                                  onClick={(e) => handleMarkAsRead(e, notification._id)}
                                  className="p-1.5 rounded-lg hover:bg-blue-100 text-blue-600 transition-colors"
                                  title="Mark as read"
                                >
                                  <FiCheck className="h-4 w-4" />
                                </button>
                              )}
                              <button
                                onClick={(e) => handleDelete(e, notification._id)}
                                className="p-1.5 rounded-lg hover:bg-red-100 text-red-600 transition-colors"
                                title="Delete"
                              >
                                <FiX className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                          
                          {!notification.read && (
                            <div className="absolute left-2 top-6 w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                        </div>
                      ))
                    )}
                  </div>

                  {/* Footer */}
                  {notifications.length > 0 && (
                    <div className="p-3 border-t border-slate-200/50 bg-gradient-to-r from-slate-50/50 to-slate-50/30">
                      <p className="text-xs text-slate-500 text-center">
                        {notifications.length} notification{notifications.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  )}
                </div>
              </div>,
              document.body
            )}
          </div>

          {/* Desktop Dropdown */}
          <div className="hidden md:block">
            <div 
              ref={dropdownRef}
              className="absolute right-0 mt-2 w-80 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 z-[60] max-h-96 overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-slate-200/50">
                <h3 className="text-lg font-semibold text-slate-800">Notifications</h3>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    disabled={markAllAsReadMutation.isLoading}
                  >
                    Mark all as read
                  </button>
                )}
              </div>

              {/* Notifications List */}
              <div className="max-h-64 overflow-y-auto">
                {isLoading ? (
                  <div className="flex items-center justify-center p-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="text-center p-8 text-slate-500">
                    <FiBell className="h-12 w-12 mx-auto mb-3 text-slate-300" />
                    <p>No notifications yet</p>
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification._id}
                      onClick={() => handleNotificationClick(notification)}
                      className={`relative p-4 border-b border-slate-100 cursor-pointer hover:bg-slate-50 transition-colors ${
                        !notification.read ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm ${!notification.read ? 'font-medium text-slate-900' : 'text-slate-700'}`}>
                            {notification.message}
                          </p>
                          <p className="text-xs text-slate-500 mt-1">
                            {formatTime(notification.time)}
                          </p>
                        </div>
                        
                        <div className="flex items-center space-x-1 ml-2">
                          {!notification.read && (
                            <button
                              onClick={(e) => handleMarkAsRead(e, notification._id)}
                              className="p-1 rounded-full hover:bg-blue-100 text-blue-600"
                              title="Mark as read"
                            >
                              <FiCheck className="h-4 w-4" />
                            </button>
                          )}
                          <button
                            onClick={(e) => handleDelete(e, notification._id)}
                            className="p-1 rounded-full hover:bg-red-100 text-red-600"
                            title="Delete"
                          >
                            <FiX className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      
                      {!notification.read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full absolute left-2 top-6"></div>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              {notifications.length > 0 && (
                <div className="p-3 border-t border-slate-200 bg-slate-50">
                  <p className="text-xs text-slate-500 text-center">
                    {notifications.length} notification{notifications.length !== 1 ? 's' : ''}
                  </p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationDropdown; 