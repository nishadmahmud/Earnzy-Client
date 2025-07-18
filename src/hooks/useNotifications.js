import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { useContext } from 'react';
import { AuthContext } from '../auth/AuthProvider';

const fetchNotifications = async (email) => {
  if (!email) return [];
  
  const response = await fetch(`http://localhost:5000/notifications?email=${encodeURIComponent(email)}`);
  if (!response.ok) {
    throw new Error('Failed to fetch notifications');
  }
  
  return response.json();
};

const markAsRead = async (notificationId, userEmail) => {
  const response = await fetch(`http://localhost:5000/notifications/${notificationId}/read`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userEmail }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to mark notification as read');
  }
  
  return response.json();
};

const markAllAsRead = async (userEmail) => {
  const response = await fetch('http://localhost:5000/notifications/read-all', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userEmail }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to mark all notifications as read');
  }
  
  return response.json();
};

const deleteNotification = async (notificationId, userEmail) => {
  const response = await fetch(`http://localhost:5000/notifications/${notificationId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userEmail }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to delete notification');
  }
  
  return response.json();
};

export const useNotifications = () => {
  const { user } = useContext(AuthContext);
  
  const query = useQuery({
    queryKey: ['notifications', user?.email],
    queryFn: () => fetchNotifications(user?.email),
    enabled: !!user?.email,
    staleTime: 1000 * 30, // 30 seconds
    refetchInterval: 1000 * 60, // Refetch every minute
  });
  
  return {
    notifications: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
};

export const useMarkAsRead = () => {
  const queryClient = useQueryClient();
  const { user } = useContext(AuthContext);
  
  return useMutation({
    mutationFn: (notificationId) => markAsRead(notificationId, user?.email),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', user?.email] });
    },
  });
};

export const useMarkAllAsRead = () => {
  const queryClient = useQueryClient();
  const { user } = useContext(AuthContext);
  
  return useMutation({
    mutationFn: () => markAllAsRead(user?.email),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', user?.email] });
    },
  });
};

export const useDeleteNotification = () => {
  const queryClient = useQueryClient();
  const { user } = useContext(AuthContext);
  
  return useMutation({
    mutationFn: (notificationId) => deleteNotification(notificationId, user?.email),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', user?.email] });
    },
  });
};

export const useRefreshNotifications = () => {
  const queryClient = useQueryClient();
  const { user } = useContext(AuthContext);
  
  return () => {
    queryClient.invalidateQueries({ queryKey: ['notifications', user?.email] });
  };
}; 