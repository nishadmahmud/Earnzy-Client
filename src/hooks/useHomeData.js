import { useQuery } from '@tanstack/react-query';

const fetchTopWorkers = async () => {
  const serverUrl = import.meta.env.VITE_SERVER_URL;
  const fullUrl = `${serverUrl}/top-workers`;
  
  console.log('🔍 Debug - Server URL:', serverUrl);
  console.log('🔍 Debug - Full URL:', fullUrl);
  console.log('🔍 Debug - Environment variables:', import.meta.env);
  
  const response = await fetch(fullUrl);
  if (!response.ok) {
    console.error('❌ Response not OK:', response.status, response.statusText);
    throw new Error('Failed to fetch top workers');
  }
  return response.json();
};

export const useTopWorkers = () => {
  return useQuery({
    queryKey: ['topWorkers'],
    queryFn: fetchTopWorkers,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchInterval: 1000 * 60 * 10, // Refetch every 10 minutes
  });
}; 