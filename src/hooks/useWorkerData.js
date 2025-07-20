import { useQuery } from '@tanstack/react-query';
import { useContext } from 'react';
import { AuthContext } from '../auth/AuthProvider';

const fetchWorkerDashboard = async (email) => {
  if (!email) return null;
  
  const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/worker/dashboard?email=${encodeURIComponent(email)}`);
  if (!response.ok) {
    throw new Error('Failed to fetch worker dashboard data');
  }
  
  return response.json();
};

export const useWorkerDashboard = () => {
  const { user } = useContext(AuthContext);
  
  return useQuery({
    queryKey: ['workerDashboard', user?.email],
    queryFn: () => fetchWorkerDashboard(user?.email),
    enabled: !!user?.email,
    staleTime: 1000 * 60 * 2, // 2 minutes
    refetchInterval: 1000 * 60 * 5, // Refetch every 5 minutes
  });
}; 