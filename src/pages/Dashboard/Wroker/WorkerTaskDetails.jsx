import React, { useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router';
import { AuthContext } from '../../../auth/AuthProvider';
import { FiCalendar, FiUser, FiDollarSign, FiUsers, FiFileText, FiArrowLeft, FiSend, FiTarget, FiImage, FiCheckCircle, FiAward } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi2';
import toast from 'react-hot-toast';
import { useTaskDetails } from '../../../hooks/useTaskData';
import { motion } from 'framer-motion';
import useDocumentTitle from '../../../hooks/useDocumentTitle';

const WorkerTaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  const { data: task, isLoading: loading, error } = useTaskDetails(id, user?.email);
  const [submissionDetails, setSubmissionDetails] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useDocumentTitle(task ? `Task: ${task.title}` : 'Task Details', [task]);

  const handleSubmission = async (e) => {
    e.preventDefault();
    
    // Prevent submission for completed tasks
    if (task?.isCompleted) {
      toast.error('This task has already been completed');
      return;
    }
    
    if (!submissionDetails.trim()) {
      toast.error('Please provide submission details');
      return;
    }

    try {
      setSubmitting(true);
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/submissions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          taskId: id,
          workerEmail: user.email,
          submissionDetails: submissionDetails.trim()
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Submission sent successfully!');
        setSubmissionDetails('');
        navigate('/dashboard/submissions');
      } else {
        toast.error(data.error || 'Failed to submit');
      }
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('Error submitting task');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
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
        <div className="flex items-center space-x-2 mb-3">
          <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
            <FiTarget className="h-3 w-3 text-red-600" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-red-800">Error Loading Task</h3>
            <p className="text-xs text-red-600">{error.message || 'Error fetching task details'}</p>
          </div>
        </div>
        <motion.button
          onClick={() => navigate('/dashboard/tasks')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="text-xs text-blue-600 hover:text-blue-700 underline font-medium"
        >
          Back to Tasks
        </motion.button>
      </motion.div>
    );
  }

  if (!task) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-amber-50/80 backdrop-blur-sm border border-amber-200/50 rounded-xl p-4 shadow-sm"
      >
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center">
            <FiTarget className="h-3 w-3 text-amber-600" />
          </div>
          <p className="text-sm font-semibold text-amber-700">Task not found</p>
        </div>
      </motion.div>
    );
  }

  const taskInfoCards = [
    {
      icon: <FiCalendar className="h-4 w-4" />,
      label: 'Due Date',
      value: formatDate(task.completionDate),
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      icon: <FiDollarSign className="h-4 w-4" />,
      label: 'Payment',
      value: `${task.payableAmount} coins`,
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600'
    },
    {
      icon: <FiUsers className="h-4 w-4" />,
      label: 'Workers',
      value: task.requiredWorkers,
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-600'
    },
    {
      icon: <FiFileText className="h-4 w-4" />,
      label: 'Total Budget',
      value: `${task.totalPayable} coins`,
      bgColor: 'bg-violet-50',
      textColor: 'text-violet-600'
    }
  ];

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={staggerContainer}
      className="space-y-4"
    >
      {/* Header with Back Button */}
      <motion.div variants={fadeInUp} className="flex items-center space-x-3">
        <motion.button
          onClick={() => navigate('/dashboard/tasks')}
          whileHover={{ scale: 1.02, x: -2 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center px-3 py-2 bg-white/60 backdrop-blur-sm border border-white/50 rounded-xl text-slate-600 hover:text-slate-800 transition-all duration-200 shadow-sm hover:shadow-md"
        >
          <FiArrowLeft className="h-3 w-3 mr-1" />
          <span className="text-sm font-medium">Back to Tasks</span>
        </motion.button>
      </motion.div>

      {/* Task Details Card */}
      <motion.div
        variants={fadeInUp}
        className="bg-white/60 backdrop-blur-xl rounded-2xl border border-white/50 p-4 shadow-lg"
      >
        <div className="mb-4">
          <div className="flex items-center space-x-3 mb-3">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-sm"
            >
              <FiFileText className="h-4 w-4 text-white" />
            </motion.div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">{task.title}</h1>
              <div className="flex items-center text-sm text-slate-600">
                <FiUser className="h-3 w-3 mr-1" />
                <span>Posted by {task.buyerName}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Task Information Grid */}
        <motion.div
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4"
        >
          {taskInfoCards.map((info) => (
            <motion.div
              key={info.label}
              variants={fadeInUp}
              whileHover={{ scale: 1.01, y: -1 }}
              className="group bg-white/40 backdrop-blur-sm rounded-xl p-3 border border-white/50 shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center text-xs text-slate-600">
                    <span className="font-semibold">{info.label}</span>
                  </div>
                  <p className="text-sm font-bold text-slate-800">{info.value}</p>
                </div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className={`p-2 ${info.bgColor} rounded-lg shadow-sm group-hover:shadow-md transition-all duration-300`}
                >
                  <div className={info.textColor}>
                    {info.icon}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Task Description */}
        <div className="mb-4">
          <h3 className="text-base font-semibold text-slate-800 mb-2 flex items-center">
            <HiSparkles className="h-4 w-4 mr-2 text-blue-600" />
            Task Description
          </h3>
          <div className="bg-white/40 backdrop-blur-sm p-3 rounded-xl border border-white/50">
            <p className="text-sm text-slate-700 leading-relaxed">{task.detail}</p>
          </div>
        </div>

        {/* Submission Information */}
        <div className="mb-4">
          <h3 className="text-base font-semibold text-slate-800 mb-2 flex items-center">
            <FiFileText className="h-4 w-4 mr-2 text-emerald-600" />
            Submission Requirements
          </h3>
          <div className="bg-emerald-50/60 backdrop-blur-sm p-3 rounded-xl border border-emerald-200/50">
            <p className="text-sm text-slate-700 leading-relaxed">{task.submissionInfo}</p>
          </div>
        </div>

        {/* Task Image */}
        {task.imageUrl && (
          <div className="mb-4">
            <h3 className="text-base font-semibold text-slate-800 mb-2 flex items-center">
              <FiImage className="h-4 w-4 mr-2 text-violet-600" />
              Task Image
            </h3>
            <div className="bg-white/40 backdrop-blur-sm p-3 rounded-xl border border-white/50">
              <motion.img
                whileHover={{ scale: 1.02 }}
                src={task.imageUrl}
                alt="Task"
                className="w-full max-w-md h-48 object-cover rounded-lg shadow-sm cursor-pointer"
                onClick={() => window.open(task.imageUrl, '_blank')}
              />
              <p className="text-xs text-slate-500 mt-2 text-center">Click to view full size</p>
            </div>
          </div>
        )}
      </motion.div>

      {/* Submission Form */}
      <motion.div
        variants={fadeInUp}
        className="bg-white/60 backdrop-blur-xl rounded-2xl border border-white/50 p-4 shadow-lg"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-6 h-6 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center shadow-sm"
            >
              <FiSend className="h-3 w-3 text-white" />
            </motion.div>
            <h2 className="text-lg font-semibold text-slate-800">Submit Your Work</h2>
          </div>
          
          {/* Task Status Indicator */}
          {task.hasSubmitted && (
            <div className="flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium">
              {task.isCompleted ? (
                <div className="flex items-center space-x-1 px-2 py-1 bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200/50 rounded-full">
                  <FiAward className="h-2 w-2 text-emerald-600" />
                  <span className="text-emerald-700">Completed</span>
                </div>
              ) : (
                <div className="flex items-center space-x-1 px-2 py-1 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/50 rounded-full">
                  <FiCheckCircle className="h-2 w-2 text-blue-600" />
                  <span className="text-blue-700">Submitted</span>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Show completion message for completed tasks */}
        {task.isCompleted ? (
          <div className="bg-emerald-50/60 backdrop-blur-sm p-4 rounded-xl border border-emerald-200/50">
            <div className="flex items-center space-x-2 mb-2">
              <FiAward className="h-4 w-4 text-emerald-600" />
              <h3 className="text-sm font-semibold text-emerald-700">Task Completed!</h3>
            </div>
            <p className="text-sm text-emerald-600">
              Congratulations! Your submission has been approved and you've earned {task.payableAmount} coins.
            </p>
          </div>
        ) : task.hasSubmitted ? (
          <div className="bg-blue-50/60 backdrop-blur-sm p-4 rounded-xl border border-blue-200/50">
            <div className="flex items-center space-x-2 mb-2">
              <FiCheckCircle className="h-4 w-4 text-blue-600" />
              <h3 className="text-sm font-semibold text-blue-700">Submission Pending</h3>
            </div>
            <p className="text-sm text-blue-600">
              Your submission is currently under review. You'll be notified once it's approved or rejected.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmission} className="space-y-3">
            <div>
              <label htmlFor="submissionDetails" className="block text-sm font-semibold text-slate-700 mb-2">
                Submission Details *
              </label>
              <textarea
                id="submissionDetails"
                value={submissionDetails}
                onChange={(e) => setSubmissionDetails(e.target.value)}
                placeholder="Describe your completed work, provide proof, links, or any relevant information..."
                rows={4}
                className="w-full px-3 py-2 bg-white/60 backdrop-blur-sm border border-white/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 resize-none text-sm transition-all duration-200"
                required
                disabled={submitting}
              />
              <p className="text-xs text-slate-500 mt-1">
                Please provide detailed information about your completed work
              </p>
            </div>

            <div className="flex items-center justify-between pt-3">
              <div className="flex items-center space-x-2">
                <HiSparkles className="h-4 w-4 text-emerald-600" />
                <div className="text-sm">
                  <span className="text-slate-600">You will earn:</span>
                  <span className="ml-2 text-emerald-600 font-bold">{task.payableAmount} coins</span>
                </div>
              </div>
              
              <motion.button
                type="submit"
                disabled={submitting || !submissionDetails.trim()}
                whileHover={{ scale: submitting ? 1 : 1.02 }}
                whileTap={{ scale: submitting ? 1 : 0.98 }}
                className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-semibold text-sm rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
              >
                {submitting ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full mr-2"
                    />
                    Submitting...
                  </>
                ) : (
                  <>
                    <FiSend className="h-3 w-3 mr-2" />
                    Submit Work
                  </>
                )}
              </motion.button>
            </div>
          </form>
        )}
      </motion.div>
    </motion.div>
  );
};

export default WorkerTaskDetails; 