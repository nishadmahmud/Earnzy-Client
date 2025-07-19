import { useQuery } from '@tanstack/react-query';

const fetchTopWorkers = async () => {
  const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/top-workers`);
  if (!response.ok) {
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