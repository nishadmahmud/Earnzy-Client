import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const fetchAdminDashboard = async () => {
  const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/admin/dashboard`);
  if (!response.ok) {
    throw new Error('Failed to fetch admin dashboard data');
  }
  return response.json();
};

const fetchPendingWithdrawals = async () => {
  const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/admin/withdrawals/pending`);
  if (!response.ok) {
    throw new Error('Failed to fetch pending withdrawals');
  }
  return response.json();
};

const approveWithdrawal = async (withdrawalId) => {
  const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/admin/withdrawals/${withdrawalId}/approve`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to approve withdrawal');
  }
  
  return response.json();
};

export const useAdminDashboard = () => {
  return useQuery({
    queryKey: ['adminDashboard'],
    queryFn: fetchAdminDashboard,
    staleTime: 1000 * 60 * 2, // 2 minutes
    refetchInterval: 1000 * 60 * 5, // Refetch every 5 minutes
  });
};

export const usePendingWithdrawals = () => {
  return useQuery({
    queryKey: ['pendingWithdrawals'],
    queryFn: fetchPendingWithdrawals,
    staleTime: 1000 * 60 * 1, // 1 minute
    refetchInterval: 1000 * 60 * 2, // Refetch every 2 minutes
  });
};

export const useApproveWithdrawal = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: approveWithdrawal,
    onSuccess: () => {
      // Invalidate and refetch pending withdrawals
      queryClient.invalidateQueries({ queryKey: ['pendingWithdrawals'] });
      // Also invalidate admin dashboard to update stats
      queryClient.invalidateQueries({ queryKey: ['adminDashboard'] });
    },
  });
};

// User management functions
const fetchAllUsers = async () => {
  const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/admin/users`);
  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }
  return response.json();
};

const updateUserRole = async ({ email, role }) => {
  const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/admin/users/${encodeURIComponent(email)}/role`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ role }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update user role');
  }
  
  return response.json();
};

const deleteUser = async (email) => {
  const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/admin/users/${encodeURIComponent(email)}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete user');
  }
  
  return response.json();
};

export const useAllUsers = () => {
  return useQuery({
    queryKey: ['allUsers'],
    queryFn: fetchAllUsers,
    staleTime: 1000 * 60 * 2, // 2 minutes
    refetchInterval: 1000 * 60 * 5, // Refetch every 5 minutes
  });
};

export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updateUserRole,
    onSuccess: () => {
      // Invalidate and refetch users
      queryClient.invalidateQueries({ queryKey: ['allUsers'] });
      // Also invalidate admin dashboard to update stats
      queryClient.invalidateQueries({ queryKey: ['adminDashboard'] });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      // Invalidate and refetch users
      queryClient.invalidateQueries({ queryKey: ['allUsers'] });
      // Also invalidate admin dashboard to update stats
      queryClient.invalidateQueries({ queryKey: ['adminDashboard'] });
    },
  });
};

// Task management functions
const fetchAllTasks = async () => {
  const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/admin/tasks`);
  if (!response.ok) {
    throw new Error('Failed to fetch tasks');
  }
  return response.json();
};

const deleteTask = async (taskId) => {
  const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/admin/tasks/${taskId}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete task');
  }
  
  return response.json();
};

export const useAllTasks = () => {
  return useQuery({
    queryKey: ['allTasks'],
    queryFn: fetchAllTasks,
    staleTime: 1000 * 60 * 2, // 2 minutes
    refetchInterval: 1000 * 60 * 5, // Refetch every 5 minutes
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      // Invalidate and refetch tasks
      queryClient.invalidateQueries({ queryKey: ['allTasks'] });
      // Also invalidate admin dashboard to update stats
      queryClient.invalidateQueries({ queryKey: ['adminDashboard'] });
    },
  });
}; 