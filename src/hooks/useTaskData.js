import { useQuery } from '@tanstack/react-query';

const fetchAvailableTasks = async () => {
  const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/tasks/available`);
  if (!response.ok) {
    throw new Error('Failed to fetch available tasks');
  }
  return response.json();
};

const fetchTaskById = async (id) => {
  if (!id) return null;
  
  const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/tasks/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch task details');
  }
  return response.json();
};

export const useAvailableTasks = () => {
  return useQuery({
    queryKey: ['availableTasks'],
    queryFn: fetchAvailableTasks,
    staleTime: 1000 * 60 * 2, // 2 minutes
    refetchInterval: 1000 * 60 * 5, // Refetch every 5 minutes
  });
};

export const useTaskDetails = (id) => {
  return useQuery({
    queryKey: ['taskDetails', id],
    queryFn: () => fetchTaskById(id),
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