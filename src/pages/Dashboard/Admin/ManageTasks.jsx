import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FiClipboard, FiEdit, FiTrash2, FiDollarSign, FiUsers, FiCalendar, FiTarget, FiMoreVertical, FiCheck, FiX, FiEye, FiActivity } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi2';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import useDocumentTitle from '../../../hooks/useDocumentTitle';

const ManageTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTask, setSelectedTask] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useDocumentTitle('Manage Tasks');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/admin/tasks`);
      
      if (response.ok) {
        const data = await response.json();
        setTasks(data);
      } else {
        toast.error('Failed to fetch tasks');
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/admin/tasks/${taskId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Task deleted successfully!');
        await fetchTasks();
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to delete task');
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Error deleting task');
    }
  };

  const handleViewTask = (task) => {
    setSelectedTask(task);
    setShowModal(true);
  };

  const filteredTasks = tasks.filter(task => {
    const matchesStatus = selectedStatus === 'all' || task.status === selectedStatus;
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.buyerName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700 border-emerald-200/50';
      case 'completed':
        return 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 border-blue-200/50';
      case 'paused':
        return 'bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-700 border-amber-200/50';
      default:
        return 'bg-gradient-to-r from-slate-100 to-gray-100 text-slate-700 border-slate-200/50';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, ease: "easeOut" }
  };

  const staggerContainer = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-3 border-blue-500/30 border-t-blue-500 rounded-full"
        />
      </div>
    );
  }

  const taskCounts = {
    all: tasks.length,
    active: tasks.filter(t => t.status === 'active').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    paused: tasks.filter(t => t.status === 'paused').length
  };

  const totalPayments = tasks.reduce((sum, task) => sum + (task.totalPayable || 0), 0);

  const statsCards = [
    {
      title: 'Total Tasks',
      value: taskCounts.all,
      icon: <FiClipboard className="h-4 w-4" />,
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Active Tasks',
      value: taskCounts.active,
      icon: <FiActivity className="h-4 w-4" />,
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600'
    },
    {
      title: 'Completed',
      value: taskCounts.completed,
      icon: <FiCheck className="h-4 w-4" />,
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-600'
    },
    {
      title: 'Total Value',
      value: `${totalPayments} coins`,
      icon: <HiSparkles className="h-4 w-4" />,
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-600'
    }
  ];

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={staggerContainer}
      className="space-y-4 overflow-x-hidden"
    >
      {/* Stats Section */}
      <motion.div
        variants={staggerContainer}
        className="grid grid-cols-1 md:grid-cols-4 gap-3"
      >
        {statsCards.map((stat) => (
          <motion.div
            key={stat.title}
            variants={fadeInUp}
            whileHover={{ scale: 1.01, y: -1 }}
            className="group bg-white/60 backdrop-blur-xl rounded-2xl border border-white/50 p-4 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-semibold text-slate-600 group-hover:text-slate-700 transition-colors">
                  {stat.title}
                </p>
                <p className="text-lg font-bold text-slate-800 group-hover:text-slate-900 transition-colors">
                  {stat.value}
                </p>
              </div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className={`p-2 ${stat.bgColor} rounded-xl shadow-sm group-hover:shadow-md transition-all duration-300`}
              >
                <div className={stat.textColor}>
                  {stat.icon}
                </div>
              </motion.div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Tasks Management */}
      <motion.div
        variants={fadeInUp}
        className="bg-white/60 backdrop-blur-xl rounded-2xl border border-white/50 shadow-lg overflow-hidden"
      >
        <div className="px-4 py-3 border-b border-white/20 bg-gradient-to-r from-white/20 to-white/10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0">
            <div className="flex items-center space-x-2">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="w-6 h-6 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center shadow-sm"
              >
                <FiClipboard className="h-3 w-3 text-white" />
              </motion.div>
              <div>
                <h2 className="text-lg font-semibold text-slate-800">Task Management</h2>
                <p className="text-xs text-slate-600">Oversee all platform tasks</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
              {/* Search */}
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-3 py-2 bg-white/60 backdrop-blur-sm border border-white/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm w-full sm:w-48"
              />
              
              {/* Status Filter */}
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 bg-white/60 backdrop-blur-sm border border-white/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="paused">Paused</option>
              </select>
            </div>
          </div>
        </div>

        {filteredTasks.length === 0 ? (
          <motion.div
            variants={fadeInUp}
            className="p-8 text-center"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-3"
            >
              <FiClipboard className="h-6 w-6 text-slate-400" />
            </motion.div>
            <h3 className="text-base font-semibold text-slate-600 mb-1">No Tasks Found</h3>
            <p className="text-sm text-slate-500">Try adjusting your search or filter criteria</p>
          </motion.div>
        ) : (
          <div className="p-2 sm:p-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-2 sm:gap-4">
              {filteredTasks.map((task, index) => (
              <motion.div
                key={task._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white/40 backdrop-blur-sm rounded-xl border border-white/50 p-3 sm:p-4 hover:bg-white/60 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                {/* Task Header */}
                <div className="flex items-start justify-between mb-2 sm:mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="text-sm sm:text-base font-semibold text-slate-800 truncate">{task.title}</h3>
                      <motion.span
                        whileHover={{ scale: 1.02 }}
                        className={`inline-flex items-center px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-semibold border shadow-sm flex-shrink-0 ${getStatusColor(task.status)}`}
                      >
                        {task.status}
                      </motion.span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 line-clamp-2">{task.detail}</p>
                  </div>
                </div>

                {/* Buyer Info */}
                <div className="bg-white/60 rounded-lg p-2 sm:p-3 mb-2 sm:mb-3">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <img
                      className="h-6 w-6 sm:h-8 sm:w-8 rounded-full shadow-sm"
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(task.buyerName)}&size=32`}
                      alt={task.buyerName}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs sm:text-sm font-semibold text-slate-800 truncate">{task.buyerName}</div>
                      <div className="text-xs text-slate-500 truncate">{task.buyerEmail}</div>
                    </div>
                  </div>
                </div>

                {/* Task Stats */}
                <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <div className="bg-white/60 rounded-lg p-2 sm:p-3">
                    <div className="flex items-center space-x-1 sm:space-x-2">
                      <FiUsers className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                      <div>
                        <div className="text-xs text-slate-500">Required Workers</div>
                        <div className="text-xs sm:text-sm font-semibold text-slate-800">{task.requiredWorkers}</div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white/60 rounded-lg p-2 sm:p-3">
                    <div className="flex items-center space-x-1 sm:space-x-2">
                      <FiDollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-600" />
                      <div>
                        <div className="text-xs text-slate-500">Payment</div>
                        <div className="text-xs sm:text-sm font-semibold text-emerald-600">{task.payableAmount} coins</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Task Details */}
                <div className="bg-white/60 rounded-lg p-2 sm:p-3 mb-2 sm:mb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1 sm:space-x-2">
                      <FiCalendar className="h-3 w-3 sm:h-4 sm:w-4 text-amber-600" />
                      <div>
                        <div className="text-xs text-slate-500">Completion Date</div>
                        <div className="text-xs sm:text-sm font-semibold text-slate-800">{formatDate(task.completionDate)}</div>
                      </div>
                    </div>
                    <div className="text-xs text-slate-500">
                      Created {formatDate(task.createdAt)}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end space-x-1 sm:space-x-2">
                  <motion.button
                    onClick={() => handleViewTask(task)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center space-x-1 px-2 sm:px-3 py-1.5 sm:py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-sm"
                  >
                    <FiEye className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="text-xs sm:text-sm font-medium">View</span>
                  </motion.button>
                  
                  <motion.button
                    onClick={() => handleDeleteTask(task._id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center space-x-1 px-2 sm:px-3 py-1.5 sm:py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-sm"
                  >
                    <FiTrash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="text-xs sm:text-sm font-medium">Delete</span>
                  </motion.button>
                </div>
              </motion.div>
            ))}
            </div>
          </div>
        )}
      </motion.div>

      {/* Task Detail Modal */}
      {showModal && selectedTask && createPortal(
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-[9999] p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white/90 backdrop-blur-xl rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-white/50"
            >
              <div className="px-4 py-3 border-b border-white/20 bg-gradient-to-r from-white/20 to-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="w-6 h-6 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center shadow-sm"
                    >
                      <FiEye className="h-3 w-3 text-white" />
                    </motion.div>
                    <h3 className="text-lg font-semibold text-slate-800">Task Details</h3>
                  </div>
                  <motion.button
                    onClick={() => setShowModal(false)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-white/50 transition-all duration-200"
                  >
                    ×
                  </motion.button>
                </div>
              </div>
              
              <div className="px-4 py-3 space-y-3">
                <div>
                  <h4 className="text-sm font-semibold text-slate-800 mb-2 flex items-center">
                    <FiClipboard className="h-4 w-4 mr-2 text-emerald-600" />
                    Task Information
                  </h4>
                  <div className="bg-white/40 backdrop-blur-sm p-3 rounded-xl border border-white/50 space-y-2">
                    <div className="flex items-center space-x-2">
                      <h5 className="text-base font-semibold text-slate-800">{selectedTask.title}</h5>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border shadow-sm ${getStatusColor(selectedTask.status)}`}>
                        {selectedTask.status}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600">{selectedTask.detail}</p>
                    <p className="text-sm"><span className="font-semibold">Submission Info:</span> {selectedTask.submissionInfo}</p>
                    {selectedTask.imageUrl && (
                      <div>
                        <p className="text-sm font-semibold mb-2">Task Image:</p>
                        <img 
                          src={selectedTask.imageUrl} 
                          alt="Task" 
                          className="w-full max-w-sm h-32 object-cover rounded-lg shadow-sm"
                        />
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <h4 className="text-sm font-semibold text-slate-800 mb-2 flex items-center">
                      <FiUsers className="h-4 w-4 mr-2 text-blue-600" />
                      Buyer Information
                    </h4>
                    <div className="bg-white/40 backdrop-blur-sm p-3 rounded-xl border border-white/50">
                      <p className="text-sm"><span className="font-semibold">Name:</span> {selectedTask.buyerName}</p>
                      <p className="text-sm"><span className="font-semibold">Email:</span> {selectedTask.buyerEmail}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-semibold text-slate-800 mb-2 flex items-center">
                      <HiSparkles className="h-4 w-4 mr-2 text-violet-600" />
                      Task Details
                    </h4>
                    <div className="bg-white/40 backdrop-blur-sm p-3 rounded-xl border border-white/50">
                      <p className="text-sm"><span className="font-semibold">Workers Needed:</span> {selectedTask.requiredWorkers}</p>
                      <p className="text-sm"><span className="font-semibold">Payment:</span> {selectedTask.payableAmount} coins each</p>
                      <p className="text-sm"><span className="font-semibold">Total Value:</span> {selectedTask.totalPayable} coins</p>
                      <p className="text-sm"><span className="font-semibold">Deadline:</span> {formatDate(selectedTask.completionDate)}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="px-4 py-3 border-t border-white/20 flex justify-end space-x-2 bg-gradient-to-r from-white/10 to-white/20">
                <motion.button
                  onClick={() => setShowModal(false)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-3 py-2 bg-white/60 border border-white/50 rounded-xl text-sm font-semibold text-slate-700 hover:bg-white/80 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  Close
                </motion.button>
                <motion.button
                  onClick={() => {
                    handleDeleteTask(selectedTask._id);
                    setShowModal(false);
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-3 py-2 bg-gradient-to-r from-red-600 to-pink-700 text-sm font-semibold text-white rounded-xl hover:from-red-700 hover:to-pink-800 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <FiTrash2 className="h-3 w-3 inline mr-1" />
                  Delete Task
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>,
        document.body
      )}
    </motion.div>
  );
};

export default ManageTasks; 