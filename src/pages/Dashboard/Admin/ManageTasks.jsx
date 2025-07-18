import React, { useState } from 'react';
import { useAllTasks, useDeleteTask } from '../../../hooks/useAdminData';
import { FiFileText, FiUser, FiCalendar, FiDollarSign, FiUsers, FiTrash2, FiEye } from 'react-icons/fi';
import toast from 'react-hot-toast';

const ManageTasks = () => {
  const { data: tasks = [], isLoading, error } = useAllTasks();
  const deleteTask = useDeleteTask();
  const [confirmDelete, setConfirmDelete] = useState(null);

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask.mutateAsync(taskId);
      toast.success('Task deleted successfully!');
      setConfirmDelete(null);
    } catch (error) {
      toast.error(error.message || 'Failed to delete task');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">{error.message || 'Error loading tasks'}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-100 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 mb-2">Manage Tasks</h1>
            <p className="text-slate-600">View and manage all platform tasks</p>
          </div>
          <div className="flex items-center space-x-2">
            <FiFileText className="h-5 w-5 text-slate-500" />
            <span className="text-sm text-slate-600">{tasks.length} total tasks</span>
          </div>
        </div>
      </div>

      {/* Tasks Table */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-100 overflow-hidden">
        {tasks.length === 0 ? (
          <div className="p-12 text-center">
            <FiFileText className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-600 mb-2">No Tasks Found</h3>
            <p className="text-slate-500">No tasks have been created on the platform yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Task Details
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Buyer
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Completion Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Workers
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {tasks.map((task) => (
                  <tr key={task._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <FiFileText className="h-4 w-4 text-slate-400 mr-3" />
                        <div>
                          <p className="text-sm font-medium text-slate-900 line-clamp-2">
                            {task.title}
                          </p>
                          {/* <p className="text-xs text-slate-500">ID: {task._id}</p> */}
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <FiUser className="h-4 w-4 text-slate-400 mr-2" />
                        <div>
                          <p className="text-sm font-medium text-slate-900">{task.buyerName}</p>
                          <p className="text-xs text-slate-500">{task.buyerEmail}</p>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <FiCalendar className="h-4 w-4 text-slate-400 mr-2" />
                        <span className="text-sm text-slate-900">{formatDate(task.completionDate)}</span>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div>
                        <div className="flex items-center">
                          <FiDollarSign className="h-4 w-4 text-green-500 mr-1" />
                          <span className="text-sm font-semibold text-green-600">
                            {task.payableAmount} coins
                          </span>
                        </div>
                        <p className="text-xs text-slate-500">
                          Total: {task.totalPayable} coins
                        </p>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <FiUsers className="h-4 w-4 text-slate-400 mr-2" />
                        <span className="text-sm text-slate-900">{task.requiredWorkers}</span>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(task.status)}`}>
                        {task.status || 'active'}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        {confirmDelete === task._id ? (
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleDeleteTask(task._id)}
                              disabled={deleteTask.isPending}
                              className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded transition-colors disabled:opacity-50"
                            >
                              {deleteTask.isPending ? 'Deleting...' : 'Confirm'}
                            </button>
                            <button
                              onClick={() => setConfirmDelete(null)}
                              className="px-3 py-1 bg-slate-300 hover:bg-slate-400 text-slate-700 text-xs font-medium rounded transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setConfirmDelete(task._id)}
                            className="inline-flex items-center px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 text-xs font-medium rounded transition-colors"
                          >
                            <FiTrash2 className="h-3 w-3 mr-1" />
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Summary Footer */}
      {tasks.length > 0 && (
        <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">
              Showing {tasks.length} task{tasks.length !== 1 ? 's' : ''}
            </span>
            <div className="flex items-center space-x-4">
              <span className="text-green-600 font-medium">
                {tasks.filter(t => t.status === 'active').length} active
              </span>
              <span className="text-blue-600 font-medium">
                {tasks.filter(t => t.status === 'completed').length} completed
              </span>
              <span className="text-red-600 font-medium">
                {tasks.filter(t => t.status === 'cancelled').length} cancelled
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageTasks; 