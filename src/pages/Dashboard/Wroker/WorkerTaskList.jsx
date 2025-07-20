import React, { useContext } from 'react';
import { useNavigate } from 'react-router';
import { AuthContext } from '../../../auth/AuthProvider';
import { FiCalendar, FiUser, FiDollarSign, FiUsers, FiEye, FiClock, FiTarget, FiCheckCircle, FiAward } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi2';
import { useAvailableTasks } from '../../../hooks/useTaskData';
import { motion } from 'framer-motion';
import useDocumentTitle from '../../../hooks/useDocumentTitle';

const WorkerTaskList = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { data: tasks = [], isLoading: loading, error } = useAvailableTasks(user?.email);

  useDocumentTitle('Available Tasks');

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

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-red-50/80 backdrop-blur-sm border border-red-200/50 rounded-xl p-4 shadow-sm"
      >
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
            <FiTarget className="h-3 w-3 text-red-600" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-red-800">Error Loading Tasks</h3>
            <p className="text-xs text-red-600">{error.message || 'Error fetching tasks'}</p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={staggerContainer}
      className="space-y-4 overflow-x-hidden"
    >
      {/* Header */}
      <motion.div
        variants={fadeInUp}
        className="bg-white/60 backdrop-blur-xl rounded-2xl border border-white/50 p-4 shadow-lg"
      >
        <div className="flex items-center space-x-3 mb-2">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-sm"
          >
            <FiUsers className="h-4 w-4 text-white" />
          </motion.div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">Available Tasks</h1>
            <p className="text-sm text-slate-600">Browse and select tasks to work on</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-1 mt-3">
          <HiSparkles className="h-3 w-3 text-blue-600 flex-shrink-0" />
          <span className="text-xs text-slate-500 break-words">
            {tasks.filter(t => !t.hasSubmitted && !t.isCompleted).length} available • {tasks.filter(t => t.hasSubmitted && !t.isCompleted).length} submitted • {tasks.filter(t => t.isCompleted).length} completed
          </span>
        </div>
      </motion.div>

      {/* Tasks Grid */}
      {tasks.length === 0 ? (
        <motion.div
          variants={fadeInUp}
          className="bg-white/60 backdrop-blur-xl rounded-2xl border border-white/50 p-8 text-center shadow-lg"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-3"
          >
            <FiUsers className="h-6 w-6 text-slate-400" />
          </motion.div>
          <h3 className="text-base font-semibold text-slate-600 mb-1">No Tasks Available</h3>
          <p className="text-sm text-slate-500">Check back later for new tasks to work on.</p>
        </motion.div>
      ) : (
        <motion.div
          variants={staggerContainer}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4"
        >
          {tasks.map((task) => (
            <motion.div
              key={task._id}
              variants={fadeInUp}
              whileHover={{ scale: 1.02, y: -2 }}
              className="group bg-white/60 backdrop-blur-xl rounded-xl border border-white/50 p-4 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {/* Task Header */}
              <div className="mb-3">
                <h3 className="text-base font-semibold text-slate-800 mb-2 line-clamp-2 group-hover:text-slate-900 transition-colors">
                  {task.title}
                </h3>
                <div className="flex items-center text-xs text-slate-600">
                  <FiUser className="h-3 w-3 mr-1" />
                  <span>By {task.buyerName}</span>
                </div>
              </div>

              {/* Task Details */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-600">Due Date:</span>
                  <div className="flex items-center text-xs text-slate-800">
                    <FiCalendar className="h-3 w-3 mr-1 text-blue-600" />
                    {formatDate(task.completionDate)}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-600">Payment:</span>
                  <div className="flex items-center text-xs font-bold text-emerald-600">
                    <FiDollarSign className="h-3 w-3 mr-1" />
                    {task.payableAmount} coins
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-600">Workers:</span>
                  <div className="flex items-center text-xs text-slate-800">
                    <FiUsers className="h-3 w-3 mr-1 text-amber-600" />
                    {task.requiredWorkers}
                  </div>
                </div>
              </div>

              {/* Task Description Preview */}
              <div className="mb-4">
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {task.detail}
                </p>
              </div>

              {/* View Details Button */}
              <motion.button
                onClick={() => handleViewDetails(task._id)}
                disabled={task.isCompleted}
                whileHover={!task.isCompleted ? { scale: 1.02 } : {}}
                whileTap={!task.isCompleted ? { scale: 0.98 } : {}}
                className={`w-full flex items-center justify-center px-3 py-2 font-semibold text-sm rounded-lg transition-all duration-200 shadow-md ${
                  task.isCompleted
                    ? 'bg-gradient-to-r from-slate-400 to-gray-500 text-white cursor-not-allowed opacity-60'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white hover:shadow-lg'
                }`}
              >
                <FiEye className="h-3 w-3 mr-2" />
                {task.isCompleted ? 'Completed' : 'View Details'}
              </motion.button>

              {/* Status Indicator */}
              <div className="mt-2 flex items-center justify-center">
                {task.isCompleted ? (
                  <div className="flex items-center space-x-1 px-2 py-1 bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200/50 rounded-full">
                    <FiAward className="h-2 w-2 text-emerald-600" />
                    <span className="text-xs font-medium text-emerald-700">Completed</span>
                  </div>
                ) : task.hasSubmitted ? (
                  <div className="flex items-center space-x-1 px-2 py-1 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/50 rounded-full">
                    <FiCheckCircle className="h-2 w-2 text-blue-600" />
                    <span className="text-xs font-medium text-blue-700">Submitted</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-1 px-2 py-1 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200/50 rounded-full">
                    <FiClock className="h-2 w-2 text-green-600" />
                    <span className="text-xs font-medium text-green-700">Available</span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Summary Footer */}
      {tasks.length > 0 && (
        <motion.div
          variants={fadeInUp}
          className="bg-white/40 backdrop-blur-sm rounded-xl border border-white/50 p-3 shadow-sm"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs space-y-2 sm:space-y-0">
            {/* Statistics - Responsive Grid */}
            <div className="grid grid-cols-2 sm:flex sm:items-center sm:space-x-4 gap-2 sm:gap-0">
              <div className="flex items-center space-x-1">
                <FiTarget className="h-3 w-3 text-slate-600" />
                <span className="text-slate-600">
                  Total: <span className="font-bold text-slate-800">{tasks.length}</span>
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <FiClock className="h-3 w-3 text-green-600" />
                <span className="text-slate-600">
                  Available: <span className="font-bold text-green-700">{tasks.filter(t => !t.hasSubmitted && !t.isCompleted).length}</span>
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <FiCheckCircle className="h-3 w-3 text-blue-600" />
                <span className="text-slate-600">
                  Submitted: <span className="font-bold text-blue-700">{tasks.filter(t => t.hasSubmitted && !t.isCompleted).length}</span>
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <FiAward className="h-3 w-3 text-emerald-600" />
                <span className="text-slate-600">
                  Completed: <span className="font-bold text-emerald-700">{tasks.filter(t => t.isCompleted).length}</span>
                </span>
              </div>
            </div>
            
            {/* Motto - Hidden on very small screens */}
            <div className="hidden sm:flex items-center space-x-1">
              <HiSparkles className="h-3 w-3 text-blue-600" />
              <span className="text-slate-600">Ready to work!</span>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default WorkerTaskList; 