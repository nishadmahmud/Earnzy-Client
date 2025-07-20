import { useQuery } from '@tanstack/react-query';

const fetchAvailableTasks = async (workerEmail) => {
  const url = workerEmail 
    ? `${import.meta.env.VITE_SERVER_URL}/tasks/available?workerEmail=${encodeURIComponent(workerEmail)}`
    : `${import.meta.env.VITE_SERVER_URL}/tasks/available`;
    
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch available tasks');
  }
  return response.json();
};

const fetchTaskById = async (id, workerEmail) => {
  if (!id) return null;
  
  const url = workerEmail 
    ? `${import.meta.env.VITE_SERVER_URL}/tasks/${id}?workerEmail=${encodeURIComponent(workerEmail)}`
    : `${import.meta.env.VITE_SERVER_URL}/tasks/${id}`;
    
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch task details');
  }
  return response.json();
};

export const useAvailableTasks = (workerEmail) => {
  return useQuery({
    queryKey: ['availableTasks', workerEmail],
    queryFn: () => fetchAvailableTasks(workerEmail),
    staleTime: 1000 * 60 * 2, // 2 minutes
    refetchInterval: 1000 * 60 * 5, // Refetch every 5 minutes
  });
};

export const useTaskDetails = (id, workerEmail) => {
  return useQuery({
    queryKey: ['taskDetails', id, workerEmail],
    queryFn: () => fetchTaskById(id, workerEmail),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

const fetchWorkerSubmissions = async (workerEmail) => {
  if (!workerEmail) return [];
  
  const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/worker/submissions?workerEmail=${encodeURIComponent(workerEmail)}`);
  if (!response.ok) {
    throw new Error('Failed to fetch worker submissions');
  }
  return response.json();
};

export const useWorkerSubmissions = (workerEmail) => {
  return useQuery({
    queryKey: ['workerSubmissions', workerEmail],
    queryFn: () => fetchWorkerSubmissions(workerEmail),
    enabled: !!workerEmail,
    staleTime: 1000 * 60 * 2, // 2 minutes
    refetchInterval: 1000 * 60 * 5, // Refetch every 5 minutes
  });
};

const fetchWorkerWithdrawals = async (workerEmail) => {
  if (!workerEmail) return [];
  
  const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/worker/withdrawals?workerEmail=${encodeURIComponent(workerEmail)}`);
  if (!response.ok) {
    throw new Error('Failed to fetch worker withdrawals');
  }
  return response.json();
};

export const useWorkerWithdrawals = (workerEmail) => {
  return useQuery({
    queryKey: ['workerWithdrawals', workerEmail],
    queryFn: () => fetchWorkerWithdrawals(workerEmail),
    enabled: !!workerEmail,
    staleTime: 1000 * 60 * 2, // 2 minutes
    refetchInterval: 1000 * 60 * 5, // Refetch every 5 minutes
  });
}; 