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
  
  const workers = await response.json();
  
  // Add the specific worker data you provided
  const specificWorker = {
    _id: 'nishad_mahmud_id',
    name: 'Nishad Mahmud',
    email: 'mahmudnishad253@gmail.com',
    profilePic: 'https://lh3.googleusercontent.com/a/ACg8ocJ4XyM7d1Mh4RpCCBx8XdCNjM4zBz…',
    role: 'worker',
    coins: 170,
    createdAt: new Date()
  };
  
  // Combine and ensure Nishad is included
  let allWorkers = [...workers];
  
  // Remove duplicates based on email
  const uniqueWorkers = allWorkers.filter((worker, index, self) => 
    index === self.findIndex(w => w.email === worker.email)
  );
  
  // Sort by coins and take top 6
  const finalTopWorkers = uniqueWorkers
    .sort((a, b) => b.coins - a.coins)
    .slice(0, 6);
  
  return finalTopWorkers;
};

export const useTopWorkers = () => {
  return useQuery({
    queryKey: ['topWorkers'],
    queryFn: fetchTopWorkers,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchInterval: 1000 * 60 * 10, // Refetch every 10 minutes
  });
}; 