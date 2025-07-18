import React from 'react';
import { useNavigate } from 'react-router';
import { FiCalendar, FiUser, FiDollarSign, FiUsers, FiEye } from 'react-icons/fi';
import { useAvailableTasks } from '../../../hooks/useTaskData';

const WorkerTaskList = () => {
  const navigate = useNavigate();
  const { data: tasks = [], isLoading: loading, error } = useAvailableTasks();

  const handleViewDetails = (taskId) => {
    navigate(`/dashboard/tasks/${taskId}`);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">{error.message || 'Error fetching tasks'}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-100 p-6">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Available Tasks</h1>
        <p className="text-slate-600">Browse and select tasks to work on</p>
        <div className="mt-4 flex items-center space-x-4 text-sm text-slate-500">
          <span className="flex items-center">
            <FiUsers className="h-4 w-4 mr-1" />
            {tasks.length} tasks available
          </span>
        </div>
      </div>

      {/* Tasks Grid */}
      {tasks.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-slate-100 p-12 text-center">
          <FiUsers className="h-16 w-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-600 mb-2">No Tasks Available</h3>
          <p className="text-slate-500">Check back later for new tasks to work on.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task) => (
            <div
              key={task._id}
              className="bg-white rounded-lg shadow-sm border border-slate-100 p-6 hover:shadow-md transition-shadow duration-200"
            >
              {/* Task Header */}
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-slate-800 mb-2 line-clamp-2">
                  {task.title}
                </h3>
                <div className="flex items-center text-sm text-slate-600 mb-2">
                  <FiUser className="h-4 w-4 mr-1" />
                  <span>By {task.buyerName}</span>
                </div>
              </div>

              {/* Task Details */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Completion Date:</span>
                  <div className="flex items-center text-sm text-slate-800">
                    <FiCalendar className="h-4 w-4 mr-1" />
                    {formatDate(task.completionDate)}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Payment:</span>
                  <div className="flex items-center text-sm font-semibold text-green-600">
                    <FiDollarSign className="h-4 w-4 mr-1" />
                    {task.payableAmount} coins
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Workers Needed:</span>
                  <div className="flex items-center text-sm text-slate-800">
                    <FiUsers className="h-4 w-4 mr-1" />
                    {task.requiredWorkers}
                  </div>
                </div>
              </div>

              {/* Task Description Preview */}
              <div className="mb-4">
                <p className="text-sm text-slate-600 line-clamp-3">
                  {task.detail}
                </p>
              </div>

              {/* View Details Button */}
              <button
                onClick={() => handleViewDetails(task._id)}
                className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors duration-200"
              >
                <FiEye className="h-4 w-4 mr-2" />
                View Details
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WorkerTaskList; 