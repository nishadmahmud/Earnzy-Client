import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useContext } from 'react';
import { AuthContext } from '../auth/AuthProvider';

const fetchUserData = async (email) => {
  if (!email) return null;
  
  const response = await fetch(`http://localhost:5000/users?email=${encodeURIComponent(email)}`);
  if (!response.ok) {
    throw new Error('Failed to fetch user data');
  }
  
  return response.json();
};

export const useUserData = () => {
  const { user } = useContext(AuthContext);
  
  return useQuery({
    queryKey: ['user', user?.email],
    queryFn: () => fetchUserData(user?.email),
    enabled: !!user?.email,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

export const useUserCoins = () => {
  const { user } = useContext(AuthContext);
  
  const query = useQuery({
    queryKey: ['userCoins', user?.email],
    queryFn: () => fetchUserData(user?.email),
    enabled: !!user?.email,
    select: (data) => data?.coins || 0,
    staleTime: 1000 * 30, // 30 seconds
  });
  
  return {
    coins: query.data || 0,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
};

export const useUserProfile = () => {
  const { user } = useContext(AuthContext);
  const { data: dbUser } = useUserData();
  
  return {
    name: dbUser?.name || user?.displayName || user?.email?.split('@')[0] || 'User',
    email: user?.email || '',
    profileImage: dbUser?.profilePic || user?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(dbUser?.name || user?.displayName || 'User')}`,
    role: dbUser?.role || 'worker',
    coins: dbUser?.coins || 0,
  };
};

export const useRefreshUserCoins = () => {
  const queryClient = useQueryClient();
  const { user } = useContext(AuthContext);
  
  return () => {
    queryClient.invalidateQueries({ queryKey: ['userCoins', user?.email] });
    queryClient.invalidateQueries({ queryKey: ['user', user?.email] });
  };
}; 